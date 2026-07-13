# Monetização

> **Versão:** 2.0
> **Data:** 2026-07-13
> **Fase:** MVP — publicidade removida após validação do primeiro deploy

---

## Decisão Central

O Beach Tennis Scout é **100% gratuito para usuários finais** na V1.

Não existe plano pago, não existe funcionalidade bloqueada por paywall. **E, desde a revisão pós-primeiro-deploy, o MVP não exibe nenhuma publicidade** — nenhuma tela reserva espaço para banner, intersticial ou qualquer placeholder de anúncio. Nesta fase, o produto não tem fonte de receita própria; o foco é validar adoção e qualidade dos dados registrados.

Essa decisão é estratégica, não técnica: o objetivo do MVP é **validar adoção**, e qualquer barreira de entrada ou distração — mesmo que pequena — reduz a velocidade de chegada ao mercado, dificulta a leitura dos dados de uso e compromete a qualidade do registro de pontos (o produto central do app).

A infraestrutura de anúncios descrita neste documento **poderá ser reintroduzida em versão futura**, mas fica fora do MVP atual. O restante deste documento preserva o desenho original dos slots de anúncio como referência para essa reintrodução — nada abaixo está implementado hoje.

---

## Estratégia de Publicidade (V2+ — não implementada no MVP)

### Princípio orientador

Caso a publicidade seja reintroduzida no futuro, ela deve ser compatível com o uso profissional do produto. O app é uma ferramenta de trabalho — usado sob pressão, ao sol, com atenção dividida. Um anúncio no lugar errado não gera receita: gera toque acidental, dado errado e usuário que desinstala.

Por isso a estratégia parte de uma restrição, não de uma ambição: **onde os anúncios não podem aparecer define onde eles poderiam aparecer**.

### O que ficaria protegido de publicidade

A tela de Registro de Pontos deve permanecer **integralmente livre de anúncios**, mesmo se a publicidade for reintroduzida. Nenhum banner, nenhum intersticial, nenhum elemento que possa deslocar ou obscurecer os botões de registro. Isso inclui:

- A área dos botões de seleção de jogador (Passo 1)
- A área dos botões de tipo de ponto (Passo 2)
- O placar, o indicador de saque e o painel de Estatísticas ao vivo
- O botão de Undo

A tela de Configuração de Partida também ficaria livre — o usuário está preenchendo dados, qualquer distração aumenta o risco de configuração incorreta.

---

## Locais de Exibição de Anúncios (desenho de referência para reintrodução futura)

### Slots desenhados originalmente (nenhum ativo no MVP atual)

| ID | Tela | Posição | Formato Mobile | Formato Web | Momento |
|---|---|---|---|---|---|
| `AD-01` | Home / Dashboard | Rodapé | 320×50 | 728×90 | Sempre que a tela está visível |
| `AD-02` | Intervalo entre Sets | Centro da tela | 300×250 | 300×250 | 1× por set encerrado |
| `AD-03` | Resumo da Partida | Topo ou rodapé | 320×50 | 728×90 | 1× por partida encerrada |
| `AD-04` | Histórico de Partidas | Entre itens da lista | 320×50 | 728×90 | A cada 5 partidas listadas |

### Descrição de cada slot

**AD-01 — Home:**
O usuário está parado, navegando entre partidas ou aguardando iniciar uma nova. Contexto de baixa pressão, atenção disponível. Banner fixo no rodapé, fora da área de toque principal.

**AD-02 — Intervalo entre Sets:**
Este é o slot mais valioso do ponto de vista de atenção. O set acabou, há uma pausa natural na partida, o usuário está esperando para iniciar o próximo set. Um intersticial de banner médio (300×250) é aceitável aqui porque o usuário está genuinamente em pausa.

**AD-03 — Resumo da Partida:**
A partida terminou. O usuário está lendo o relatório de performance. Alta probabilidade de ficar na tela por mais de 30 segundos. Contexto de leitura, não de ação rápida. Banner no topo ou rodapé sem interferir no conteúdo.

