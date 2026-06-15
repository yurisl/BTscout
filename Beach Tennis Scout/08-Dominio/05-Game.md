# Game — Game

> Representa uma subdivisão de um set composta por pontos. O time que atingir 4 pontos com vantagem mínima de 2 vence o game.

---

## Objetivo

`Game` é a menor unidade de placar visível no marcador principal (0, 15, 30, 40, Vantagem). Cada game acumula pontos até que um time vença. O resultado do game incrementa o placar de games do set correspondente.

Há três tipos de game no domínio: o game regular, o tie-break e o super tie-break. As regras de pontuação diferem entre eles.

---

## Responsabilidades

- Armazenar o placar de pontos de cada time no game atual
- Saber se está em vantagem (`deuce`/`advantage`)
- Saber se é um game regular, tie-break ou super tie-break
- Determinar quando foi encerrado e quem venceu
- Registrar a sequência de eventos de ponto que o compõem

---

## Dados que deve armazenar

| Campo | Descrição |
|---|---|
| `id` | Identificador único do game |
| `setId` | Set ao qual pertence |
| `matchId` | Partida ao qual pertence |
| `gameNumber` | Número sequencial do game no set (1, 2, 3...) |
| `type` | Tipo: `regular`, `tiebreak` ou `super_tiebreak` |
| `pointsA` | Pontos brutos do Time A (0, 1, 2, 3, 4...) |
| `pointsB` | Pontos brutos do Time B (0, 1, 2, 3, 4...) |
| `status` | `in_progress` ou `finished` |
| `winner` | Time vencedor do game (`A`, `B` ou `null`) |
| `servingTeam` | Time que está sacando neste game |
| `servingPlayer` | Jogador específico que está sacando (para tracking de ace/falta) |

---

## Progressão da Pontuação

### Game Regular

A pontuação de um game regular usa a nomenclatura tradicional do tênis:

| Pontos brutos | Exibição |
|---|---|
| 0 | 0 |
| 1 | 15 |
| 2 | 30 |
| 3 | 40 |
| 3 vs 3 | Deuce (40:40) |
| 4 vs 3 (após deuce) | Vantagem Time A |
| 3 vs 4 (após deuce) | Vantagem Time B |

**Regra de vitória — Game Regular:**
- Sem deuce: o primeiro time a atingir 4 pontos (equivalente a 40 + mais 1) vence o game.
- Com deuce (3x3): o time que primeiro abrir 2 pontos de vantagem vence. Não há limite de deuces.

```
Fluxo sem deuce:
  0:0 → 15:0 → 30:0 → 40:0 → Game Time A

Fluxo com deuce:
  40:40 → Vantagem A → 40:40 (A errou) → Vantagem B → Game Time B
```

### Tie-Break (7 pontos)

O tie-break é jogado com pontuação numérica direta (1, 2, 3...), sem a nomenclatura 0/15/30/40.

**Regra de vitória — Tie-Break:**
- Vence o time que primeiro atingir `tiebreakPoints` (padrão: 7) com vantagem mínima de 2 pontos.
- Não há limite máximo de pontos — o tie-break continua indefinidamente em situação de empate até que alguém abra 2 de vantagem.

```
Exemplos de placar final de tie-break:
  7x0  ✓   7x3  ✓   7x5  ✓   8x6  ✓   12x10  ✓
  7x6  ✗   (insuficiente — empate em 6 antes de alguém chegar a 7 não abre 2 de vantagem)
```

**Saque no Tie-Break:**
- O time que sacou o último game do set começa o tie-break sacando.
- Após o 1º ponto, o saque alterna a cada 2 pontos.
- Em duplas, os jogadores se alternam dentro do time conforme a regra padrão.

### Super Tie-Break (10 pontos)

O super tie-break usa a mesma lógica numérica do tie-break regular, mas com pontuação estendida.

**Regra de vitória — Super Tie-Break:**
- Vence o time que primeiro atingir `superTiebreakPoints` (padrão: 10) com vantagem mínima de 2 pontos.

```
Exemplos de placar final de super tie-break:
  10x0  ✓   10x5  ✓   10x8  ✓   11x9  ✓   15x13  ✓
  10x9  ✗   (falta 1 ponto de vantagem)
```

**Importante:** No formato padrão do MVP (Melhor de 3 sets, super tie-break no 3º set), o super tie-break **substitui o 3º set inteiro**. Não há games dentro dele. A pontuação do super tie-break é registrada diretamente no `Set`, não em um `Game` filho.

Modelagem:
- O `Set` decisivo tem `type: super_tiebreak`
- Não cria objetos `Game`
- Pontos vão diretamente para `tiebreakScoreA` e `tiebreakScoreB` no set
- Cada `PointEvent` referencia o set decisivo diretamente, sem game intermediário

---

## Regras de Negócio

1. **Um game só está ativo quando está `in_progress`.** Um game encerrado não recebe mais eventos.

2. **O tipo do game é definido pelo `ScoringEngine` no momento da criação.** Um game nunca muda de tipo após criado.

3. **A pontuação bruta (inteiros) é o dado armazenado.** A conversão para 0/15/30/40/Vantagem é responsabilidade da camada de apresentação (UI), não do domínio.

4. **Em deuce, os pontos brutos continuam incrementando** — o domínio armazena 3, 4, 5, 6... e a UI converte para "Deuce" ou "Vantagem" conforme a diferença.

5. **O saque muda ao final de cada game regular.** No tie-break, o saque alterna a cada 2 pontos. O `ScoringEngine` é responsável por calcular e atualizar o `servingTeam`.

6. **Um game encerrado registra seu vencedor de forma imutável** (exceto via undo).

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Set` | N para 1 | Pertence a um set |
| `Match` | N para 1 | Pertence a uma partida |
| `PointEvent` | 1 para N | Contém os eventos de ponto que o compõem |
| `ScoringEngine` | usa | O engine cria, atualiza e encerra games |

---

*Relacionado: [[04-Set]] · [[06-PointEvent]] · [[08-ScoringEngine]]*
