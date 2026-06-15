# User Stories — Beach Tennis Scout MVP

> **Formato de critérios de aceitação:** Dado / Quando / Então
> **🟢 Sprint 1** = incluída na proposta do Sprint 1 mínimo
> **Dependências** listadas por ID de story

---

## EP-01 — Configurar Partida

---

### EP-01-01 🟢 — Selecionar modalidade da partida

**Como** scout ou técnico,
**quero** escolher entre Simples e Duplas ao configurar a partida,
**para que** o número de botões de jogador na tela de scout seja o correto para a modalidade.

**Critérios de aceitação:**

- **Dado** que estou na tela "Nova Partida",
  **quando** seleciono "Simples",
  **então** apenas o campo Jogador A1 e Jogador B1 são exibidos (sem A2/B2).

- **Dado** que estou na tela "Nova Partida",
  **quando** seleciono "Duplas",
  **então** os campos Jogador A1, A2, B1 e B2 são todos exibidos.

- **Dado** que mudei de "Duplas" para "Simples",
  **quando** olho para os campos de jogador,
  **então** os campos A2 e B2 desaparecem com transição suave e não são enviados ao criar a partida.

- **Dado** que a modalidade padrão ao abrir a tela é "Duplas",
  **quando** o usuário não toca no seletor,
  **então** a partida é criada como Duplas.

---

### EP-01-02 🟢 — Informar nomes dos jogadores

**Como** scout,
**quero** digitar os nomes dos jogadores com autocomplete do histórico,
**para que** o preenchimento seja rápido e eu não cometa erros de digitação em nomes recorrentes.

**Critérios de aceitação:**

- **Dado** que digito pelo menos 1 caractere no campo de jogador,
  **quando** há nomes correspondentes no histórico local (IndexedDB),
  **então** uma lista de sugestões aparece abaixo do campo.

- **Dado** que toco em uma sugestão,
  **quando** o campo é preenchido,
  **então** o teclado é dispensado e o foco vai para o próximo campo.

- **Dado** que tento iniciar a partida sem preencher um campo obrigatório (A1, B1 em simples; A1, A2, B1, B2 em duplas),
  **quando** toco em "Iniciar Partida",
  **então** o campo vazio recebe borda vermelha e mensagem de erro abaixo.

- **Dado** que concluo a partida com sucesso,
  **quando** a partida é criada,
  **então** os nomes informados são salvos no histórico local de jogadores (sem duplicatas).

---

### EP-01-03 🟢 — Selecionar formato da partida

**Como** organizador de torneio ou técnico,
**quero** escolher o formato da partida (Melhor de 3 Sets, Pro Set ou Melhor de 5 Sets),
**para que** o ScoringEngine aplique as regras corretas.

**Critérios de aceitação:**

- **Dado** que estou na tela "Nova Partida",
  **quando** vejo o seletor de formato,
  **então** as 3 opções são exibidas com descrição resumida das regras de cada uma.

- **Dado** que não toco no seletor de formato,
  **quando** inicio a partida,
  **então** "Melhor de 3 Sets" é usado como padrão.

- **Dado** que seleciono "Pro Set",
  **quando** a partida é criada,
  **então** o MatchFormat registra `setsToWin: 1`, `gamesPerSet: 16`, `tiebreakAt: 15`, `lastSetIsSuperTiebreak: false`.

---

### EP-01-04 🟢 — Definir quem saca primeiro

**Como** scout,
**quero** registrar qual time abre o saque,
**para que** o indicador de saque e as estatísticas de saque sejam precisos desde o início.

**Critérios de aceitação:**

- **Dado** que estou na tela "Nova Partida",
  **quando** vejo o seletor de saque,
  **então** "Dupla A" e "Dupla B" (ou "Jogador A" / "Jogador B" em simples) são os 2 toggles disponíveis.

- **Dado** que não toco no seletor de saque,
  **quando** inicio a partida,
  **então** "Dupla A" saca primeiro por padrão.

- **Dado** que inicio a partida,
  **quando** a tela de scout abre,
  **então** o indicador de saque no header mostra o time/jogador correto.

---

### EP-01-05 — Adicionar dados de contexto (opcional)

**Como** técnico ou organizador,
**quero** registrar torneio, local e categoria da partida,
**para que** o resumo pós-jogo e o histórico tenham contexto além do placar.

