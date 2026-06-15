# Épicos — Beach Tennis Scout MVP

> Os épicos representam as grandes capacidades do produto. Cada épico é independente o suficiente para ter valor por si só, mas todos são necessários para um MVP completo.

---

## EP-01 — Configurar Partida

**Objetivo:** Permitir que o usuário defina os parâmetros de uma partida antes de iniciá-la — modalidade, nomes dos jogadores, formato e quem saca primeiro.

**Valor:** Sem configuração, não existe contexto para o registro de pontos. Este é o portão de entrada obrigatório para tudo que o app faz.

**Escopo:**
- Seleção de modalidade: Simples (1 jogador/lado) ou Duplas (2 jogadores/lado)
- Entrada de nomes dos jogadores com autocomplete do histórico local
- Seleção do formato da partida (Melhor de 3 Sets, Pro Set, Melhor de 5 Sets)
- Seleção de quem saca primeiro
- Dados opcionais de contexto (torneio, local, categoria, observações)

**Fora do escopo (V2+):**
- Perfis persistentes de jogadores com histórico linkado
- Foto de perfil, número de classificação, clube

---

## EP-02 — Registrar Pontos (Scout)

**Objetivo:** Permitir o registro de cada ponto com exatamente 2 toques: (1) selecionar o jogador que fez a ação; (2) selecionar o tipo de ação.

**Valor:** Esta é a razão de existir do produto. Um scout que precisa de mais de 3 segundos por ponto abandona a ferramenta. A experiência de 2 toques é o diferencial central.

**Escopo:**
- Passo 1: grade de botões com jogadores (2 em simples, 4 em duplas)
- Passo 2: grade de 14 tipos de ação (8 winners, 5 erros, 1 forçou erro)
- Auto-save após o segundo toque
- Feedback visual e háptico imediatos (< 100ms)
- Cooldown de 600ms para prevenir registro duplo acidental
- Indicador de saque atual no header
- Header com placar em tempo real

**Fora do escopo:**
- Edição de ponto já salvo (coberto pelo EP-04 — Undo)
- Registro de estatísticas manuais
- Qualquer publicidade nesta tela

---

## EP-03 — Motor de Placar (ScoringEngine)

**Objetivo:** Implementar o cérebro do domínio: a função pura que converte um PointEvent no novo estado da partida, tratando todas as regras do beach tennis.

**Valor:** Sem o engine correto, o placar fica errado. Placar errado invalida as estatísticas e destrói a confiança no produto. Este épico é a fundação técnica de tudo.

**Escopo:**
- Progressão de pontos dentro do game (0/15/30/40/Deuce/Vantagem)
- Detecção de game vencido com deuce
- Progressão de games dentro do set
- Detecção de set vencido (win by 2, até 6 games)
- Tie-break a 6×6 (7 pontos, win by 2)
- Super tie-break como set decisivo (10 pontos, win by 2)
- Progressão de sets até o fim da partida
- Rotação de saque (por game, a cada 2 pontos no tie-break)
- Suporte aos 3 formatos: Melhor de 3, Pro Set, Melhor de 5
- Undo: restaurar estado via scoreSnapshotBefore

**Fora do escopo:**
- Regras customizadas além dos 3 formatos suportados

---

## EP-04 — Desfazer Ponto (Undo)

**Objetivo:** Permitir desfazer o último ponto registrado, sem limite de quantidade, restaurando o estado exato anterior.

**Valor:** Erros de registro acontecem em campo — ponto registrado no jogador errado, tipo errado. Sem undo, o scout precisa anotar mentalmente a correção ou conviver com dados incorretos. O undo sem limite é a garantia de confiabilidade dos dados.

**Escopo:**
- Botão de undo acessível na tela de scout (sempre visível)
- Modal de confirmação mostrando o ponto que será desfeito: "Jogador — Ação (placar antes → depois)"
- Restauração do estado via scoreSnapshotBefore (O(1))
- Undo encadeia: pode desfazer vários pontos consecutivos
- Undo desfaz transições: game reaberto, set reaberto, partida reaberta se necessário
- Sem publicidade no modal de undo

**Fora do escopo:**
- Redo (refazer ponto desfeito) — não planejado para MVP
- Edição de um ponto específico no meio da sequência (apenas undo do último)

---

## EP-05 — Estatísticas em Tempo Real

**Objetivo:** Exibir as estatísticas acumuladas da partida (winners, erros, aproveitamento de saque) por jogador e por time, calculadas a partir dos PointEvents.

**Valor:** O técnico no banco precisa tomar decisões táticas durante a partida. Poder ver "DUPLA B cometeu 8 erros não-forçados no set 2" em 2 toques é o que diferencia o produto de uma planilha.

**Escopo:**
- Tela de estatísticas acessível via menu durante partida
- Recálculo automático após cada PointEvent
- Totalizadores: pontos ganhos, winners, erros não-forçados, forçou erro
- Breakdown por subtipo (winner direita, esquerda, etc.)
- Estatísticas de saque: % 1º saque, % 2º saque, aces, duplas faltas
- Comparativo A vs B em tabela
- Seletor de escopo: Partida total / por Set
- Labels adaptativos: "DUPLA A/B" em duplas, nome do jogador em simples
- Botão "Voltar ao Scout" sempre visível durante partida ativa
- Sem publicidade durante partida ativa

