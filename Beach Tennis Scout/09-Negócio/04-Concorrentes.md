# Concorrentes

> **Versão:** 1.0
> **Data:** 2026-06-14
> **Fase:** MVP

---

## Premissa

Existe um concorrente direto para o Beach Tennis Scout: o **BT-Tracker**, uma ferramenta web desenvolvida especificamente para beach tennis. Os demais concorrentes são produtos adjacentes — de tênis, padel e estatísticas esportivas genéricas — que jogadores e técnicos eventualmente adaptam para sua realidade com fricção.

A análise a seguir mapeia todos esses produtos, o que fazem bem e onde falham para o contexto do beach tennis.

---

## Concorrente Direto

### BT-Tracker — [bt-tracker.com](https://www.bt-tracker.com)

Ferramenta web brasileira desenvolvida especificamente para análise de partidas de beach tennis. É o único concorrente direto identificado que resolve o mesmo problema central do Beach Tennis Scout.

**O que oferece:**
- Estatísticas gerais e por atleta
- Análise de saque, devolução e primeira bola
- Estatísticas de finalização e erros não forçados
- Gráfico de dinâmica do jogo
- Mapa de calor de finalizações
- Três tipos de relatório: Ao Vivo, Padrão e Avançado
- Exportação de relatório completo em PDF
- Suporte 24 horas

**Modelo de negócio:**
- Produto pago com assinatura
- Plano mensal: R$ 35,90/mês
- Plano anual: R$ 249,90/ano (equivalente a ~R$ 20,82/mês)
- Sem plano gratuito disponível

**O que funciona bem:**
- Feito especificamente para beach tennis — modelagem correta do esporte
- Gera relatórios em PDF prontos para uso pelo técnico
- Mapa de calor é uma funcionalidade avançada relevante para análise tática
- Produto em português, focado no mercado brasileiro

**Pontos fracos identificados:**
- **Fluxo de entrada de dados pós-gravação:** a proposta de uso descrita no site é "grave sua partida → insira os dados na ferramenta" — o que sugere que o registro não é feito em tempo real durante a partida, mas sim após, a partir de um vídeo. Isso aumenta muito o atrito de uso e cria uma barreira de tempo significativa (assistir o vídeo novamente para inserir os dados).
- **Pago desde o primeiro uso:** não há plano gratuito ou trial evidente, o que limita a velocidade de adoção — especialmente entre jogadores amadores e técnicos que estão avaliando se a ferramenta vale o custo.
- **Ausência de app mobile mencionado:** a ferramenta parece ser web, sem experiência otimizada para uso durante a partida no celular.
- **Funcionamento offline:** não mencionado; o fluxo descrito pressupõe conexão com internet.
- **Interface de registro em tempo real:** não há evidência de que a ferramenta foi projetada para operar durante a partida — o fluxo descrito é pós-evento, não ao vivo.

**Relevância para o MVP:** Este é o concorrente mais importante a monitorar. Valida que há demanda pelo produto — alguém já pagou para construir e outros pagam para usar. A oportunidade está na diferença de abordagem: **registro em tempo real durante a partida vs. inserção manual pós-evento**. Se o Beach Tennis Scout conseguir oferecer o mesmo nível de análise com a experiência de uso em campo que o BT-Tracker não parece ter, o diferencial é concreto e comunicável.

---

## Aplicativos de Tênis

### Tennis Score — Game & Stats

Apps de placar de tênis são os mais próximos do que o Beach Tennis Scout faz. Eles controlam o placar set a set, game a game e ponto a ponto usando as regras do tênis tradicional.

**O que funciona para beach tennis:**
- Lógica de placar (sets, games, pontos) é conceitualmente similar
- Controle de saque e troca de lado
- Placar digital em tempo real

**O que não funciona:**
- Não modela o super tie-break como set decisivo (é um conceito de beach tennis, não de tênis)
- Não tem os tipos de ponto do beach tennis (winners por diagonal, paralelo, smash, drop shot específico da modalidade)
- A tela de registro foi projetada para quem assiste ou arbitra tênis de quadra — não para um scout de beach tennis ao sol
- Não considera duplas com rotação de saque conforme as regras específicas do beach tennis
- Relatórios são genéricos e não refletem as estatísticas que um técnico de beach tennis quer ver

**Relevância para o MVP:** Usuários que já usam app de tênis para registrar beach tennis são o segmento mais fácil de converter — já têm o hábito, já entendem o valor, e migrarão para uma ferramenta feita especificamente para o esporte deles.

---

### SwingVision

App de análise de tênis baseado em visão computacional (câmera do celular). Analisa automaticamente jogadas, velocidade de bola e posicionamento.

**O que funciona:**
- Análise automática sem precisar registrar ponto a ponto
- Dados de movimentação e velocidade

**O que não funciona:**
- Requer setup de câmera durante a partida — inviável em quadras de beach tennis sem suporte específico
- Focado em tênis, sem modelagem de beach tennis
- Plano pago com custo recorrente elevado
- Requer iOS, não disponível em Android
- Funcionalidade principal depende de conexão com internet

**Relevância para o MVP:** Produto diferente em natureza — análise por vídeo vs. registro manual. Não compete diretamente no fluxo de uso do MVP. Pode ser referência para o produto separado de IA/vídeo mencionado na visão de longo prazo.

---

## Aplicativos de Padel

### Placar Padel / Padel Manager

Apps desenvolvidos para o padel, esporte que tem algumas similaridades com o beach tennis (quadra fechada, duplas, pontuação de tênis adaptada).

**O que funciona:**
- Controle de placar para duplas
- Registro ponto a ponto em alguns casos
- Formato visual familiar para quem joga raquete esportiva

