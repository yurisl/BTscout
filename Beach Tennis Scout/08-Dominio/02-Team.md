# Team — Time

> Representa um dos dois lados de uma partida. Pode ser um jogador solo (simples) ou uma dupla (duplas).

---

## Objetivo

`Team` agrupa os jogadores de um mesmo lado da quadra e serve como sujeito das operações de placar. Quando o `ScoringEngine` registra que "o Time A ganhou o ponto", é o `Team A` que recebe o crédito — e seus jogadores individuais são identificados para fins de estatística.

`Team` é uma entidade leve: não contém lógica de placar. Ele apenas identifica e agrupa. A lógica de quem ganhou o quê fica no `ScoringEngine` e nas `Statistics`.

---

## Responsabilidades

- Agrupar os jogadores que compõem um lado da quadra
- Ser identificado como `A` ou `B` dentro do contexto de uma partida
- Fornecer os jogadores disponíveis para seleção no momento do registro de um ponto
- Servir como referência para atribuição de estatísticas

---

## Dados que deve armazenar

| Campo | Descrição |
|---|---|
| `id` | Identificador único do time dentro da partida |
| `side` | Lado na partida: `A` ou `B` |
| `players` | Lista de jogadores do time (1 em simples, 2 em duplas) |
| `matchId` | Partida à qual este time pertence |

---

## Regras de Negócio

1. **Em partidas simples (`singles`), o time tem exatamente 1 jogador.**

2. **Em partidas duplas (`doubles`), o time tem exatamente 2 jogadores.**

3. **Um time não pode ter 0 jogadores** — a partida não pode ser iniciada sem os dois times devidamente preenchidos.

4. **Os nomes dos jogadores são obrigatórios para identificação na UI e nos relatórios.**
   - No MVP, jogadores são nomes inline (string), sem cadastro em banco.
   - A partir da V2, jogadores podem ter perfis persistentes vinculados via `Player`.

5. **O time não muda durante a partida.** A composição é definida na configuração e não pode ser alterada após o início.

6. **Os times são identificados como A e B durante toda a partida**, independente de quem está no lado esquerdo ou direito da quadra. A troca de lado física (obrigatória no beach tennis) não altera a identificação dos times no sistema.

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Match` | N para 1 | O time pertence a uma partida específica |
| `Player` | 1 para N | O time contém 1 ou 2 jogadores |
| `PointEvent` | referenciado por | Cada evento de ponto referencia o time vencedor |
| `Statistics` | referenciado por | As estatísticas são agregadas por time e por jogador |

---

*Relacionado: [[01-Match]] · [[03-Player]] · [[06-PointEvent]] · [[07-Statistics]]*