**Critérios de aceitação:**

- **Dado** que estou na tela "Nova Partida",
  **quando** toco em "Dados do Contexto",
  **então** o accordeon expande mostrando os campos: Torneio, Local, Categoria, Observações.

- **Dado** que deixo todos os campos de contexto vazios,
  **quando** inicio a partida,
  **então** a partida é criada normalmente sem esses dados (são todos opcionais).

- **Dado** que preencho o torneio como "Circuito Paulista 2026",
  **quando** a partida termina e vejo o resumo,
  **então** "Circuito Paulista 2026" aparece no cabeçalho do resumo.

---

## EP-02 — Registrar Pontos (Scout)

---

### EP-02-01 🟢 — Selecionar o jogador (Passo 1)

**Como** scout,
**quero** tocar no botão do jogador que fez a última ação,
**para que** o sistema saiba a quem atribuir o ponto ou erro.

**Critérios de aceitação:**

- **Dado** que a partida é Duplas e estou no Passo 1,
  **quando** vejo a grade de jogadores,
  **então** 4 botões são exibidos: A1 e A2 em azul (#1565C0), B1 e B2 em vermelho (#C62828), cada um com 64px de altura.

- **Dado** que a partida é Simples e estou no Passo 1,
  **quando** vejo a grade de jogadores,
  **então** 2 botões são exibidos empilhados verticalmente, com 96px de altura cada, largura total.

- **Dado** que toco em um botão de jogador,
  **quando** o toque é registrado,
  **então** em menos de 100ms: o botão selecionado ganha borda branca de 2px, os demais ficam com 50% de opacidade, e o Passo 2 (grade de ações) fica ativo.

- **Dado** que toco em um jogador e ainda não selecionei a ação,
  **quando** toco em um jogador diferente,
  **então** a seleção muda para o novo jogador sem registrar nenhum ponto.

---

### EP-02-02 🟢 — Selecionar o tipo de ação (Passo 2) e salvar o ponto

**Como** scout,
**quero** tocar no tipo de ação após selecionar o jogador,
**para que** o ponto seja salvo automaticamente sem nenhum toque adicional de confirmação.

**Critérios de aceitação:**

- **Dado** que selecionei um jogador no Passo 1,
  **quando** vejo o Passo 2,
  **então** 14 botões de ação estão disponíveis, organizados em 7 linhas × 2 colunas: Winners (verde #2E7D32), Erros (laranja #E65100), Ace (roxo #6A1B9A), Drop (teal #00838F), Forçou (âmbar #F57F17).

- **Dado** que o Passo 1 não foi concluído (nenhum jogador selecionado),
  **quando** toco em qualquer botão de ação,
  **então** nada acontece (botões de ação ficam com 30% de opacidade e não respondem).

- **Dado** que selecionei jogador e toco em um tipo de ação,
  **quando** o segundo toque é registrado,
  **então** em menos de 100ms o PointEvent é criado e salvo no IndexedDB, o placar no header é atualizado, e a tela retorna ao Passo 1 com todos os botões de jogador restaurados ao estado inicial.

- **Dado** que um ponto foi salvo,
  **quando** se passam 600ms,
  **então** a tela aceita um novo Passo 1 (cooldown de proteção contra duplo toque).

- **Dado** que o dispositivo suporta vibração,
  **quando** um ponto é salvo,
  **então** `navigator.vibrate(50)` é chamado como feedback háptico.

---

### EP-02-03 🟢 — Visualizar placar no header da tela de scout

**Como** scout,
**quero** ver o set, o game e o placar de pontos em tempo real no topo da tela,
**para que** eu confirme que o ponto foi registrado corretamente sem precisar sair da tela.

**Critérios de aceitação:**

- **Dado** que estou na tela de scout,
  **quando** o header é exibido,
  **então** vejo: número do set atual, número do game atual, placar em formato `40 : 30` (ou `Vant.` / `Deuce`), indicador de saque com o nome do time/jogador sacante.

- **Dado** que um ponto é registrado e o game avança (ex: de 40:30 para 0:0 no próximo game),
  **quando** o header é atualizado,
  **então** o placar e o número do game são atualizados em menos de 100ms sem recarregar a tela.

- **Dado** que o placar está em Deuce (3:3 em pontos internos),
  **quando** o header é exibido,
  **então** o texto mostra "Deuce" em vez de "40:40".

- **Dado** que o placar está em Vantagem (4:3 ou 3:4),
  **quando** o header é exibido,
  **então** o texto mostra "Vant. A" ou "Vant. B" conforme o lado.

---

### EP-02-04 — Atalhos de teclado na tela de scout

**Como** técnico usando tablet ou desktop com teclado,
**quero** registrar pontos usando teclas do teclado,
**para que** o registro seja ainda mais rápido sem tirar as mãos do teclado.

**Critérios de aceitação:**

- **Dado** que estou no Passo 1 em Duplas,
  **quando** pressiono `1`, `2`, `3` ou `4`,
  **então** o jogador A1, A2, B1 ou B2 é selecionado respectivamente.

- **Dado** que estou no Passo 1 em Simples,
  **quando** pressiono `1` ou `2`,
  **então** o Jogador A ou B é selecionado.

- **Dado** que estou no Passo 2 (jogador selecionado),
  **quando** pressiono a tecla correspondente ao tipo de ação (ex: `Q` = Winner Dir, `W` = Winner Esq),
  **então** o ponto é registrado como se eu tivesse tocado no botão.

- **Dado** que pressiono `Ctrl+Z` em qualquer momento na tela de scout,
  **quando** há pelo menos 1 PointEvent registrado,
  **então** o modal de undo é aberto.

- **Dado** que pressiono `Esc` enquanto estou no Passo 2 (jogador já selecionado),
  **quando** a tecla é pressionada,
  **então** o Passo 2 é cancelado e a tela retorna ao Passo 1 sem salvar ponto.

---

## EP-03 — Motor de Placar (ScoringEngine)

---

### EP-03-01 🟢 — Progressão de pontos no game (0/15/30/40/Deuce/Vantagem)

**Como** sistema,
**quero** que cada PointEvent incremente corretamente a pontuação do game,
**para que** o placar reflita as regras reais do beach tennis.

**Critérios de aceitação:**

- **Dado** que o game está em 30:30 e o lado A marca um ponto,
  **quando** o PointEvent é processado,
  **então** o placar vai para 40:30.

- **Dado** que o game está em 40:40 (Deuce) e o lado A marca um ponto,
  **quando** o PointEvent é processado,
  **então** o placar vai para Vantagem A (internamente: 4:3).

- **Dado** que o placar está em Vantagem A e o lado B marca um ponto,
  **quando** o PointEvent é processado,
  **então** o placar volta para Deuce (internamente: 3:3).

- **Dado** que o placar está em Vantagem A e o lado A marca um ponto,
  **quando** o PointEvent é processado,
  **então** o game é vencido pelo lado A (internamente: 4:3, diferença ≥ 2 com ambos ≥ 4).

- **Dado** que qualquer game começa,
  **quando** o primeiro ponto é registrado,
  **então** o placar vai de 0:0 para 15:0 (ou 0:15).

---

### EP-03-02 🟢 — Progressão de games e vitória do set

**Como** sistema,
**quero** que o engine detecte a vitória de um set e abra o próximo automaticamente,
**para que** o scout não precise fazer nenhuma ação manual para continuar o registro.

**Critérios de aceitação:**

- **Dado** que o placar de games está em 5:4 e o lado A vence um game,
  **quando** o engine processa,
  **então** o set vai para 6:4 e é vencido pelo lado A (6 games, diferença ≥ 2).

- **Dado** que o placar de games está em 5:5 e o lado A vence um game,
  **quando** o engine processa,
  **então** o set vai para 6:5, sem vencedor ainda (A ainda não tem diferença de 2).

- **Dado** que o placar de games está em 6:5 e o lado B vence um game,
  **quando** o engine processa,
  **então** o placar vai para 6:6 e o engine abre um game de tie-break.

- **Dado** que o placar de games vai a 6:6 em qualquer set não-decisivo,
  **quando** o engine processa o game que empatou,
  **então** a transição `tiebreak_started` é emitida e um game de tie-break é criado.

---

### EP-03-03 🟢 — Tie-Break (7 pontos, win by 2)

**Como** sistema,
**quero** que o engine conduza o tie-break com as regras corretas de pontuação numérica e alternância de saque,
**para que** o placar seja fiel ao regulamento.

**Critérios de aceitação:**

- **Dado** que o tie-break começa,
  **quando** o header é exibido,
  **então** a pontuação é numérica (0:0, 1:0, 2:0...) e não usa 15/30/40.

- **Dado** que o tie-break está em 6:6,
  **quando** o lado A marca um ponto,
  **então** o placar vai para 7:6 mas o tie-break **não** termina (diferença ainda é 1).

- **Dado** que o tie-break está em 7:6,
  **quando** o lado A marca um ponto,
  **então** o tie-break termina com vitória do lado A (8:6, diferença = 2, A ≥ 7).

- **Dado** que o tie-break começa,
  **quando** o saque é verificado,
  **então** o time que não sacou o último game regular começa sacando; após o 1º ponto o saque troca; depois alterna a cada 2 pontos.

- **Dado** que o tie-break termina,
  **quando** o set é encerrado,
  **então** o placar do set é exibido como `7-6` e o placar exato do tie-break (ex: `8-6`) é salvo em `tiebreakScoreA/B`.

---

### EP-03-04 🟢 — Super Tie-Break como set decisivo (10 pontos, win by 2)

**Como** sistema,
**quero** que o set decisivo seja disputado como super tie-break,
**para que** a regra do beach tennis seja respeitada no formato Melhor de 3 e Melhor de 5.

**Critérios de aceitação:**

- **Dado** que o formato é "Melhor de 3 Sets" e cada time venceu 1 set,
  **quando** o Set 3 é criado,
  **então** o engine cria um Set com `type: super_tiebreak` sem nenhum Game filho.

- **Dado** que o super tie-break está em andamento,
  **quando** o lado A pontua,
  **então** o placar de pontos é incrementado diretamente no Set (não num Game).

- **Dado** que o super tie-break está em 10:9,
  **quando** o lado A marca um ponto,
  **então** o super tie-break **não** termina (10:9, diferença = 1).

- **Dado** que o super tie-break está em 10:9,
  **quando** o lado B marca um ponto,
  **então** o placar vai para 10:10 (Deuce do super tie-break) e o jogo continua.

- **Dado** que o super tie-break está em 11:10,
  **quando** o lado A marca um ponto,
  **então** o super tie-break termina com vitória do lado A (12:10, diferença ≥ 2, A ≥ 10).

- **Dado** que o super tie-break termina,
  **quando** a partida é encerrada,
  **então** a transição `match_won` é emitida com o vencedor correto.

---

### EP-03-05 🟢 — Rotação de saque entre games

**Como** sistema,
**quero** que o saque alterne automaticamente após cada game,
**para que** o indicador de saque no header seja sempre correto sem intervenção manual.

**Critérios de aceitação:**

- **Dado** que o lado A está sacando no game atual,
  **quando** o game termina (qualquer vencedor),
  **então** o lado B passa a ser o time sacante no próximo game.

- **Dado** que um novo set começa,
  **quando** o engine cria o primeiro game do novo set,
  **então** o time sacante é o que **não** sacou o último game do set anterior.

- **Dado** que a partida é em Duplas e o lado A tem A1 e A2,
  **quando** o saque passa para o lado A no segundo game em que A saca,
  **então** o jogador sacante alterna (de A1 para A2 ou vice-versa, seguindo a rotação do set).

---

## EP-04 — Desfazer Ponto (Undo)

---

### EP-04-01 🟢 — Desfazer o último ponto registrado

**Como** scout,
**quero** poder desfazer o último ponto registrado,
**para que** eu corrija erros de registro sem comprometer os dados da partida.

**Critérios de aceitação:**

- **Dado** que pelo menos 1 ponto foi registrado,
  **quando** toco no botão `[↩]` na tela de scout,
  **então** um modal aparece mostrando: nome do jogador, tipo de ação e o placar antes/depois (ex: "Ana — Winner Dir · 40:30 → 30:30").

- **Dado** que o modal de undo está aberto e toco em "Desfazer",
  **quando** a operação é executada,
  **então** o último PointEvent é removido, o estado da partida é restaurado ao `scoreSnapshotBefore` desse evento, e o placar no header é atualizado imediatamente.

- **Dado** que o modal de undo está aberto e toco em "Cancelar",
  **quando** a ação é cancelada,
  **então** o modal fecha sem nenhuma alteração.

- **Dado** que não há nenhum ponto registrado,
  **quando** toco no botão `[↩]`,
  **então** o botão está desabilitado (opacidade reduzida, sem ação ao tocar).

- **Dado** que o undo desfaz um ponto que encerrou um game ou set,
  **quando** o undo é executado,
  **então** o game/set é reaberto e o placar volta ao estado exato anterior ao fechamento.

- **Dado** que aplico undo consecutivamente várias vezes,
  **quando** cada undo é executado,
  **então** cada operação desfaz apenas o último evento restante, sem limite de quantidade.

---

### EP-04-02 — Sem publicidade no modal de undo

**Como** scout,
**quero** que o modal de confirmação de undo não tenha anúncios,
**para que** a correção de erros seja rápida e sem distração.

**Critérios de aceitação:**

- **Dado** que o modal de undo está aberto,
  **quando** inspeciono o conteúdo,
  **então** não há nenhum banner, espaço publicitário ou elemento externo carregado.

---

## EP-05 — Estatísticas em Tempo Real

---

### EP-05-01 — Acessar estatísticas durante a partida

**Como** técnico,
**quero** acessar as estatísticas da partida em andamento via menu,
**para que** eu tome decisões táticas baseadas em dados durante o jogo.

**Critérios de aceitação:**

- **Dado** que estou na tela de scout,
  **quando** toco no menu `[⋮]` e seleciono "Estatísticas",
  **então** a tela de estatísticas abre mostrando os dados acumulados até o momento.

- **Dado** que estou na tela de estatísticas durante partida ativa,
  **quando** olho para a tela,
  **então** o botão "Voltar ao Scout" está sempre visível e é o CTA principal.

- **Dado** que estou na tela de estatísticas,
  **quando** toco em "Voltar ao Scout",
  **então** retorno à tela de scout no mesmo estado em que deixei.

---

### EP-05-02 — Visualizar totais e breakdown de winners e erros

**Como** técnico ou jogador,
**quero** ver o total de winners, erros e pontos por time/jogador com breakdown por subtipo,
**para que** eu entenda onde os pontos estão sendo ganhos e perdidos.

**Critérios de aceitação:**

- **Dado** que a tela de estatísticas está aberta,
  **quando** vejo a seção "Winners",
  **então** há uma tabela comparativa A vs B com uma linha para cada subtipo (Winner Dir, Esq, Par, Cruz, Lob, Smash, Drop, Ace) e uma linha de Total.

- **Dado** que a tela de estatísticas está aberta,
  **quando** vejo a seção "Erros Não-Forçados",
  **então** há uma tabela A vs B com linhas para: Erro Dir, Erro Esq, Erro Lob, Erro Smash, Erro Saque, Dupla Falta e Total.

- **Dado** que registro um winner de direita pela Ana,
  **quando** abro as estatísticas,
  **então** o contador de "Winner Dir" da coluna A incrementou em 1.

- **Dado** que a partida é Simples,
  **quando** vejo os headers das colunas,
  **então** as colunas usam o nome do jogador ("ANA" / "CARLOS") e não "DUPLA A" / "DUPLA B".

---

### EP-05-03 — Visualizar estatísticas de saque

**Como** técnico,
**quero** ver o aproveitamento de saque de cada time,
**para que** eu avalie a efetividade do saque e tome decisões sobre o segundo saque.

**Critérios de aceitação:**

- **Dado** que pelo menos 1 ponto de saque foi registrado,
  **quando** vejo a seção "Saque",
  **então** há uma tabela com: % 1º Saque (aces + bolas em jogo / total de 1ºs saques), % 2º Saque, Aces, Duplas Faltas — para cada lado.

- **Dado** que registro um Ace,
  **quando** abro as estatísticas de saque,
  **então** o contador de Aces do sacante incrementa e o % de 1º Saque é atualizado.

---

### EP-05-04 — Filtrar estatísticas por set

**Como** técnico,
**quero** ver as estatísticas de um set específico além do total da partida,
**para que** eu identifique quedas de performance em sets individuais.

**Critérios de aceitação:**

- **Dado** que a partida tem mais de 1 set jogado,
  **quando** vejo a tela de estatísticas,
  **então** as abas "Partida", "Set 1", "Set 2" (e seguintes, se houver) estão visíveis.

- **Dado** que toco na aba "Set 1",
  **quando** as tabelas são atualizadas,
  **então** apenas os PointEvents do Set 1 são contabilizados, sem alterar a URL.

- **Dado** que toco em "Partida",
  **quando** as tabelas são atualizadas,
  **então** todos os PointEvents são contabilizados novamente.

---

## EP-06 — Resumo Pós-Jogo

---

### EP-06-01 — Exibir resultado final com vencedor em destaque

**Como** jogador ou técnico,
**quero** ver quem venceu e o placar completo assim que a partida termina,
**para que** o resultado seja claro e imediato.

**Critérios de aceitação:**

- **Dado** que o último ponto da partida é registrado e a transição `match_won` é emitida,
  **quando** o estado é atualizado,
  **então** a tela de scout exibe um overlay ou transição para o Resumo.

- **Dado** que estou na tela de Resumo,
  **quando** vejo o topo da tela,
  **então** há um card com fundo verde (#1B5E20) mostrando o nome do vencedor e o placar final dos sets.

- **Dado** que um set teve tie-break,
  **quando** o placar de sets é exibido,
  **então** o set aparece como `7-6(4)` onde `4` é o número de pontos que o perdedor fez no tie-break.

- **Dado** que a partida é Simples,
  **quando** o card de vencedor é exibido,
  **então** o texto usa singular: "ANA venceu" e o verbo "venceu" (não "venceram").

- **Dado** que a partida é Duplas,
  **quando** o card de vencedor é exibido,
  **então** o texto usa plural: "ANA / BIA venceram".

---

### EP-06-02 — Compartilhar resultado

**Como** jogador,
**quero** compartilhar o resultado da partida,
**para que** eu envie o placar e as estatísticas para grupos de WhatsApp ou redes sociais.

**Critérios de aceitação:**

- **Dado** que estou na tela de Resumo,
  **quando** toco em "Compartilhar",
  **então** o `navigator.share()` é chamado com um texto pré-formatado contendo: nomes dos times, placar set a set, totais de winners e erros de cada lado.

- **Dado** que o dispositivo não suporta `navigator.share()` (ex: desktop sem suporte),
  **quando** toco em "Compartilhar",
  **então** o texto é copiado para o clipboard e uma notificação toast confirma: "Resultado copiado!".

---

## EP-07 — Persistência Offline

---

### EP-07-01 🟢 — Autosave após cada ponto

**Como** scout,
**quero** que cada ponto seja salvo automaticamente ao ser registrado,
**para que** nenhum dado seja perdido se o app for fechado ou o browser atualizado.

**Critérios de aceitação:**

- **Dado** que registro um ponto na tela de scout,
  **quando** o PointEvent é criado,
  **então** em menos de 200ms o estado completo da partida (MatchState + PointEvent) é persistido no IndexedDB.

- **Dado** que fecho e reabro o browser após registrar 5 pontos,
  **quando** o app carrega,
  **então** a partida em andamento é detectada com todos os 5 pontos preservados.

- **Dado** que o dispositivo está sem conexão à internet,
  **quando** registro pontos,
  **então** o app funciona normalmente sem nenhuma mensagem de erro relacionada à conexão.

---

### EP-07-02 🟢 — App funcional 100% offline

**Como** scout em quadra com sinal ruim,
**quero** que o app funcione sem internet,
**para que** problemas de rede não interrompam o registro durante a partida.

**Critérios de aceitação:**

- **Dado** que o app foi carregado uma vez com internet,
  **quando** o dispositivo fica offline,
  **então** todas as funcionalidades do MVP (configurar partida, registrar pontos, ver stats, undo) continuam funcionando.

- **Dado** que o app está offline,
  **quando** abro o Home,
  **então** um badge sutil "Offline" aparece no header sem bloquear nenhuma funcionalidade.

---

## EP-08 — Recuperação de Partida em Andamento

---

### EP-08-01 🟢 — Detectar partida em andamento ao abrir o app

**Como** scout,
**quero** ser avisado se existe uma partida em andamento ao abrir o app,
**para que** eu retome o registro sem perder os pontos já registrados.

**Critérios de aceitação:**

- **Dado** que existe uma partida com `status: in_progress` no IndexedDB,
  **quando** o Home é carregado,
  **então** um card de destaque amarelo (#F57F17) aparece no topo com: nomes dos times, set e game atual, placar, e os botões "Continuar Partida" e "Descartar".

- **Dado** que toco em "Continuar Partida",
  **quando** a navegação ocorre,
  **então** vou direto para `/match/[id]/scout` com o estado restaurado do IndexedDB, no exato ponto onde parei.

- **Dado** que toco em "Descartar",
  **quando** um modal de confirmação aparece e confirmo,
  **então** a partida é marcada como descartada, o card desaparece e o Home fica limpo.

- **Dado** que não existe nenhuma partida em andamento,
  **quando** o Home é carregado,
  **então** o card de recuperação não aparece.

---

## EP-09 — Histórico de Partidas

---

### EP-09-01 — Listar últimas partidas no Home

**Como** usuário recorrente,
**quero** ver as últimas partidas registradas na tela inicial,
**para que** eu acesse rapidamente os resultados recentes.

**Critérios de aceitação:**

- **Dado** que existem partidas encerradas no histórico,
  **quando** o Home é carregado,
  **então** as 3 mais recentes aparecem como cards com: nomes dos times, placar final (set a set) e data.

- **Dado** que existem mais de 3 partidas encerradas,
  **quando** o Home é carregado,
  **então** o link "Ver Todas →" está visível após os 3 cards.

- **Dado** que não existem partidas encerradas (primeiro uso),
  **quando** o Home é carregado,
  **então** a seção mostra: "Nenhuma partida registrada ainda. Comece agora!".

- **Dado** que toco em um card de partida encerrada,
  **quando** a navegação ocorre,
  **então** vou para a tela de Resumo Pós-Jogo dessa partida.

---

### EP-09-02 — Listar todas as partidas

**Como** usuário,
**quero** acessar o histórico completo de partidas,
**para que** eu consulte resultados além das 3 mais recentes exibidas no Home.

**Critérios de aceitação:**

- **Dado** que toco em "Ver Todas" no Home,
  **quando** a tela de histórico abre,
  **então** todas as partidas encerradas são listadas em ordem cronológica reversa com placar e data.

- **Dado** que a lista de histórico tem scroll,
  **quando** rolo para baixo,
  **então** AD-04 (banner publicitário) aparece no rodapé da tela (não no meio da lista).

---

## EP-10 — Publicidade

---

### EP-10-01 — Banner AD-01 no Home

**Como** produto,
**quero** exibir um banner no rodapé do Home,
**para que** o app gere receita desde o primeiro uso.

**Critérios de aceitação:**

- **Dado** que o Home é carregado,
  **quando** o SDK de anúncios retorna um banner,
  **então** AD-01 aparece fixo no rodapé (abaixo do safe area do iOS).

- **Dado** que o banner está no rodapé,
  **quando** vejo a lista de partidas recentes,
  **então** o conteúdo da lista tem padding-bottom suficiente para não ficar oculto atrás do banner.

- **Dado** que o SDK de anúncios demora ou falha,
  **quando** o Home carrega,
  **então** o espaço do banner permanece em branco (sem quebrar o layout) e o app funciona normalmente.

---

### EP-10-02 — Banner AD-02 na tela de intervalo de set

**Como** produto,
**quero** exibir um anúncio entre sets,
**para que** o momento de pausa natural entre sets seja aproveitado para receita sem impactar o registro.

**Critérios de aceitação:**

- **Dado** que um set é encerrado e ainda há sets a disputar,
  **quando** a transição `set_won` é emitida,
  **então** uma tela intermediária aparece com: placar do set encerrado, placar da partida em sets, e o banner AD-02 (300×250).

- **Dado** que a tela de intervalo está visível,
  **quando** toco em "Continuar" (ou aguardo 5 segundos),
  **então** a tela de scout é reaberta para o novo set.

- **Dado** que a partida termina (não apenas um set),
  **quando** a transição `match_won` é emitida,
  **então** a tela de intervalo com AD-02 **não** aparece — o app vai direto para o Resumo.

---

*Relacionado: [[01-Epics]] · [[03-Sprint-1]] · [[10-Wireframe/03-Scout]] · [[08-Dominio/09-ScoringEngine]]*
