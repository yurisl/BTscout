# Components

---

## Botões

> **Sem borda, sem raio.** Identidade "caixas quadradas": nenhum botão do produto tem `border` — a diferenciação entre variantes é feita só por preenchimento (cor sólida ou tint). Raio zerado em todos os cantos (ver [[04-Spacing]]).

| Variante | Fundo | Texto | Uso |
|---|---|---|---|
| Primário | Azul Oceano (`--ocean`) | Branco | CTA principal (Iniciar Partida, Confirmar) |
| Secundário (ghost) | `--card-grey` | Grafite | Ação secundária (Cancelar) |
| Perigo | `--error` | Branco | Excluir partida, ações destrutivas |
| Jogador — Dupla A | `--ocean-tint` | `--ocean-dark` | Passo 1 do registro |
| Jogador — Dupla B | `--coral-tint` | `--coral-dark` | Passo 1 do registro |
| Winner | `--victory-tint` | `--victory-dark` | Passo 2 — categoria winner |
| Forçou erro do adversário | `--victory-tint` | `--victory-dark` | **Idêntico ao Winner** — mesma cor, peso e altura |
| Erro | `--error-tint` | `#B3221D` | Passo 2 — categoria erro |

**Especificação comum a todos:**
- Raio: 0
- Borda: nenhuma
- Altura mínima: 52px (botões primários/jogador) · 48–52px (grid de evento, mais denso)
- Peso de fonte: 600 (ver revisão de escala em [[02-Typography]] — 800 fica reservado só para o placar)
- Estado pressed: `transform: scale(0.97)`, 120ms
- Estado hover (desktop): escurece/intensifica levemente o fundo — nunca adiciona borda
- Estado disabled: opacidade 0.4, sem transform

O botão primário recebe uma sombra colorida suave (glow do Oceano) para parecer tocável sem depender de borda ou degradê.

### Botões de golpe (grade de registro de ponto)

- Ícone (Lucide, 18px) empilhado acima do label — ver mapa completo em [[05-Icons]]
- Altura fixa (60px) independente do tamanho do label: "Forçou o erro" (2 linhas) e "Lob" (1 linha) rendem exatamente do mesmo tamanho
- Grade sempre 3 colunas; grupo Winners+Forçou (9 itens) e grupo Erros (9 itens, desde a inclusão de "Drop") fecham em 3×3 sem sobra de coluna
- Cor do ícone herda a cor do texto do botão (verde em winners, vermelho em erros) — o ícone identifica o golpe, a cor identifica o resultado

---

## Cards

- Raio: 0 (fixo para todo card do produto — ver [[04-Spacing]])
- Fundo: branco
- Borda: 1px `--line` — **separador primário do card em repouso** (substituiu a sombra)
- Sombra: reservada para elementos flutuantes/overlay (modal, snackbar, menu de contexto, drawer) — nunca em um card em repouso na lista
- Espaçamento interno: 16–18px
- Divisor entre seções internas (ex: placar e data em um card de partida): 1px `--line`

---

## Inputs

- Raio: 0
- Borda: 1.5px `--line`
- Fundo: branco
- Foco: borda `--ocean` + anel de 4px em `--ocean-tint` (nunca vermelho por padrão)
- Erro de validação: borda `--error` + texto de erro abaixo, só aparece após tentativa de submit

---

## Headers

- Fundo: **branco** (nunca escuro)
- Borda inferior: 1px `--line`
- Ícones de ação: Lucide, 20px, dentro de um botão quadrado de 38–40px, raio 0, sem borda
- Botão de ação em destaque (ex: Estatísticas): fundo `--ocean-tint`, ícone `--ocean-dark`
- Demais botões de ação: fundo `--card-grey`, ícone `--ink`

---

## Placar / Scoreboard

- Card branco, raio 0, sombra `md` (única exceção de card-com-sombra em repouso — é o elemento hero da tela, tratado como um pequeno elemento flutuante sobre o fundo areia)
- Número do placar: peso 800, ver [[02-Typography]] — o único lugar do produto com esse peso
- Indicador de saque: ponto de 6–8px (mantido circular — não é uma "caixa") na cor do time sacando + nome do jogador
- Variante Super Tie-Break: fundo em gradiente Oceano→Turquesa (`linear-gradient(155deg, #0F5FA8, #00838F)`), texto branco — único lugar do produto com fundo colorido saturado no cabeçalho do placar, para marcar visualmente que é o momento decisivo da partida

---

## Menu de contexto da partida (⋮)

- Acionado por um ícone `MoreVertical` (Lucide) de 18px no canto de cada cartão de partida (Home)
- Abre um menu ancorado ao gatilho: fundo branco, raio 0, sem borda, sombra `md`
- Itens condicionais ao status da partida: **Continuar partida** (só `in_progress`) · **Ver estatísticas** (só `finished`) · **Excluir partida** (sempre, em vermelho, separado por um divisor de 1px)
- Fecha ao clicar fora, pressionar Esc, ou escolher uma opção

## Confirmação de exclusão

- Modal centrado (não uma nova tela), backdrop escurecido, lista/placar visível ao fundo
- Ícone de lixeira em tint vermelho, título "Excluir partida?", nome das duplas, descrição explicando que a ação é permanente mas desfazível logo em seguida
- Ações: `Cancelar` (secundário) · `Excluir` (perigo, vermelho sólido)

## Snackbar

- Fixo na base da tela, fundo `--ink` (grafite escuro), texto branco, raio 0, sombra `lg`
- Ícone de confirmação (check) + mensagem + ação opcional (ex: "DESFAZER", em `--coral`/Laranja Dupla B, maiúsculo) + botão de fechar
- Auto-fecha após ~6s; a ação "Desfazer" restaura o estado anterior (ex: reinsere a partida excluída) sem pedir confirmação de novo
- Componente genérico e reutilizável — não exclusivo do fluxo de exclusão

---

*Relacionado: [[00-Indice]] · [[01-Colors]] · [[04-Spacing]] · [[05-Icons]]*
