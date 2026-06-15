# ScoringEngine — Motor de Placar

> O serviço central de domínio que processa cada PointEvent e determina todas as transições de estado da partida: ponto → game → set → partida.

---

## Objetivo

`ScoringEngine` é o cérebro do domínio. Ele recebe um evento de ponto e uma foto do estado atual da partida, e devolve o novo estado completo: placar atualizado, game encerrado se necessário, set encerrado se necessário, saque trocado, partida encerrada se necessário.

Toda a inteligência das regras do beach tennis vive aqui. As entidades (`Match`, `Set`, `Game`) são estruturas de dados — o `ScoringEngine` é o comportamento.

O engine é uma **função pura de domínio**: dado um estado e um evento de entrada, produz um novo estado determinístico. Sem efeitos colaterais. Sem dependências externas. Testável em isolamento.

---

## Responsabilidades

- Validar se o evento de ponto pode ser aplicado no estado atual
- Incrementar a pontuação do game correto
- Detectar quando um game foi vencido e encerrá-lo
- Detectar quando um set foi vencido e encerrá-lo
- Criar o próximo game automaticamente quando necessário
- Criar o próximo set automaticamente quando necessário
- Calcular de quem é o saque após cada mudança de game
- Detectar a condição de tie-break e criar o game de tie-break
- Detectar quando a partida terminou e registrar o vencedor
- Processar undo: restaurar o estado ao ponto anterior ao último evento

---

## Dados que deve armazenar / receber

O `ScoringEngine` não é uma entidade persistida. É um serviço que opera sobre o estado da `Match`. Ele recebe:

| Entrada | Descrição |
|---|---|
| `matchState` | Estado completo atual da `Match` (sets, games, placar, saque) |
| `pointEvent` | O novo evento a ser aplicado |
| `matchFormat` | As regras configuradas para a partida |

E produz:

| Saída | Descrição |
|---|---|
| `newMatchState` | Novo estado completo após o evento |
| `transitions` | Lista de transições ocorridas (ex: `game_won`, `set_won`, `match_won`, `tiebreak_started`) |

---

## Fluxo Principal: Aplicar um Ponto

Ao receber um `PointEvent`, o engine executa a seguinte sequência de decisões:

```
ENTRADA: (matchState, pointEvent, matchFormat)

1. VALIDAR
   └─ A partida está in_progress?
   └─ O set atual está in_progress?
   └─ O game atual está in_progress?
   └─ O playerId pertence ao winnerSide?
   → Se alguma falhar: rejeitar o evento

2. REGISTRAR O PONTO NO GAME ATUAL
   └─ Incrementa pointsA ou pointsB do game corrente
   └─ Cria o PointEvent com sequenceNumber = último + 1
   └─ Armazena scoreSnapshotBefore

3. VERIFICAR SE O GAME FOI VENCIDO
   └─ Chama resolveGame(gameState, matchFormat)
   → Se NÃO vencido: fim do fluxo, retorna novo estado
   → Se VENCIDO:
       a. Registra winner e fecha o game
       b. Incrementa gamesA ou gamesB no set atual
       c. Atualiza o saque (ver seção "Progressão do Saque")
       d. Continua para passo 4

4. VERIFICAR SE O SET FOI VENCIDO
   └─ Chama resolveSet(setCurrentState, matchFormat)
   → Se NÃO vencido e NÃO tie-break: cria próximo game regular → fim
   → Se EMPATE no limiar de tie-break (6x6): cria game de tie-break → fim
   → Se VENCIDO:
       a. Registra winner e fecha o set
       b. Incrementa setsWon do time vencedor na match
       c. Continua para passo 5

5. VERIFICAR SE A PARTIDA FOI VENCIDA
   └─ Chama resolveMatch(matchState, matchFormat)
   → Se NÃO vencida: cria próximo set (regular ou super tie-break) → fim
   → Se VENCIDA:
       a. Registra winner na match
       b. Muda status para finished
       c. Registra finishedAt
       d. Fim do fluxo

SAÍDA: (newMatchState, transitions[])
```

---

## Progressão do Placar — Detalhe por Camada

### Camada 1: Ponto → Game

**Game Regular:**

| pointsA | pointsB | Situação |
|---|---|---|
| < 3 ou diferença ≥ 2 | — | Sem deuce ainda |
| 3 | 3 | Deuce (40:40) |
| 4 | 3 | Vantagem A |
| 3 | 4 | Vantagem B |
| 4 | 4+ (empate) | Deuce novamente |
| Diferença = 2 após deuce | — | Game vencido |

Condição de vitória:
```
(pointsA >= 4 OR pointsB >= 4)
AND abs(pointsA - pointsB) >= 2
```

**Game de Tie-Break:**

Pontuação numérica direta. Condição de vitória:
```
(pointsA >= tiebreakPoints OR pointsB >= tiebreakPoints)
AND abs(pointsA - pointsB) >= 2
```

