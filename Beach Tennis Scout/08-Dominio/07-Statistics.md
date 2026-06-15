# Statistics — Estatísticas

> Representa o agregado calculado de performance de jogadores e times ao longo de uma partida, derivado exclusivamente dos PointEvents registrados.

---

## Objetivo

`Statistics` é o produto final do sistema para o usuário. Após cada ponto registrado, as estatísticas são recalculadas e apresentadas em tempo real. Ao final da partida, formam o relatório completo de performance.

`Statistics` nunca é uma entidade primária que recebe escrita direta. Ela é sempre *calculada* a partir da sequência de `PointEvent`s. Isso garante que:
- Qualquer undo automaticamente corrige as estatísticas (recalcula do zero ou reverte o delta)
- Não há divergência entre o que foi registrado e o que é exibido
- É possível gerar estatísticas por segmento (por set, por game, por período)

---

## Responsabilidades

- Agregar e sumarizar os `PointEvent`s em números interpretáveis
- Calcular métricas por jogador e por time
- Calcular métricas de saque separadamente
- Ser recalculada a cada novo evento ou undo
- Ser a fonte de dados para a tela de resumo pós-jogo e para o painel de stats em tempo real

---

## Estrutura de Dados das Estatísticas

As estatísticas são organizadas em dois níveis: **por time** e **por jogador**.

### Estatísticas por Time

| Métrica | Descrição |
|---|---|
| `totalPoints` | Total de pontos ganhos pelo time na partida |
| `totalPointsPerSet[]` | Total de pontos ganhos por set |
| `gamesWon` | Total de games vencidos |
| `setsWon` | Total de sets vencidos |
| `totalWinners` | Soma de todos os winners de todos os jogadores do time |
| `totalErrors` | Soma de todos os erros não-forçados do time |
| `totalForcedErrors` | Soma de pontos ganhos por erro forçado do adversário |
| `winnersBySubtype` | Detalhamento de winners por subtipo (ver tabela abaixo) |
| `errorsBySubtype` | Detalhamento de erros por subtipo |
| `serveStats` | Estatísticas consolidadas de saque do time |

### Estatísticas por Jogador

Cada jogador dentro de um time tem seu próprio conjunto:

| Métrica | Descrição |
|---|---|
| `playerId` | Referência ao jogador |
| `totalPoints` | Pontos ganhos pelo jogador (como executor da ação) |
| `winners` | Detalhamento de winners por subtipo |
| `errors` | Detalhamento de erros por subtipo |
| `forcedErrors` | Pontos onde forçou o erro do adversário |
| `serveStats` | Estatísticas de saque individuais |

### Winners por Subtipo

| Subtipo | Campo |
|---|---|
| Winner Direita | `winnerDir` |
| Winner Esquerda | `winnerEsq` |
| Winner Paralelo | `winnerPar` |
| Winner Cruzado | `winnerCru` |
| Lob | `lob` |
| Smash | `smash` |
| Drop Shot | `drop` |
| Ace | `ace` |
| **Total** | soma de todos acima |

### Erros por Subtipo

| Subtipo | Campo |
|---|---|
| Erro Direita | `erroDir` |
| Erro Esquerda | `erroEsq` |
| Erro Lob | `erroLob` |
| Erro Smash | `erroSmash` |
| Erro Saque | `erroSaque` |
| Dupla Falta | `duplaFalta` |
| **Total** | soma de todos acima |

### Estatísticas de Saque

| Métrica | Descrição |
|---|---|
| `totalServesFirst` | Total de primeiros saques realizados |
| `totalServesFirstIn` | Primeiros saques que entraram |
| `firstServePercentage` | `totalServesFirstIn / totalServesFirst × 100` |
| `totalServesSecond` | Total de segundos saques realizados (após falta no 1º) |
| `totalServesSecondIn` | Segundos saques que entraram |
| `secondServePercentage` | `totalServesSecondIn / totalServesSecond × 100` |
| `aces` | Aces (primeiros e segundos saques diretos) |
| `doubleFaults` | Duplas faltas |
| `pointsWonOnFirstServe` | Pontos ganhos quando o primeiro saque entrou |
| `pointsWonOnSecondServe` | Pontos ganhos quando o segundo saque entrou |

---

## Como Winners e Erros Impactam os Números

### Winners

