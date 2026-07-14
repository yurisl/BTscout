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

| Papel | Tamanho | Peso | Uso |
|---|---|---|---|
| Placar / Score | 44–88px (`clamp`) | 800 | Número do game, placar do Super Tie-Break |
| H1 | 32–36px | 800 | Título de tela |
| H2 | 22px | 750 | Título de seção/card |
| H3 | 18px | 700 | Subtítulo, nome de jogador em destaque |
| Corpo | 16px | 400–500 | Texto corrido |
| Botão | 15–16px | 750 | Rótulo de botão |
| Legenda / Label | 12–13px | 700–800, uppercase, tracking 0.06em | Rótulos maiúsculos, metadados |

## Regras específicas

- **Placar:** sempre `font-variant-numeric: tabular-nums`, `letter-spacing: -0.03em`, peso 800. Números do placar são o elemento tipográfico mais importante do produto — devem ser legíveis a distância, ao sol.
- **Títulos** (H1/H2): `letter-spacing` negativo (-0.02em a -0.03em) para compensar o peso alto e manter a leitura compacta.
- **Corpo:** `line-height: 1.55`, nunca mais estreito — respiro é parte da identidade.
- **Números em coluna** (estatísticas, placar por set): sempre `tabular-nums`, para que os dígitos se alinhem verticalmente.

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
