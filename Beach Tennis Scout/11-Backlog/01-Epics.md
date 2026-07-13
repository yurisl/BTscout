# Épicos — Beach Tennis Scout MVP

> Os épicos representam as grandes capacidades do produto. Cada épico é independente o suficiente para ter valor por si só, mas todos são necessários para um MVP completo.

---

## EP-01 — Configurar Partida

**Objetivo:** Permitir que o usuário defina os parâmetros de uma partida antes de iniciá-la — modalidade, nomes dos jogadores, formato e quem saca primeiro.

**Valor:** Sem configuração, não existe contexto para o registro de pontos. Este é o portão de entrada obrigatório para tudo que o app faz.

**Escopo:**
- Seleção de modalidade: Simples (1 jogador/lado) ou Duplas (2 jogadores/lado)
- Entrada de nomes dos jogadores com autocomplete do histórico local
- Formato da partida fixo (não configurável pelo usuário): melhor de 3 sets, sets 1 e 2 até 6 games, tie-break em 6x6, 3º set sempre em super tie-break até 10 pontos, sistema No-Ad — ver [[08-Dominio/09-ScoringEngine]]
- Seleção de quem saca primeiro
- Dados opcionais de contexto (torneio, local, categoria, observações)

**Fora do escopo (V2+):**
- Formatos alternativos (Pro Set, Melhor de 5 Sets) ou qualquer configuração de regras
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
- Progressão de pontos dentro do game (0/15/30/40)
- **Sistema No-Ad obrigatório:** em 40x40 (3x3 em pontos brutos), o próximo ponto encerra o game — **nunca há Deuce/Vantagem**. Regra fixa em `resolveGame`, não configurável
- Progressão de games dentro do set
- Detecção de set vencido (win by 2, até 6 games)
- Tie-break a 6×6 (7 pontos, win by 2)
- Super tie-break como set decisivo (10 pontos, win by 2)
- Progressão de sets até o fim da partida (melhor de 3 sets)
- Rotação de saque (por game, a cada 2 pontos no tie-break)
- Undo: restaurar estado via scoreSnapshotBefore

**Fora do escopo:**
- Qualquer regra de tênis tradicional (Advantage) — este produto é exclusivo para Beach Tennis
- Formatos alternativos (Pro Set, Melhor de 5) — não implementados; o MVP usa exclusivamente melhor de 3 com super tie-break no 3º set

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
- Botão "Estatísticas" **sempre acessível** no header da tela de Scout — não escondido em menu
- Abre um overlay (`StatsDrawer`): painel lateral em telas ≥768px, modal/bottom-sheet em <768px — nunca interrompe ou navega para fora do registro de pontos
- Fechar o painel retorna exatamente ao estado de registro em que o usuário estava (nenhuma alteração de estado da partida ao abrir/fechar)
- Recálculo automático após cada PointEvent (`calculateStats`)
- Totalizadores: pontos disputados, winners, erros não-forçados, forçou erro, percentuais
- Breakdown por subtipo (winner direita, esquerda, etc.)
- Estatísticas de saque: % 1º saque, % 2º saque, aces, duplas faltas
- Estatísticas por jogador e por dupla/time (comparativo A vs B)
- Labels adaptativos: "DUPLA A/B" em duplas, nome do jogador em simples
- Sem publicidade

**Fora do escopo:**
- Seletor de escopo por Set (Partida total / Set 1 / Set 2 / ...) — candidato a V2; MVP mostra apenas o total agregado da partida
- Gráficos e visualizações (V2)
- Comparação entre partidas diferentes (V2)
- Exportação (V2)

---

## EP-06 — Resumo Pós-Jogo

**Objetivo:** Exibir o resultado final da partida com vencedor em destaque, placar completo por set e estatísticas completas.

**Valor:** É a tela que justifica o uso do app — o momento em que o usuário vê o valor dos dados que coletou durante a partida. Se ele sair desta tela satisfeito, ele volta na próxima.

**Escopo:**
- Card de vencedor (fundo verde) com nome e placar final
- Placar set a set com notação de tie-break: `7-6(4)`
- Estatísticas completas (mesmo componente `MatchStats` reaproveitado do painel ao vivo — EP-05)
- Labels corretos: singular "venceu" em simples, plural "venceram" em duplas
- Sem publicidade
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

## EP-08 — Pausar e Continuar Partida

**Objetivo:** Permitir que o usuário pause uma partida a qualquer momento e a retome depois — seja por escolha própria (botão "Pausar"), seja por fechamento acidental do navegador.

**Valor:** Acidentes acontecem — telefone caiu, bateria acabou, o usuário precisou atender algo e fechou o app. Perder uma partida no meio implica perder todos os dados coletados. Pausar/continuar é proteção ao trabalho do scout e também um fluxo deliberado (intervalo, troca de quadra, etc.).

**Escopo:**
- Botão "Pausar" na tela de Scout: volta para a Home. Como o autosave já grava o estado a cada ponto, pausar não requer nenhuma persistência adicional
- Home: enquanto existir partida com status `in_progress`, exibir banner persistente "Existe uma partida em andamento" com botão "Continuar partida"
- Ao reabrir o navegador em uma nova sessão (fechamento acidental ou não) com uma partida `in_progress` salva: a Home pergunta uma vez "Deseja continuar a partida em andamento?" (`sessionStorage`, no máximo 1× por sessão)
- "Continuar partida" → navega direto para `/partida/[id]` com estado restaurado do `localStorage`
- "Agora não" apenas fecha o diálogo — não descarta a partida; exclusão continua sendo uma ação explícita separada, a partir do card da partida
- O estado restaurado é idêntico ao último autosave

**Fora do escopo:**
- Múltiplas partidas simultâneas em andamento tratadas de forma diferenciada (o MVP suporta várias partidas `in_progress` salvas, mas o banner/diálogo de retomada sempre aponta para a mais recente)

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

## EP-10 — Publicidade — **REMOVIDO DO MVP** (pós-primeiro-deploy)

> **Status:** Cancelado para esta versão. Após validar o primeiro deploy, a decisão de produto foi remover toda publicidade do MVP — nenhuma tela reserva espaço para banner, intersticial ou qualquer placeholder de anúncio. Ver [[09-Negócio/02-Monetizacao]].

**Objetivo original:** Integrar banners publicitários em 4 slots aprovados (Home, Intervalo entre Sets, Resumo, Histórico), sem impactar a experiência de scout.

**Por que foi removido:** nesta fase de validação, a prioridade é adoção e qualidade do registro de dados. O desenho original dos slots (`AD-01`–`AD-04`) é preservado em [[09-Negócio/02-Monetizacao]] como referência para uma eventual reintrodução em versão futura, condicionada a critérios explícitos de retenção/base de usuários — não é um trabalho pendente deste MVP.

**Fora do escopo (também depois de uma eventual reintrodução):**
- Publicidade segmentada por perfil de usuário (V2)
- Venda direta de espaços publicitários (V2)
- Qualquer anúncio na tela de Scout, no painel de Estatísticas ao vivo, na configuração de partida ou no modal de undo — permanece proibido mesmo que a publicidade volte

---

*Relacionado: [[02-User-Stories]] · [[03-Sprint-1]] · [[08-Dominio/09-ScoringEngine]] · [[10-Wireframe/03-Scout]]*
