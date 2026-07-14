# Typography

---

## Pilha de fontes

> **Revisão de 2026-07-14:** a decisão original (só fonte de sistema, zero webfont) foi substituída por um pedido explícito de identidade mais "descolada": **Roboto Flex**, uma fonte variável do Google Fonts, carregada via `next/font/google` em `apps/web/src/app/layout.tsx`.

```css
font-family: var(--font-roboto-flex), -apple-system, BlinkMacSystemFont,
             "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
```

- **Por que ainda é seguro para PWA/offline:** `next/font` faz *self-host* do arquivo da fonte no próprio build — não existe request para `fonts.googleapis.com` em runtime, então a garantia de funcionamento offline da decisão original continua válida. A diferença é que agora existe um arquivo de fonte para baixar/cachear no primeiro carregamento (mitigado por `display: 'swap'` e fallback com métricas casadas, gerado automaticamente pelo Next — sem *layout shift* perceptível).
- **Eixo variável `wdth`:** Roboto Flex é uma fonte de eixo variável; o produto usa o eixo de largura (`wdth`) para dar um tratamento mais largo/expressivo — "descolado" — a títulos, botões e ao placar, sem precisar de uma segunda família tipográfica. Corpo de texto fica no eixo padrão (100), para não comprometer a leitura.

| Elemento | `font-variation-settings` |
|---|---|
| Placar (`.pointDisplay`, `.setsCount`) | `'wdth' 118` |
| H1 | `'wdth' 112` |
| H2 | `'wdth' 110` |
| H3 | `'wdth' 108` |
| Botões (`.btn`) | `'wdth' 108` |
| Corpo, labels, legendas | padrão (100) — sem override |

---

## Escala tipográfica

> **Revisão "premium discreto":** a primeira versão desta escala usava peso 750–800 (Bold/ExtraBold) quase em tudo — títulos, botões, labels — o que lia como "gritado" em vez de premium. O peso máximo (800) passou a ser **exclusividade do placar**, o único elemento que deve saltar aos olhos. Todo o resto do produto desce para a faixa SemiBold/Medium, com mais tracking nas legendas maiúsculas para compensar o peso mais leve.

| Papel | Tamanho | Peso | Uso |
|---|---|---|---|
| Placar / Score | 44–88px (`clamp`) | 800 | Número do game, placar do Super Tie-Break — **único lugar com peso máximo** |
| H1 | 32–36px | 650 | Título de tela |
| H2 | 22px | 600 | Título de seção/card |
| H3 | 18px | 600 | Subtítulo, nome de jogador em destaque |
| Corpo | 16px | 400 | Texto corrido |
| Botão | 15–16px | 600 | Rótulo de botão |
| Legenda / Label | 12–13px | 500–600, uppercase, tracking 0.06–0.07em | Rótulos maiúsculos, metadados |
| Dado secundário (stats, tabelas) | 13–16px | 600–700 | Números que não são o placar, mas ainda merecem destaque tabular |

## Regras específicas

- **Placar:** sempre `font-variant-numeric: tabular-nums`, `letter-spacing: -0.03em`, peso 800. Números do placar são o elemento tipográfico mais importante do produto — devem ser legíveis a distância, ao sol, e são a única exceção à regra de peso leve abaixo.
- **Títulos** (H1/H2): `letter-spacing` levemente negativo (-0.005em a -0.01em) — mais sutil que antes, já que o peso mais leve não precisa de tanta compensação.
- **Corpo:** `line-height: 1.55`, nunca mais estreito — respiro é parte da identidade.
- **Números em coluna** (estatísticas, placar por set): sempre `tabular-nums`, para que os dígitos se alinhem verticalmente.

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