**O que não funciona:**
- Regras do padel são distintas das do beach tennis — o super tie-break do padel tem regras diferentes; a rotação de saque é diferente; os tipos de ponto não se traduzem
- Nenhum modelo de winner ou erro do padel mapeia diretamente para o beach tennis
- Interface projetada para padel, com terminologia e layout que não fazem sentido para o scout de beach tennis

**Relevância para o MVP:** Baixa concorrência direta. Usuários de padel e beach tennis são comunidades com overlap mas identidades distintas. Um técnico de beach tennis não vai usar um app de padel por muito tempo.

---

## Ferramentas de Estatísticas Esportivas Genéricas

### Planilhas (Excel / Google Sheets)

A solução mais comum que técnicos avançados usam hoje. Uma planilha personalizada onde inserem dados de cada ponto após a partida (ou tentam inserir durante).

**O que funciona:**
- Totalmente customizável
- Técnico pode modelar exatamente o que quer ver
- Zero custo

**O que não funciona:**
- Não funciona durante a partida — inserir dados em planilha enquanto assiste beach tennis é praticamente impossível
- Não gera placar automático
- Depende de memória (o técnico anota no papel durante e passa para a planilha depois — a maioria desiste no segundo set)
- Sem app mobile funcional offline
- Cada técnico tem uma planilha diferente, sem padronização
- Não escala para histórico e comparação entre partidas de forma prática

**Relevância para o MVP:** Os técnicos que usam planilha são o público mais sofisticado e com maior disposição a pagar (quando houver) — eles já entendem o valor dos dados. São os primeiros a adotar o Beach Tennis Scout quando a ferramenta chegar neles.

---

### DataVolley / VolleyStation

Softwares profissionais de scout usados em vôlei e vôlei de praia. Permitem análise tática aprofundada, registro de múltiplas variáveis por jogada, geração de relatórios complexos.

**O que funciona:**
- Análise muito detalhada
- Usados por federações e equipes de alto rendimento
- Relatórios profissionais

**O que não funciona:**
- Curva de aprendizado alta — requer treinamento específico para operar
- Custo de licença elevado
- Modelado para vôlei, não para beach tennis
- Não existe versão mobile prática para uso em campo
- Completamente fora do alcance de um técnico de academia ou de um jogador amador

**Relevância para o MVP:** Nenhuma. Esses produtos atendem um mercado diferente (alto rendimento, federações) e não competem com o Beach Tennis Scout na faixa de preço e complexidade que o MVP atende.

---

### Notion / Obsidian (uso manual por técnicos)

Alguns técnicos mais organizados criam templates em ferramentas de notas para registrar observações de partidas. Funciona para anotações qualitativas mas não para registro estruturado ponto a ponto.

**Relevância para o MVP:** Nenhuma concorrência direta. São ferramentas de produtividade, não de scout esportivo.

---

## Comparação com o Beach Tennis Scout

| Critério | BT-Tracker | Apps de Tênis | Apps de Padel | Planilhas | Beach Tennis Scout |
|---|---|---|---|---|---|
| Modelagem de beach tennis | Nativa | Parcial | Não | Manual | Nativa |
| Super tie-break correto | Sim | Não | Não | Manual | Sim |
| Tipos de ponto do BT | Sim | Não | Não | Manual | Sim |
| Registro durante a partida | Não (pós-evento) | Sim | Sim | Não | Sim |
| Toques por ponto | N/A (pós-evento) | 3–5 | 3–5 | N/A | 2 |
| Funciona offline | Não | Parcial | Parcial | Sim | Sim |
| Gratuito | Não (R$ 35,90/mês) | Parcial | Parcial | Sim | Sim |
| Estatísticas automáticas | Sim | Parcial | Parcial | Manual | Sim |
| Mapa de calor | Sim | Não | Não | Não | V2+ |
| Relatório PDF | Sim | Parcial | Não | Manual | V2 |
| App mobile | Não mencionado | Sim | Sim | Não | PWA / nativo V3 |
| Histórico de partidas | Sim | Sim | Sim | Sim | V2 |

---

## Posicionamento

O BT-Tracker valida a premissa do produto: **há demanda real por uma ferramenta de análise específica de beach tennis**, e há pessoas dispostas a pagar por ela. Isso é uma boa notícia — significa que o problema existe e o mercado reconhece o valor.

O diferencial do Beach Tennis Scout em relação ao BT-Tracker é de abordagem, não de funcionalidade:

| Dimensão | BT-Tracker | Beach Tennis Scout |
|---|---|---|
| Quando os dados são inseridos | Pós-partida (após gravar vídeo) | Durante a partida (tempo real) |
| Quem pode usar | Quem tem tempo de rever o vídeo | Qualquer pessoa na beira da quadra |
| Barreira de entrada | Paga (R$ 35,90/mês) | Gratuito |
| Foco | Análise e relatórios avançados | Registro rápido + estatísticas confiáveis |

O posicionamento do Beach Tennis Scout é **registro em tempo real, gratuito, feito para qualquer técnico ou jogador** — não apenas os que têm tempo e disposição para revisar vídeos depois. A simplicidade do fluxo (2 toques por ponto, funciona offline) é o diferencial principal contra o único concorrente direto existente.

Em relação aos apps de tênis e padel, o posicionamento é o de **única ferramenta com modelagem nativa de beach tennis** — regras corretas, tipos de ponto corretos, sem adaptações.

A janela de oportunidade está aberta: o BT-Tracker existe mas não cobre o uso em campo; as ferramentas de outros esportes existem mas não cobrem beach tennis corretamente. O Beach Tennis Scout pode ocupar o espaço entre os dois.

---

*Relacionado: [[01-Visao-Produto]] · [[03-Mercado]]*
