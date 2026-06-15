# Match — Partida

> Entidade raiz do domínio. Representa uma partida completa de beach tennis do início ao fim.

---

## Objetivo

`Match` é o agregado raiz de todo o domínio. Ela contém, referencia e coordena todas as demais entidades: times, sets, games e eventos de ponto. Uma partida é a unidade de scout — tudo que o sistema registra e calcula está dentro de uma `Match`.

---

## Responsabilidades

- Ser o ponto de entrada para qualquer operação de registro de ponto
- Definir o formato e as regras que governam a progressão do placar
- Manter o estado atual da partida em todo momento (set corrente, game corrente, placar)
- Controlar o status do ciclo de vida (aguardando, em andamento, encerrada)
- Saber quem são os times e qual time está sacando
- Determinar quando a partida foi encerrada e quem venceu
- Ser a âncora de todas as estatísticas geradas

---

## Dados que deve armazenar

| Campo | Descrição |
|---|---|
| `id` | Identificador único da partida |
| `type` | Modalidade: `singles` (simples) ou `doubles` (duplas) |
| `status` | Estado atual: `pending` / `in_progress` / `finished` |
| `format` | Formato das regras: veja `MatchFormat` abaixo |
| `teamA` | Referência ao Time A |
| `teamB` | Referência ao Time B |
| `servingTeam` | Qual time está sacando no momento (`A` ou `B`) |
| `currentSetIndex` | Índice do set em andamento (base 0) |
| `sets` | Lista ordenada de todos os sets da partida |
| `winner` | Time vencedor (`A`, `B` ou `null` se em andamento) |
| `context` | Dados opcionais de contexto (torneio, local, categoria, observações) |
| `startedAt` | Data e hora de início |
| `finishedAt` | Data e hora de encerramento |
| `createdAt` | Data de criação do registro |

### MatchFormat

O formato define todas as regras que o `ScoringEngine` irá aplicar durante a partida.

| Campo | Descrição |
|---|---|
| `setsToWin` | Número de sets necessários para vencer a partida (ex: 2 em Melhor de 3) |
| `gamesPerSet` | Games para vencer um set regular (padrão: 6) |
| `tiebreakAt` | Em quantos games empatados ocorre tie-break (padrão: 6x6) |
| `tiebreakPoints` | Pontos para vencer o tie-break (padrão: 7, vencer por 2) |
| `lastSetIsSuperTiebreak` | Se o set decisivo é um super tie-break ao invés de set normal |
| `superTiebreakPoints` | Pontos para vencer o super tie-break (padrão: 10, vencer por 2) |

### MatchContext (opcional)

| Campo | Descrição |
|---|---|
| `tournamentName` | Nome do torneio |
| `location` | Local da partida |
| `category` | Categoria (ex: Masculino A, Misto B) |
| `notes` | Observações livres |

---

## Regras de Negócio

1. **Uma partida só pode receber eventos de ponto quando está com status `in_progress`.**
   - Tentativa de registrar ponto em partida `pending` ou `finished` deve ser rejeitada.

2. **Uma partida começa com exatamente 1 set criado e em andamento.**
   - O set inicial é criado automaticamente ao iniciar a partida.

3. **O time sacante na abertura da partida é definido na configuração e não muda retroativamente.**

4. **A partida é encerrada quando um dos times atinge o número de sets necessários para vencer.**
   - Ao encerrar, o status passa para `finished`, o `winner` é registrado e `finishedAt` é preenchido.

5. **O formato padrão do MVP é Melhor de 3 Sets, com super tie-break no terceiro set.**
   - Sets 1 e 2: regulares até 6 games, tie-break em 6x6 (7 pontos, vencer por 2).
   - Set 3 (decisivo): super tie-break até 10 pontos, vencer por 2.

6. **Uma partida pode ser iniciada sem vínculo com um torneio** — os dados de contexto são todos opcionais.

7. **Desfazer (undo) é sempre permitido enquanto a partida estiver `in_progress`**, sem limite de quantidade.
   - Um undo restaura o estado completo ao momento imediatamente anterior ao último ponto registrado.

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Team` | 1 para 2 | A partida tem exatamente um Time A e um Time B |
| `Set` | 1 para N | Uma partida tem um ou mais sets, em ordem |
| `PointEvent` | 1 para N | Todos os pontos registrados pertencem à partida |
| `Statistics` | 1 para 1 | A partida possui um agregado de estatísticas calculadas sobre seus eventos |
| `ScoringEngine` | usa | O motor de placar é acionado pela partida a cada novo evento de ponto |

---

## Estados do Ciclo de Vida

```
[pending] ──► [in_progress] ──► [finished]
                    │
                    └──► (undo disponível em qualquer ponto)
```

- `pending`: partida configurada mas não iniciada
- `in_progress`: partida em andamento, aceita eventos de ponto
- `finished`: partida encerrada, somente leitura

---

*Relacionado: [[02-Team]] · [[04-Set]] · [[06-PointEvent]] · [[07-Statistics]] · [[08-ScoringEngine]]*