(padrão: `tiebreakPoints = 7`)

**Super Tie-Break:**

Mesma lógica do tie-break, mas com `superTiebreakPoints` (padrão: 10). Não ocorre dentro de um `Game` — ocorre diretamente no `Set` decisivo.

---

### Camada 2: Game → Set

**Set Regular:**

Após cada game vencido, o engine verifica:

```
SE gamesA >= gamesPerSet AND (gamesA - gamesB) >= 2  →  Time A vence o set
SE gamesB >= gamesPerSet AND (gamesB - gamesA) >= 2  →  Time B vence o set
SE gamesA == tiebreakAt AND gamesB == tiebreakAt      →  Iniciar tie-break
CASO CONTRÁRIO                                         →  Criar próximo game regular
```

Exemplo completo de progressão de um set até 7x5:
```
0x0 → 1x0 → 2x0 → 3x0 → 3x1 → 4x1 → 4x2 → 5x2 → 5x3 → 5x4 → 5x5 → 6x5 → 7x5
                                                          ↑ Poderia ir a 6x6 → tie-break
                                                          mas foi 6x5 → 7x5 (vence por 2)
```

Exemplo com tie-break:
```
... → 5x5 → 6x5 → 6x6 → [tie-break] → 7x6
```

**Resultado do set com tie-break:** Sempre `7x6` para o vencedor — o placar do tie-break em si (ex: 8x6 em pontos) é armazenado separadamente em `tiebreakScoreA/B` e exibido no relatório, mas o placar de games do set é `7x6`.

---

### Camada 3: Set → Partida

Após cada set vencido:

```
SE setsWon(A) == setsToWin  →  Partida vencida pelo Time A
SE setsWon(B) == setsToWin  →  Partida vencida pelo Time B
CASO CONTRÁRIO               →  Criar próximo set
```

Ao criar o próximo set, o engine verifica:
```
SE (setsJogados + 1) == setsTotaisPossíveis AND lastSetIsSuperTiebreak
    →  Criar set do tipo super_tiebreak (sem games filhos)
CASO CONTRÁRIO
    →  Criar set regular
```

Exemplo Melhor de 3 com super tie-break:
```
Set 1: regular     → A vence 6x4
Set 2: regular     → B vence 7x5
Set 3: super TB    → A vence 10x7  →  Partida: A 2x1 B
```

---

## Progressão do Saque

O saque é uma informação de estado mantida pela partida e atualizada pelo engine.

### Saque em Games Regulares

- O saque troca de time a cada game vencido.
- Em duplas, a ordem de saque dentro do time deve ser mantida consistente ao longo do set.

Regra:
```
Após game vencido em set regular:
  servingTeam = time oposto ao que estava sacando
  servingPlayer = próximo jogador na ordem de rotação do novo time sacante
```

### Saque no Início de Cada Set

- O time que começa sacando no novo set é o que **não** sacou o último game do set anterior.
- Exceção: no set que inicia um tie-break ou super tie-break, a regra é aplicada conforme o regulamento vigente (geralmente: quem sacou o último game regular antes do tie-break).

### Saque no Tie-Break

O saque no tie-break alterna a cada 2 pontos, com o seguinte critério de início:
- Começa sacando o time que **não** sacou o último game do set (ou seja, o time que sacaria o próximo game se não fosse tie-break).
- Após o 1º ponto: troca.
- A cada 2 pontos subsequentes: troca.
- Em duplas, a ordem de alternância dentro do time segue a sequência de rotação do set.

```
Pontos do tie-break:
  Ponto 1:    Time A saca
  Ponto 2-3:  Time B saca
  Ponto 4-5:  Time A saca
  Ponto 6-7:  Time B saca
  ...
```

### Saque no Super Tie-Break

Mesma regra do tie-break: começa com o time que não sacou o último game, alterna a cada 2 pontos.

---

## Como Funciona o Tie-Break — Passo a Passo

**Contexto:** Set 1 chegou a 6x6 em games.

1. O engine detecta `gamesA == 6 AND gamesB == 6` após o game ser vencido.
2. Em vez de criar um game regular, cria um `Game` com `type: tiebreak`.
3. O game de tie-break usa pontuação numérica (1, 2, 3...) em vez de 0/15/30/40.
4. O saque começa com o time definido pela regra de saque do tie-break (ver acima) e alterna a cada 2 pontos.
5. O game termina quando `MAX(pointsA, pointsB) >= 7 AND ABS(pointsA - pointsB) >= 2`.
6. O vencedor do tie-break vence o game e, consequentemente, o set por `7x6`.
7. O placar exato do tie-break (ex: `8x6`) é registrado em `tiebreakScoreA/B` no set.
8. O set é encerrado com o vencedor registrado.
9. O engine verifica se a partida foi decidida ou cria o próximo set.

---

## Como Funciona o Super Tie-Break — Passo a Passo

