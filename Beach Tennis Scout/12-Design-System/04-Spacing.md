# Spacing, Radius & Shadow

---

## Espaçamento

Escala fixa — nunca um valor fora dela:

| Token | Valor | Uso típico |
|---|---|---|
| `--sp-1` | 4px | Espaço entre ícone e texto |
| `--sp-2` | 8px | Gap entre itens pequenos (grid de botões de evento) |
| `--sp-3` | 12px | Gap padrão anterior (mantido para elementos densos) |
| `--sp-4` | 16px | Padding interno de card, margem de tela em mobile |
| `--sp-5` | 24px | Gap entre cards, respiro entre seções pequenas |
| `--sp-6` | 32px | Respiro entre seções grandes |
| `--sp-7` | 48px | Respiro editorial (topo de tela, entre blocos principais) |
| `--sp-8` | 64px | Reservado para telas de apresentação/hero |

Regra geral pedida no briefing — "mais respiro, menos informação competindo": onde hoje o gap entre cards é 10–12px, o novo padrão é 20–24px; a margem de tela sobe de 16px para 20–24px onde houver espaço.

## Raio de borda

> **Zerado em todo o produto** — identidade "caixas quadradas". Todos os tokens de raio valem `0`; mantidos como variáveis (em vez de removidos) só para não obrigar a reescrever cada `border-radius: var(--r-…)` do código caso a decisão mude no futuro.

| Token | Valor | Uso |
|---|---|---|
| `--r-sm` | 0 | Inputs, chips, ícone-botão |
| `--r-md` | 0 | Botões |
| `--r-lg` | 0 | **Todos os cards** |
| `--r-pill` | 0 | Badges, indicador de saque, tags — apesar do nome "pill", também são quadrados |

Exceção deliberada: indicadores puramente decorativos e pequenos (≤10px) como o ponto de saque (`.dotA`/`.dotB`) e o marcador de jogador selecionado permanecem circulares (`border-radius: 50%`) — lêem como "dot", não como "caixa", e todo design system consultado como referência (Strava incluso) mantém esses indicadores redondos mesmo em interfaces de cantos retos.

## Sombras

Tingidas de grafite quente (`rgba(34,48,60,…)`), nunca preto puro — para combinar com o fundo areia em vez de destoar como sombra de sistema genérico.

| Token | Valor |
|---|---|
| `--sh-sm` | `0 1px 2px rgba(34,48,60,.05), 0 1px 1px rgba(34,48,60,.04)` |
| `--sh-md` | `0 6px 20px rgba(34,48,60,.08), 0 2px 6px rgba(34,48,60,.05)` |
| `--sh-lg` | `0 20px 48px rgba(34,48,60,.14), 0 6px 16px rgba(34,48,60,.07)` |

`sm` para cards em repouso, `md` para elementos elevados (dropdowns, dialogs), `lg` reservado para overlays de tela cheia.

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
