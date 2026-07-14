# Icons

---

## Biblioteca

**`lucide-react`** — stroke 2px, cantos arredondados, grade 24×24, MIT/SVG, tree-shakeable. Nenhum emoji em botão ou ícone de interface.

## Mapa emoji → ícone

| Antes (emoji) | Contexto | Depois (Lucide) | Componente ícone |
|---|---|---|---|
| 📊 | Botão Estatísticas | bar-chart-2 | `ChartColumnIncreasing` (ou `BarChart2` em versões antigas) |
| ⏸ | Botão Pausar | pause | `Pause` |
| ↩ | Botão Desfazer | undo-2 | `Undo2` |
| ✕ | Fechar painel de estatísticas | x | `X` |
| 🗑 | Excluir partida (Home) | trash-2 | `Trash2` |
| ✚ (texto) | Nova Partida | plus | `Plus` |
| ← (texto) | Voltar | chevron-left | `ChevronLeft` |

## Especificação

- Tamanho padrão: 20px dentro de um touch target de 38–40px (18px nos botões de golpe, mais densos)
- Cor: herda do texto do botão (`currentColor`) — nunca uma cor fixa própria
- Botão de destaque (Estatísticas): ícone em `--ocean-dark` sobre fundo `--ocean-tint`
- Demais botões de ação: ícone em `--ink` sobre fundo `--card-grey`

## Mapa golpe → ícone (grade de registro de ponto)

O ícone identifica o **golpe**; a cor do botão (verde/vermelho) identifica o **resultado** (winner/erro). Por isso o mesmo golpe em winners e em erros reaproveita o mesmo ícone — só muda a cor herdada do botão.

| Golpe | Ícone Lucide | Aparece em |
|---|---|---|
| Paralela / Direita | `ArrowUpRight` | Winner e Erro |
| Cruzada / Esquerda | `ArrowUpLeft` | Winner e Erro |
| Lob | `TrendingUp` | Winner e Erro |
| Smash | `Zap` | Winner e Erro |
| Drop | `ArrowDown` | Winner e Erro |
| Ace | `Target` | Só Winner (exclusivo do sacador) |
| Rainbow | `Rainbow` | Winner e Erro |
| Gancho | `RotateCcw` | Winner e Erro |
| Forçou o erro | `ShieldCheck` | Só Winner (categoria `forced_error`) |
| Erro de Saque | `CircleSlash` | Só Erro (exclusivo do sacador) |
| Erro Forçado | `AlertCircle` | Só Erro |

Implementado em `apps/web/src/components/PointRegistration.tsx` (`SHOT_ICON`).

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