**Contexto:** Sets 1 e 2 foram vencidos por times diferentes. Início do Set 3 (decisivo).

1. O engine verifica: `(setNumber == setsTotaisPossíveis) AND lastSetIsSuperTiebreak`.
2. Cria um `Set` com `type: super_tiebreak` e **não cria nenhum `Game` filho**.
3. Pontos são registrados diretamente como `tiebreakScoreA/B` no set.
4. Cada `PointEvent` referencia o `setId` do set decisivo e tem `gameId: null`.
5. O saque alterna a cada 2 pontos (mesmo critério do tie-break).
6. O set termina quando `MAX(tiebreakScoreA, tiebreakScoreB) >= 10 AND ABS(tiebreakScoreA - tiebreakScoreB) >= 2`.
7. O vencedor do super tie-break vence o set e a partida.

**Por que não há game no super tie-break?**

O super tie-break substitui um set inteiro, não um game dentro de um set. Modelar como um `Game` dentro do `Set` seria semanticamente incorreto — o placar do super tie-break é o placar do set, não de um game dentro dele. A estrutura de dados reflete essa realidade: o set decisivo armazena diretamente o placar de pontos.

---

## Operação de Undo

O undo é a operação inversa de aplicar um ponto. O engine:

1. Recupera o último `PointEvent` da partida (maior `sequenceNumber`).
2. Lê o `scoreSnapshotBefore` armazenado neste evento.
3. Restaura o `matchState` completo para aquele snapshot.
4. Remove o `PointEvent` da lista (soft delete ou remoção física — a ser decidido na implementação).
5. Retorna o estado restaurado.

**Garantias do undo:**
- O estado após o undo é exatamente idêntico ao estado que existia antes daquele ponto ter sido registrado.
- O undo pode ser aplicado quantas vezes for necessário, recuando um ponto por vez.
- O undo desfaz transitions: se o game foi encerrado, ele é reaberto; se o set foi encerrado, ele é reaberto; se a partida foi encerrada, ela volta a `in_progress`.
- A sequência de `PointEvent`s restante após o undo é sempre uma sequência válida e consistente.

**Por que o `scoreSnapshotBefore` é importante?**

Sem o snapshot, o undo exigiria recalcular o estado percorrendo toda a lista de eventos desde o início — O(n). Com o snapshot, o undo é O(1): basta restaurar o estado salvo no último evento e removê-lo. Para o MVP, qualquer abordagem funciona (partidas têm ~200 pontos), mas o snapshot é a prática mais robusta.

---

## Regras de Negócio do Engine

1. **O engine nunca modifica um `PointEvent` criado.** Ele apenas cria novos ou remove o último (undo).

2. **Toda transição é determinística.** Dado o mesmo estado e o mesmo evento, o resultado é sempre o mesmo. Isso permite testes unitários exaustivos.

3. **O engine não conhece a UI.** Ele devolve o novo estado e a lista de transições; a camada de apresentação decide o que exibir (animação de placar, som, mensagem de fim de set, etc.).

4. **O engine não persiste nada.** Persistência é responsabilidade da camada de infraestrutura que chama o engine.

5. **O engine rejeita eventos inválidos** com um erro descritivo. Exemplos de rejeição:
   - Registrar ponto em partida encerrada
   - `playerId` que não pertence ao `winnerSide` declarado
   - `winnerSide` inválido (não é `A` nem `B`)

6. **Formatos de partida são configuráveis via `MatchFormat`.** O engine não tem valores hardcoded — ele lê o formato da partida para tomar todas as decisões. Isso permite suportar Pro Set, Melhor de 3 e qualquer variante futura sem alterar o engine.

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Match` | opera sobre | Lê e produz o estado da partida |
| `Set` | cria / encerra | Abre novos sets e encerra sets vencidos |
| `Game` | cria / encerra | Abre novos games e encerra games vencidos |
| `PointEvent` | cria / remove | Registra o evento e remove no undo |
| `Statistics` | dispara recálculo | Após cada evento, as estatísticas são recalculadas |
| `MatchFormat` | lido por | Todas as regras são lidas do formato configurado |

---

## Resumo das Transições Possíveis

| Transição | Condição |
|---|---|
| `point_scored` | Sempre que um ponto válido é registrado |
| `game_won` | Ponto que fecha um game (regular ou tie-break) |
| `set_won` | Game que fecha um set |
| `tiebreak_started` | Empate em `tiebreakAt` games (ex: 6x6) |
| `super_tiebreak_started` | Início do set decisivo com super tie-break |
| `match_won` | Set que fecha a partida |
| `serve_changed` | Mudança de saque após game (ou a cada 2 pontos no tie-break) |
| `undo_applied` | Operação de undo bem-sucedida |

---

*Relacionado: [[01-Match]] · [[04-Set]] · [[05-Game]] · [[06-PointEvent]] · [[07-Statistics]]*
