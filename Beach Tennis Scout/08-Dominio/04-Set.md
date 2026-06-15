# Set — Set

> Representa uma subdivisão da partida composta por games. O time que vencer o número definido de games (ou o tie-break/super tie-break) vence o set.

---

## Objetivo

`Set` é a unidade de pontuação intermediária entre a partida e o game. Uma partida é uma série de sets; cada set é uma série de games. O `Set` sabe quantos games cada time tem, se está em tie-break, e quando deve ser encerrado.

A lógica de quando o set termina e o que acontece a seguir é de responsabilidade do `ScoringEngine`, mas o `Set` armazena o estado que o engine precisa para tomar essas decisões.

---

## Responsabilidades

- Armazenar o placar de games de cada time
- Saber se o set é do tipo regular, tie-break ou super tie-break
- Registrar quando foi encerrado e quem venceu
- Conter os games que o compõem

---

## Dados que deve armazenar

| Campo | Descrição |
|---|---|
| `id` | Identificador único do set |
| `matchId` | Partida a que pertence |
| `setNumber` | Número sequencial do set na partida (1, 2, 3...) |
| `type` | Tipo do set: `regular`, `tiebreak` ou `super_tiebreak` |
| `gamesA` | Número de games vencidos pelo Time A neste set |
| `gamesB` | Número de games vencidos pelo Time B neste set |
| `tiebreakScoreA` | Pontos do Time A no tie-break ou super tie-break (quando aplicável) |
| `tiebreakScoreB` | Pontos do Time B no tie-break ou super tie-break (quando aplicável) |
| `status` | `in_progress` ou `finished` |
| `winner` | Time vencedor do set (`A`, `B` ou `null`) |
| `games` | Lista de games que compõem o set |

---

## Progressão do Placar de Games (Set Regular)

Cada game vencido incrementa o contador de games do time vencedor em 1. O set é encerrado quando uma das condições abaixo é atendida:

### Condição 1 — Vitória direta

Um time atinge o número definido em `gamesPerSet` (padrão: 6) com vantagem de pelo menos 2 games sobre o adversário.

```
Exemplos de placares que encerram o set:
  6x0  ✓   6x1  ✓   6x2  ✓   6x3  ✓   6x4  ✓
  7x5  ✓   (necessário quando há empate em 5x5, vence quem chegar a 7 com 2 de vantagem)
```

### Condição 2 — Tie-break

Quando ambos os times atingem `tiebreakAt` games (padrão: 6x6), o set não termina com um game regular. Em vez disso, é jogado um tie-break. O time que vencer o tie-break vence o set por `7x6`.

```
Progressão:
  5x5  →  6x5  →  7x5  (venceu sem tie-break)
  5x5  →  6x5  →  6x6  →  [tie-break]  →  7x6 (vencedor do tie-break)
```

### Set Decisivo — Super Tie-break

Se o formato da partida define `lastSetIsSuperTiebreak: true`, o último set possível (ex: 3º set em Melhor de 3) não é um set regular com games. É diretamente um super tie-break jogado até o número de pontos definido em `superTiebreakPoints` (padrão: 10, vencer por 2).

Nesse caso:
- O set já começa com `type: super_tiebreak`
- Não há games dentro dele — a pontuação é diretamente em `tiebreakScoreA` e `tiebreakScoreB`
- O set termina quando um time atinge 10 pontos com vantagem mínima de 2

---

## Regras de Negócio

1. **Um set só pode ter um game ativo por vez.** O game anterior deve estar encerrado antes de um novo ser criado.

2. **Em sets regulares, o contador de games nunca ultrapassa `gamesPerSet + 1`** — a não ser no cenário 7x5, onde um time pode chegar a 7 games para ganhar sem tie-break.

3. **O tie-break é um tipo especial de game** criado pelo `ScoringEngine` quando ambos chegam a 6x6. Ele tem suas próprias regras de pontuação (ver [[05-Game]] e [[08-ScoringEngine]]).

4. **O super tie-break substitui o set inteiro**, não é um game dentro de um set. O set decisivo não cria games regulares — apenas acumula pontos diretamente.

5. **Um set encerrado não recebe mais eventos de ponto.** Todo ponto novo vai para o próximo set (criado automaticamente pelo `ScoringEngine`).

6. **O vencedor do set é registrado no momento do encerramento** e não muda.

7. **O placar de um set encerrado nunca é alterado**, exceto em operações de undo, que restauram o estado anterior completo.

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Match` | N para 1 | Pertence a uma partida |
| `Game` | 1 para N | Contém zero ou mais games (zero no super tie-break) |
| `PointEvent` | referenciado por | Os eventos de ponto referenciam o set em que ocorreram |
| `ScoringEngine` | usa | O engine lê e atualiza o estado do set |

---

*Relacionado: [[01-Match]] · [[05-Game]] · [[06-PointEvent]] · [[08-ScoringEngine]]*