Um `PointEvent` com `pointType = 'winner'`:

1. Incrementa `winners[subtipo]` do `playerId` que executou
2. Incrementa `totalWinners` do time vencedor
3. Incrementa `totalPoints` do time vencedor
4. Incrementa `totalPoints` do jogador executor

**Exemplo:** Ana executa um Smash vencedor.
- `statistics.teamA.totalPoints += 1`
- `statistics.teamA.totalWinners += 1`
- `statistics.teamA.winnersBySubtype.smash += 1`
- `statistics.playerAna.totalPoints += 1`
- `statistics.playerAna.winners.smash += 1`

### Erros

Um `PointEvent` com `pointType = 'error'`:

1. Incrementa `errors[subtipo]` do `playerId` que cometeu o erro
2. Incrementa `totalErrors` do time do jogador que errou
3. Incrementa `totalPoints` do time **adversário** (quem ganhou o ponto)

> O erro é uma métrica de quem errou, mas o ponto vai para quem não errou. Essas são dimensões independentes.

**Exemplo:** Cris comete um Erro de Esquerda.
- `statistics.teamB.totalErrors += 1`
- `statistics.teamB.errorsBySubtype.erroEsq += 1`
- `statistics.playerCris.errors.erroEsq += 1`
- `statistics.teamA.totalPoints += 1` ← ponto vai para o adversário

### Forçou Erro

Um `PointEvent` com `pointType = 'forced_error'`:

1. Incrementa `forcedErrors` do `playerId` que forçou
2. Incrementa `totalForcedErrors` do time que forçou
3. Incrementa `totalPoints` do time que forçou

> `forced_error` é tratado como uma vitória de quem forçou, não como um erro de quem cedeu. Não incrementa nenhum campo de erro do adversário.

### Ace

Um `PointEvent` com subtipo `ACE`:

1. Segue as mesmas regras de winner (incrementa winners do jogador, totalPoints do time)
2. Adicionalmente: `statistics.playerX.serveStats.aces += 1`
3. Se `isFirstServe = true`: alimenta `firstServePercentage`

### Dupla Falta

Um `PointEvent` com subtipo `DUPLA_FALTA`:

1. Segue as mesmas regras de erro (incrementa erros do jogador, ponto vai ao adversário)
2. Adicionalmente: `statistics.playerX.serveStats.doubleFaults += 1`
3. Incrementa `totalServesSecond` (porque a dupla falta ocorre no 2º saque)

---

## Recálculo e Undo

As estatísticas são calculadas de duas formas possíveis na implementação:

### Opção A — Recálculo completo

Ao receber qualquer novo evento ou undo, percorre toda a lista de `PointEvent[]` e recalcula tudo do zero. Simples de implementar, correto por construção, e suficientemente rápido para o MVP (uma partida tem no máximo ~200 pontos).

### Opção B — Delta incremental

Mantém o estado acumulado e aplica ou reverte o delta de um único evento. Mais eficiente, mas exige cuidado para manter a consistência. Recomendado para V2+ quando o volume de dados aumentar.

**No MVP, a Opção A é preferível pela simplicidade e confiabilidade.**

---

## Regras de Negócio

1. **Estatísticas nunca são escritas diretamente pelo usuário.** São sempre calculadas a partir dos eventos.

2. **Toda operação de undo deve recalcular as estatísticas.** O estado anterior deve refletir exatamente os eventos remanescentes.

3. **Estatísticas por set** são um subconjunto dos eventos filtrados por `setId`. A mesma lógica de cálculo se aplica, apenas sobre um subconjunto diferente.

4. **A separação entre "ponto ganho" e "erro cometido" é intencional.** Um time pode ter menos erros que o adversário mas mais pontos — o que é possível quando ganha muitos pontos por forced_error do adversário.

5. **O total de pontos de uma partida sempre fechará:** `totalPoints(A) + totalPoints(B) = totalPointEvents(match)`.

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Match` | N para 1 | As estatísticas pertencem a uma partida |
| `PointEvent` | calculado de | Os eventos são a matéria-prima |
| `Player` | referencia | As métricas individuais referenciam jogadores |
| `Team` | referencia | As métricas por time referenciam os times |
| `Set` | filtro | Estatísticas podem ser calculadas por set |

---

*Relacionado: [[01-Match]] · [[03-Player]] · [[06-PointEvent]]*