**Fora do escopo:**
- Gráficos e visualizações (V2)
- Comparação entre partidas diferentes (V2)
- Exportação (V2)

---

## EP-06 — Resumo Pós-Jogo

**Objetivo:** Exibir o resultado final da partida com vencedor em destaque, placar completo por set e estatísticas completas. Primeira exposição ao banner publicitário depois que a partida termina.

**Valor:** É a tela que justifica o uso do app — o momento em que o usuário vê o valor dos dados que coletou durante a partida. Se ele sair desta tela satisfeito, ele volta na próxima.

**Escopo:**
- Card de vencedor (fundo verde) com nome e placar final
- Placar set a set com notação de tie-break: `7-6(4)`
- Estatísticas completas (idênticas à tela de Estatísticas)
- Labels corretos: singular "venceu" em simples, plural "venceram" em duplas
- AD-03 banner visível (primeiro anúncio após partida iniciada)
- Botão Compartilhar: texto pré-formatado com placar e stats via `navigator.share()`
- Botões: Nova Partida / Voltar ao Home

**Fora do escopo:**
- Exportação PDF (V2)
- Compartilhamento de imagem gerada (V2)

---

## EP-07 — Persistência Offline

**Objetivo:** Garantir que nenhum dado seja perdido por falta de conexão. Toda a operação do MVP acontece localmente no dispositivo.

**Valor:** Quadras de beach tennis frequentemente têm conexão instável. Um app que perde dados sem internet nunca será usado em torneios ou locais abertos.

**Escopo:**
- IndexedDB (Dexie.js) como armazenamento primário
- Autosave automático após cada PointEvent
- App funciona completamente sem conexão à internet
- Estado da partida sobrevive a fechamento acidental do browser/app
- Lista de nomes de jogadores usados anteriormente persistida localmente

**Fora do escopo:**
- Sincronização com servidor em nuvem (V2)
- Backup automático (V2)
- Acesso à partida em outro dispositivo (V2)

---

## EP-08 — Recuperação de Partida em Andamento

**Objetivo:** Se o usuário fechar o app por acidente durante uma partida, ao reabrir deve ser oferecida a opção de continuar de onde parou.

**Valor:** Acidentes acontecem — telefone caiu, bateria acabou, app foi fechado por engano. Perder uma partida no meio implica perder todos os dados coletados. Recuperação é proteção ao trabalho do scout.

**Escopo:**
- Ao abrir o Home, verificar se existe partida com status `in_progress`
- Se sim: exibir modal/card de destaque "Partida em andamento — Continuar?"
- "Continuar": navega direto para `/match/[id]/scout` com estado restaurado do IndexedDB
- "Descartar": confirmação secundária → apaga partida e volta ao Home limpo
- O estado restaurado é idêntico ao último autosave

**Fora do escopo:**
- Múltiplas partidas simultâneas em andamento (apenas 1 ativa por vez no MVP)

---

## EP-09 — Histórico de Partidas

**Objetivo:** Permitir que o usuário consulte partidas anteriores com placar e acesso ao resumo completo.

**Valor:** O histórico transforma o app de uma ferramenta de uso único em uma plataforma de acompanhamento. Mesmo básico, lista as últimas partidas e permite revisitar os dados.

**Escopo:**
- Home exibe as 3 últimas partidas com placar e data
- Link "Ver Todas" para lista completa
- Toque em qualquer partida encerrada abre o Resumo (tela EP-06)
- Ordenação por data, mais recente primeiro

**Fora do escopo:**
- Filtros por jogador, período ou resultado (V2)
- Busca textual (V2)
- Exclusão de partidas (V2 — risco de deleção acidental no MVP)

---

## EP-10 — Publicidade

**Objetivo:** Integrar os banners publicitários nos 4 slots aprovados, sem impactar a experiência de scout.

**Valor:** Única fonte de receita do MVP. Necessária para que o produto seja sustentável desde o lançamento.

**Escopo:**
- AD-01: Banner fixo no rodapé do Home (320×50 mobile / 728×90 desktop)
- AD-02: Banner 300×250 na tela de intervalo de set (entre sets)
- AD-03: Banner no topo do Resumo Pós-Jogo
- AD-04: Banner no rodapé da tela de Histórico
- Integração com Google AdMob (mobile) / AdSense (web)
- Nenhum anúncio na tela Scout, na configuração ou no modal de undo
- Sem anúncios com som, autoexpansão ou vídeo autoreprodutor

**Fora do escopo:**
- Publicidade segmentada por perfil de usuário (V2)
- Venda direta de espaços publicitários (V2)
- Versão sem anúncios (não existe no MVP)

---

*Relacionado: [[02-User-Stories]] · [[03-Sprint-1]] · [[08-Dominio/09-ScoringEngine]] · [[10-Wireframe/03-Scout]]*
