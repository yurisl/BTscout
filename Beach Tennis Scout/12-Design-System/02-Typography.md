# Typography

---

## Pilha de fontes

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
             "Inter", "Segoe UI", Roboto, sans-serif;
```

Fontes de sistema, não webfont carregada. SF Pro no iOS/Mac, Segoe UI no Windows, Roboto no Android — Inter como referência de design (mesma métrica e proporção da SF Pro, mas nunca precisa ser baixada). Zero custo de carregamento, renderização nativa perfeita em cada plataforma. Decisão deliberada para um produto que também será PWA/App Store/Play Store: cada SO já tem a fonte certa instalada.

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
