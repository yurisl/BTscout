# Motion

---

## Princípio

Movimento confirma a ação — não decora a tela. Nada de bounce exagerado. Toda animação respeita `prefers-reduced-motion: reduce` (desativada nesse caso).

## Especificação

| Interação | Efeito | Duração/Easing |
|---|---|---|
| Toque em botão | `transform: scale(0.97)` | 120ms ease |
| Placar atualiza | slide + fade do novo valor | 200ms ease-out |
| Painel de Estatísticas abre | slide lateral (desktop) / slide-up (mobile) | 200ms ease-out |
| Toast de transição (Game!, Set!, Troca de Lado!) | pop-in, permanece, fade-out | pop 150ms, visível 1.8s |
| Troca de tela (navegação) | fade | 150ms |

## O que **não** anima

- Números de estatística individuais (mudam instantaneamente — evita distração durante o registro)
- Bordas de foco (mudam instantaneamente por acessibilidade)
- Nenhuma transição de página do tipo slide/parallax entre rotas

---

*Relacionado: [[00-Indice]] · [[03-Components]]*
