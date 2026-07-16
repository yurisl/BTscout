# Design System — Beach Tennis Scout

> **Versão:** 1.0
> **Data:** 2026-07-14
> **Status:** Aprovado — identidade "Areia & Oceano"

---

## O que é esta pasta

Fonte oficial de verdade para toda decisão visual do produto — cores, tipografia, componentes, espaçamento, ícones e movimento. Foi criada **antes** de qualquer alteração de código, a partir de um Design Brief apresentado e aprovado pelo product owner em 2026-07-14.

Qualquer tela nova, ou evolução de tela existente, deve seguir os tokens documentados aqui em vez de inventar valores novos. Se um valor necessário não existir ainda neste sistema, ele deve ser adicionado aqui primeiro, e só depois usado no código.

---

## Conceito

Areia, mar e a luz do meio-dia. O Beach Tennis é jogado quase sempre de dia, ao ar livre, sobre areia clara — o produto precisa transmitir isso, e não a estética de um sistema administrativo. **O tema é claro — não existe modo escuro no produto.** Um fundo escuro reduziria a legibilidade exatamente na condição de uso mais comum: sol forte, tela do celular na mão, quadra ao fundo.

Referências de qualidade usadas: Apple Sports (números de placar), Strava (cards de atividade), Nike Run Club (botões confiantes), Airbnb (ritmo de espaçamento), Headspace (leveza visual, ausência de preto pesado), Apple Human Interface Guidelines (tamanho de toque, comportamento de movimento).

---

## Documentos

| Arquivo | Conteúdo |
|---|---|
| [[01-Colors]] | Paleta completa com HEX, uso de cada cor, regra "Dupla B nunca vermelho" |
| [[02-Typography]] | Pilha de fontes, escala tipográfica, pesos, números tabulares do placar |
| [[03-Components]] | Botão, card, input, header — especificação e estados |
| [[04-Spacing]] | Escala de espaçamento, raios de borda, sombras |
| [[05-Icons]] | Mapa emoji → Lucide, tamanhos de touch target |
| [[06-Motion]] | Durações, easings, o que anima e o que não anima |

---

## Ativos de marca

O logo oficial (palmeira + bola + wordmark "Beach Tennis Scout") está em
`07-UX/135ab4e5-ef73-4307-824c-43d7dccbc7f7.png`. Todos os formatos derivados
para publicação — PNG/SVG/PDF do logo, favicon, ícones PWA/Android/iOS,
splash screens e imagens de Open Graph/Banner — ficam organizados em
`07-UX/Assets/`, com detalhamento de uso e resolução no `README.md` dessa
pasta. Nenhum desses ativos altera cor, tipografia ou ilustração do logo
original — apenas empacota o mesmo material gráfico nos formatos exigidos por
cada plataforma.

---

## Regras inegociáveis

1. **Tema claro, sempre.** Não implementar `prefers-color-scheme: dark` nem qualquer alternância de tema no produto. Fundo escuro pode voltar a ser avaliado futuramente, mas nunca como identidade principal.
2. **Dupla B nunca é vermelho.** Vermelho é exclusivo do estado de erro. Dupla A é Azul Oceano, Dupla B é Coral.
3. **Winner e "Forçou erro do adversário" têm exatamente o mesmo destaque** — mesma cor (Verde Vitória), mesmo peso, mesma altura de botão. Não existe uma categoria "âmbar" à parte para erro forçado.
4. **Nenhum emoji em botão ou ícone de interface.** Usar `lucide-react`.
5. **Toda cor, espaçamento, raio e sombra vem de um token** (`var(--…)` em `globals.css`) — nunca um valor hardcoded solto em um módulo CSS.
6. **Nenhuma regra de negócio muda por causa deste sistema.** Esta pasta documenta apenas decisões visuais.

---

*Relacionado: [[07-UX/UX-Document]] · [[10-Wireframe]] · [[06-Arquitetura/Arquitetura]]*
