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

- Tamanho padrão: 20px dentro de um touch target de 38–40px
- Cor: herda do texto do botão (`currentColor`) — nunca uma cor fixa própria
- Botão de destaque (Estatísticas): ícone em `--ocean-dark` sobre fundo `--ocean-tint`
- Demais botões de ação: ícone em `--ink` sobre fundo `--card-grey`

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
