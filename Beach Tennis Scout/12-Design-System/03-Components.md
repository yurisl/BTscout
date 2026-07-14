# Components

---

## Botões

| Variante | Fundo | Texto | Borda | Uso |
|---|---|---|---|---|
| Primário | Azul Oceano (`--ocean`) | Branco | — | CTA principal (Iniciar Partida, Confirmar) |
| Outline | Branco | Grafite | 1.5px `--line` | Ação secundária (Cancelar) |
| Jogador — Dupla A | `--ocean-tint` | `--ocean-dark` | 2px `--ocean` | Passo 1 do registro |
| Jogador — Dupla B | `--coral-tint` | `--coral-dark` | 2px `--coral` | Passo 1 do registro |
| Winner | `--victory-tint` | `--victory-dark` | 1.5px verde claro | Passo 2 — categoria winner |
| Forçou erro do adversário | `--victory-tint` | `--victory-dark` | 1.5px verde claro | **Idêntico ao Winner** — mesma cor, peso e altura |
| Erro | `--error-tint` | `#B3221D` | 1.5px vermelho claro | Passo 2 — categoria erro |

**Especificação comum a todos:**
- Raio: 16px (md)
- Altura mínima: 52px (botões primários/jogador) · 48–50px (grid de evento, mais denso)
- Peso de fonte: 750
- Estado pressed: `transform: scale(0.97)`, 120ms
- Estado hover (desktop): escurece levemente o fundo ou intensifica a borda — nunca muda o raio ou o tamanho
- Estado disabled: opacidade 0.4, sem transform

O botão primário recebe uma sombra colorida suave (glow do Oceano) para parecer tocável sem depender de um degradê.

---

## Cards

- Raio: **20px** (lg) — fixo para todo card do produto
- Fundo: branco
- Borda: 1px `--line`
- Sombra: `--sh-sm` (sombra tingida de grafite quente, não preto puro)
- Espaçamento interno: 16–18px
- Divisor entre seções internas (ex: placar e data em um card de partida): 1px `--line`, nunca uma segunda sombra

---

## Inputs

- Raio: 12px (sm)
- Borda: 1.5px `--line`
- Fundo: branco
- Foco: borda `--ocean` + anel de 4px em `--ocean-tint` (nunca vermelho por padrão)
- Erro de validação: borda `--error` + texto de erro abaixo, só aparece após tentativa de submit

---

## Headers

- Fundo: **branco** (nunca escuro) — mudança central desta identidade em relação à versão anterior
- Borda inferior: 1px `--line`
- Ícones de ação: Lucide, 20px, dentro de um botão quadrado de 38–40px com raio `sm`
- Botão de ação em destaque (ex: Estatísticas): fundo `--ocean-tint`, ícone `--ocean-dark`
- Demais botões de ação: fundo `--card-grey`, ícone `--ink`

---

## Placar / Scoreboard

- Card branco, raio `lg`, sombra `sm`
- Número do placar: ver [[02-Typography]]
- Indicador de saque: ponto de 6–8px na cor do time sacando + nome do jogador
- Variante Super Tie-Break: fundo em gradiente Oceano→Turquesa (`linear-gradient(155deg, #0F5FA8, #00838F)`), texto branco — único lugar do produto com fundo colorido saturado no cabeçalho do placar, para marcar visualmente que é o momento decisivo da partida

---

*Relacionado: [[00-Indice]] · [[01-Colors]] · [[04-Spacing]]*