**AD-04 — Histórico:**
Tela de navegação e consulta, não de ação. Anúncio nativo entre os itens da lista (a cada 5 partidas) é o formato menos intrusivo para listas longas.

---

## Limites de UX para Publicidade

Estas regras não são sugestões — são restrições de produto que protegem a qualidade da experiência e, indiretamente, a retenção de usuários:

1. **Nenhum anúncio na tela de Registro de Pontos**, em nenhuma posição.

2. **Nenhum intersticial (fullscreen) durante uma partida ativa.** O único intersticial permitido é o do Intervalo entre Sets, que ocorre em uma pausa natural.

3. **Banners nunca deslocam ou reduzem a área dos botões de ação.** O layout dos botões é fixo. O anúncio ocupa espaço adicional ou uma área reservada — nunca comprime a área de interação.

4. **Cooldown entre intersticiais:** não exibir intersticial se o usuário acabou de ver um nos últimos 2 sets. Em partidas curtas (Pro Set), apenas 1 intersticial por partida.

5. **Sem anúncios sonoros ou com vibração.** O app usa vibração e som como feedback de confirmação de ponto. Anúncio que emita qualquer dessas saídas criaria confusão imediata.

6. **Sem anúncios que expandem automaticamente.** Banners que expandem ao toque acidental são inaceitáveis no contexto de uso rápido com os dedos.

---

## Potencial de Crescimento

### O que o MVP precisa provar antes de qualquer otimização de receita

Antes de pensar em crescimento de receita, o MVP precisa responder:

- Quantas partidas são registradas por usuário ativo por mês?
- Qual é o tempo médio de sessão (duração de uma partida + consulta pós-jogo)?
- Qual é a taxa de retenção após a primeira partida registrada?
- Usuários retornam ao app entre partidas (histórico, stats) ou só usam durante a partida?

Essas métricas definem o potencial real de impressões por usuário — que é o que determina o valor do inventário publicitário.

### Caminhos de crescimento de receita (pós-MVP)

**Mais tráfego:**
A forma mais direta de aumentar receita com publicidade é aumentar o número de usuários e sessões. Parcerias com academias, federações e organizadores de torneios podem acelerar a aquisição orgânica.

**Segmentação:**
À medida que o produto coleta dados de uso (cidade, categoria jogada, frequência), o inventário publicitário pode ser melhor segmentado — o que tende a aumentar o CPM (custo por mil impressões). Anunciantes de esporte, materiais esportivos e academias locais são os mais óbvios.

**Patrocínio de torneios:**
Na V2+, quando o produto suportar torneios inteiros (múltiplas partidas, ranking), existe a possibilidade de patrocínio de torneio: a marca do patrocinador aparece nas telas de placar e resumo durante um evento específico, com visibilidade muito maior que um banner padrão.

**Plano sem anúncios (V2+):**
A introdução de um plano pago que remove anúncios só faz sentido depois que o produto tiver uma base de usuários consolidada e engajada. Fazer isso no MVP seria prematuro e prejudicaria a validação de adoção.

### O que não fazer

- **Não vender espaço publicitário manualmente no MVP.** A operação de venda direta de anúncios tem custo de gestão que não faz sentido na escala do MVP. Redes de anúncios programáticas (Google AdMob para mobile, Google AdSense para web) são o caminho inicial, caso e quando a publicidade for reintroduzida.
- **Não projetar receita publicitária como fonte primária de sustentabilidade no curto prazo.** Com a base de usuários inicial de um MVP, a receita de publicidade será marginal. O objetivo é aprender, não lucrar.
- **Não reintroduzir publicidade sem antes revalidar o impacto na retenção e na qualidade do registro de pontos.** A remoção de anúncios pós-primeiro-deploy foi uma decisão de produto deliberada; reverter isso exige critério explícito (ex: base de usuários mínima, dados de retenção), não apenas disponibilidade técnica.

---

*Relacionado: [[01-Visao-Produto]] · [[03-Mercado]]*
