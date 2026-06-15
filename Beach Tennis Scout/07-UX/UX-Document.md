# Beach Tennis Scout — Documento de UX

> **Versão:** 2.0
> **Data:** 2026-06-14
> **Status:** MVP — Revisado com decisões de produto aprovadas

---

## Índice

1. [[#Diretrizes de Produto]]
2. [[#Personas e Contextos de Uso]]
3. [[#Princípios de Design]]
4. [[#Fluxo Completo do Usuário]]
5. [[#Catálogo de Telas]]
6. [[#Componentes Principais]]
7. [[#Navegação entre Telas]]
8. [[#Estratégia de Registro Rápido — Modelo 2 Toques]]
9. [[#Publicidade e Banners]]
10. [[#Persistência e Recuperação de Partida]]
11. [[#Adaptações por Dispositivo]]
12. [[#Sugestão de Estrutura de Pastas]]

---

## 1. Diretrizes de Produto

Esta seção documenta as decisões estratégicas que guiam todas as escolhas de UX e funcionalidade do MVP.

### Modelo de Negócio

- **Produto gratuito:** Não há plano pago na V1. O app é 100% gratuito para todos os usuários.
- **Monetização por publicidade:** A única fonte de receita no MVP é publicidade (banners e intersticiais em telas não-críticas).
- **Sem Premium na V1:** Qualquer referência a "plano premium" ou "versão sem anúncios" está fora do escopo desta versão.

### Objetivo do MVP

- Validar adoção e uso real do produto em campo antes de qualquer estratégia de assinatura ou funcionalidades avançadas.
- Lançar rápido, aprender rápido, iterar.
- O produto precisa funcionar bem em uma única sessão de uso (uma partida completa) sem falhas.

### O que está fora do escopo do MVP

- Análise por inteligência artificial
- Análise de vídeo
- Reconhecimento automático de jogadas
- Sync em nuvem em tempo real (pode ser V2)
- Dashboard de estatísticas avançado (V2)
- Múltiplas partidas simultâneas
- Cadastro de usuário / login obrigatório

> **Nota:** Existe a visão de um produto separado, baseado em IA e vídeo, para versões futuras. Este produto é distinto do Beach Tennis Scout MVP e não deve influenciar as decisões de arquitetura desta versão.

### Prioridades de desenvolvimento

1. Facilidade de uso durante partidas ao vivo
2. Registro rápido dos pontos (2 toques)
3. Estatísticas confiáveis e corretas
4. Funcionamento 100% offline
5. Velocidade de lançamento

---

## 2. Personas e Contextos de Uso

### Persona A — Árbitro / Scout na Beira da Quadra
- **Dispositivo:** Celular (iPhone/Android)
- **Condição:** Sol forte, uma mão livre, possivelmente com luva ou suado
- **Objetivo:** Registrar cada ponto em menos de 3 segundos sem tirar os olhos da quadra
- **Dor:** Toque impreciso, tela pequena, distração durante o rally

### Persona B — Técnico / Analista no Banco
- **Dispositivo:** Tablet (iPad)
- **Condição:** Sentado, mais tempo para análise, visão geral da partida
- **Objetivo:** Registrar pontos e acompanhar estatísticas em tempo real
- **Dor:** Precisa de visão simultânea do placar e da área de registro

### Persona C — Analista Pós-Jogo / Clube
- **Dispositivo:** Desktop (navegador web)
- **Condição:** Escritório ou home office, após a partida
- **Objetivo:** Revisar dados, corrigir pontos registrados incorretamente, exportar relatórios
- **Dor:** Quer poder corrigir pontos sem restrições e sem perder a sequência da partida

---

## 3. Princípios de Design

| Princípio | Aplicação no MVP |
|---|---|
| **2 toques = 1 ponto** | Jogador → Como foi. Confirmação automática no 2º toque |
| **Zona de polegar** | Todos os botões de ação na metade inferior da tela no mobile |
| **Contraste extremo** | Fundo escuro + botões de alto contraste para uso ao sol |
| **Undo sem limite** | Desfazer qualquer quantidade de pontos, sempre disponível |
| **Feedback imediato** | Vibração + som + animação a cada ponto registrado (≤ 100ms) |
| **Dados nunca se perdem** | Autosave local após cada ponto, recuperação automática |
| **Área de scout sem distrações** | Tela de registro livre de publicidade |

---

## 4. Fluxo Completo do Usuário

```
[Abertura do App]
      │
      ├─► [Partida em andamento detectada] ──► "Continuar partida?" ──► [Registro de Pontos]
      │
      ▼
[Home / Dashboard]
      │
      ├── Nova Partida
      │         │
      │         ▼
      │   [Configurar Partida]
      │   · Nomes dos jogadores (A1, A2, B1, B2)
      │   · Formato da partida
      │   · Quem saca primeiro
      │   · [Opcional] Torneio, Local, Categoria, Observações
      │         │
      │         ▼
      │   [Registro de Pontos]  ←──────────────────────────────┐
      │         │                                               │
      │         ├── [Fim de Set] ──► [Intervalo] ──────────────┘
      │         │
      │         └── [Fim da Partida]
      │                   │
      │                   ▼
      │           [Resumo da Partida]
      │                   │
      │                   ├── Nova Partida
      │                   └── Voltar ao Home
      │
      ├── Histórico de Partidas
      │         │
      │         └── [Detalhe da Partida]
      │
      └── Configurações
```

---

## 5. Catálogo de Telas

### 5.1 Tela: Home / Dashboard

**Propósito:** Ponto de entrada. Acesso imediato a nova partida ou ao histórico.

**Componentes:**
- Header com logo e ícone de configurações
- Botão CTA primário: **"Nova Partida"** (destaque visual, área generosa)
- Lista das últimas 3 partidas com duplas, placar final e data
- Link **"Ver Todas"** → Histórico
- Banner de publicidade no rodapé (fora da área de interação principal)

---

### 5.2 Tela: Configurar Partida

**Propósito:** Definir os parâmetros da partida antes de iniciar.

**Campos obrigatórios:**
- Nome do Jogador A1
- Nome do Jogador A2
- Nome do Jogador B1
- Nome do Jogador B2
- Formato da partida:
  - Pro Set (até 16 games — tie-break em 15/15)
  - Melhor de 3 Sets
  - Melhor de 5 Sets
- Quem saca primeiro: `[Dupla A]` `[Dupla B]`

**Campos opcionais** *(seção recolhível "Dados do Contexto"):*
- Nome do torneio
- Local da partida
- Categoria (ex: Masculino A, Misto B)
- Observações livres

> **Por que coletar dados de contexto?**
> Esses campos não afetam o fluxo da partida, mas enriquecem o histórico. Futuramente permitirão filtros por torneio, relatórios por categoria, comparação de desempenho por local e análise de evolução do jogador ao longo de eventos. Sendo opcionais, não adicionam atrito ao fluxo do MVP.

- Botão: **"Iniciar Partida"**

> Os nomes dos jogadores ficam salvos localmente para reutilização em partidas futuras (autocomplete simples).

---

### 5.3 Tela: Registro de Pontos *(tela principal)*

**Propósito:** Registrar cada ponto com exatamente 2 toques. Esta é a tela mais crítica do sistema e deve ser livre de qualquer distração.

**Layout mobile:**

```
┌─────────────────────────────────────┐
│  Set 1  •  Game 3  •  40 : 30  [↩] │  ← Header fixo (placar + undo)
│  ● Saque: Ana / Bia                 │  ← Indicador de saque
├─────────────────────────────────────┤
│                                     │
│         QUEM FEZ O PONTO?           │  ← Passo 1 — sempre visível
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │   Ana    │  │   Bia    │        │  ← Dupla A
│  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐        │
│  │   Cris   │  │   Dani   │        │  ← Dupla B
│  └──────────┘  └──────────┘        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│           COMO FOI?                 │  ← Passo 2 — aparece após Passo 1
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │ Winner Dir  │  │ Winner Esq   │ │
│  └─────────────┘  └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │ Winner Par  │  │ Winner Cruz  │ │
│  └─────────────┘  └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │    Lob      │  │    Smash     │ │
│  └─────────────┘  └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │  Drop Shot  │  │     Ace      │ │
│  └─────────────┘  └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │  Erro Dir   │  │  Erro Esq    │ │
│  └─────────────┘  └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │  Erro Lob   │  │  Erro Smash  │ │
│  └─────────────┘  └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │ Erro Saque  │  │ Forçou Erro  │ │
│  └─────────────┘  └──────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

> **Sem publicidade nesta tela.** Ver [[#Publicidade e Banners]] para justificativa.

**Fluxo de estado — 1 ponto registrado:**

```
Estado 0: Aguardando
   └─► Exibe: "Quem fez o ponto?" + os 4 jogadores

   Toque 1: Jogador selecionado (ex: Ana)
      └─► Destaque visual no botão selecionado
          Exibe: "Como foi?" + grid de tipos de ponto
          Vibração curta (50ms)

   Toque 2: Tipo de ponto selecionado (ex: Winner Direita)
      └─► PONTO SALVO AUTOMATICAMENTE
          Vibração longa (150ms) + som
          Placar atualiza com animação
          Retorna ao Estado 0
```

---

### 5.4 Comportamento: Desfazer Ponto (Undo)

**Propósito:** Corrigir pontos registrados incorretamente, sem limite de quantidade.

**Regras:**
- Botão `[↩]` sempre visível no header da tela de registro
- Ao tocar: exibe modal de confirmação com resumo do último ponto
  - Texto: *"Desfazer: Ana — Winner Direita (40:30 → 40:15)?"*
  - Ações: `[Desfazer]` | `[Cancelar]`
- Sem limite de undos: o usuário pode desfazer quantos pontos precisar
- Cada undo restaura o placar, as estatísticas e o indicador de saque ao estado anterior
- O botão fica desativado (cinza) apenas quando não há nenhum ponto registrado na partida

> **Por que sem limite?** Em partidas ao vivo, erros de registro acontecem. Um técnico que perdeu o ponto por distração precisa corrigir vários pontos sem nenhuma barreira artificial. Limitar o undo cria frustração sem nenhum benefício real.

---

### 5.5 Tela: Intervalo entre Sets

**Propósito:** Pausa entre sets. Momento adequado para exibir publicidade.

**Componentes:**
- Placar do set encerrado (destaque visual)
- Vencedor do set
- Indicação de quem saca no próximo set
- Lembrete de troca de lado (quando aplicável segundo o formato)
- Banner de publicidade (300×250) — único momento dentro da partida onde isso é aceitável
- Botão: **"Iniciar Próximo Set"**

---

### 5.6 Tela: Resumo da Partida

**Propósito:** Visão geral pós-partida com estatísticas completas.

**Componentes:**
- Placar final (sets e games)
- Vencedor destacado
- Tabela de estatísticas por jogador:
  - Total de pontos ganhos
  - Winners por tipo (direita, esquerda, paralelo, cruzado, lob, smash, drop shot, ace)
  - Erros não-forçados por tipo (direita, esquerda, lob, smash, saque)
  - Pontos por erro do adversário (forçados)
- Botões: `[Compartilhar]` `[Nova Partida]` `[Voltar ao Home]`
- Banner de publicidade (728×90 no web / 320×50 no mobile) no topo ou rodapé da tela

> Exportação de PDF é uma funcionalidade candidata para V2, não é prioridade do MVP.

---

### 5.7 Tela: Histórico de Partidas

**Propósito:** Consultar partidas anteriores.

**Componentes:**
- Lista de partidas com: duplas, placar final, data, local/torneio (se preenchido)
- Filtros simples: por data, por jogador, por torneio (quando disponível)
- Tap na partida → Detalhe completo
- Banner de publicidade entre itens da lista (a cada 5 itens)

---

### 5.8 Tela: Detalhe da Partida

**Propósito:** Revisão completa de uma partida encerrada.

**Componentes:**
- Timeline de todos os pontos (rolável): Set / Game / Ponto / Jogador / Tipo
- Estatísticas agregadas por set
- Dados de contexto (torneio, local, categoria, observações)
- Botão de edição por ponto individual (para correção pós-jogo)

---

### 5.9 Tela: Configurações

**Componentes:**
- Som ao registrar ponto (ativar/desativar)
- Vibração (ativar/desativar)
- Tema (claro / escuro / automático)
- Gerenciar jogadores salvos
- Sobre o app / versão

---

## 6. Componentes Principais

### 6.1 Placar (Score Display)

```
┌──────────────────────────────────────────┐
│  ANA / BIA          CRIS / DANI          │
│     6    4    |    2    3                 │  ← Games por set
│          40    :    30                    │  ← Ponto atual do game
│  ● Saque: Ana / Bia                      │  ← Indicador de saque
└──────────────────────────────────────────┘
```

- Sempre visível no topo da tela de registro
- Atualiza instantaneamente após cada ponto (animação de slide)
- Fonte grande, legível ao sol e a distância

### 6.2 Botão de Jogador (Passo 1)

- Tamanho mínimo: 100×60px no mobile
- Mostra o nome do jogador (não "Jogador 1")
- Cor de fundo por dupla:
  - Dupla A → Azul (`#1565C0`)
  - Dupla B → Vermelho (`#C62828`)
- Estado selecionado: borda branca + destaque
- Estado aguardando: todos os 4 botões visíveis e ativos

### 6.3 Botão de Tipo de Ponto (Passo 2)

- Tamanho mínimo: 80×56px no mobile
- Visível apenas após o Passo 1 ser concluído
- Cores semânticas:
  - Winners → Verde (`#2E7D32`)
  - Erros → Laranja (`#E65100`)
  - Ace → Roxo (`#6A1B9A`)
  - Drop Shot → Ciano (`#00838F`)
  - Forçou Erro → Amarelo escuro (`#F57F17`)
- Disposição: grid 2 colunas

### 6.4 Botão Undo

- Posição: canto superior direito, sempre visível durante a partida
- Ícone: seta curva para esquerda `[↩]`
- Cor: cinza neutro — não compete com botões de ação
- Desativado (cinza claro) quando não há ponto para desfazer

### 6.5 Indicador de Saque

- Linha de texto abaixo do placar: "● Saque: [Nome] / [Nome]"
- Atualiza automaticamente conforme as regras do formato selecionado
- Sem animação excessiva — texto simples é suficiente

---

## 7. Navegação entre Telas

```
Home
 ├──► Configurar Partida ──► Registro de Pontos
 │                                   │
 │                         [Fim de Set] ──► Intervalo ──► Registro (próx. set)
 │                                   │
 │                         [Fim da Partida] ──► Resumo
 │                                              │
 │                                    ├──► Nova Partida
 │                                    └──► Home
 │
 ├──► Histórico ──► Detalhe da Partida
 │
 └──► Configurações
```

**Regras de navegação:**
- Sem gestos de swipe durante o registro (previne saída acidental)
- Botão "voltar" do sistema desativado na tela de registro (usuário deve encerrar a partida conscientemente)
- Confirmação obrigatória para encerrar a partida antes do fim natural

---

## 8. Estratégia de Registro Rápido — Modelo 2 Toques

### 8.1 O Modelo

Cada ponto é registrado com exatamente 2 toques, na seguinte ordem:

```
Toque 1: QUEM FEZ O PONTO?
   → [Ana]  [Bia]  [Cris]  [Dani]
   (os 4 jogadores exibidos desde o início, sem precisar selecionar a dupla primeiro)

Toque 2: COMO FOI?
   → [Winner Direita] [Winner Esquerda] [Winner Paralelo] [Winner Cruzado]
     [Lob]            [Smash]           [Drop Shot]       [Ace]
     [Erro Direita]   [Erro Esquerda]   [Erro Lob]        [Erro Smash]
     [Erro Saque]     [Forçou Erro]
```

Após o Toque 2, o ponto é **salvo automaticamente** — sem confirmação adicional.

### 8.2 Ganhos em relação ao modelo de 3 toques anterior

| Critério | Modelo Anterior (3 toques) | Modelo Atual (2 toques) |
|---|---|---|
| Toques por ponto | 3 | 2 |
| Passos intermediários | Dupla → Jogador → Tipo | Jogador → Tipo |
| Tempo estimado por ponto | ~4–5 segundos | ~2–3 segundos |
| Risco de erro (toque errado) | Alto (3 decisões) | Menor (2 decisões) |
| Carga cognitiva | Média | Baixa |
| Adequação ao uso ao sol | Razoável | Boa |

> **Impacto real:** Em uma partida de 80 pontos, o modelo de 2 toques economiza aproximadamente 80–160 segundos de interação e reduz a atenção exigida do scout durante os rallies.

### 8.3 Posicionamento Ergonômico (Mobile)

```
┌─────────────────────────────────────┐
│   [Placar + Saque]        [↩ Undo]  │  ← Header fixo
├─────────────────────────────────────┤
│         QUEM FEZ O PONTO?           │
│   [  Ana  ]        [  Bia  ]        │  ← Dupla A (azul)
│   [  Cris ]        [  Dani ]        │  ← Dupla B (vermelho)
├─────────────────────────────────────┤  ← ativado após Passo 1
│           COMO FOI?                 │
│  [Winner Dir]   [Winner Esq]        │
│  [Winner Par]   [Winner Cruz]       │  ← Winners (verde)
│  [Lob       ]   [Smash      ]       │
│  [Drop Shot ]   [Ace        ]       │
│  [Erro Dir  ]   [Erro Esq   ]       │  ← Erros (laranja)
│  [Erro Lob  ]   [Erro Smash ]       │
│  [Erro Saque]   [Forçou Erro]       │
└─────────────────────────────────────┘
```

Os botões do Passo 1 ficam na metade superior da tela. Os botões do Passo 2 ocupam a metade inferior — zona natural de alcance do polegar.

### 8.4 Feedback Multicanal

| Canal | Quando ocorre |
|---|---|
| Vibração curta (50ms) | Toque 1 confirmado |
| Vibração longa (150ms) | Ponto salvo (Toque 2) |
| Som de bola | Ponto salvo |
| Animação no placar | Número desliza para o novo valor |
| Flash de cor na borda | Pisca na cor da dupla vencedora |

### 8.5 Proteção contra Toque Acidental

- Cooldown de 600ms entre o registro de dois pontos consecutivos
- O Passo 2 só aparece após o Passo 1 ser tocado (impede toque acidental no tipo sem selecionar jogador)
- Undo sempre disponível para corrigir qualquer engano

### 8.6 Mapa Completo de Tipos de Ponto

| Código | Label | Categoria | Quando usar |
|---|---|---|---|
| `WINNER_DIR` | Winner Direita | Winner | Bola vencedora pelo lado direito |
| `WINNER_ESQ` | Winner Esquerda | Winner | Bola vencedora pelo lado esquerdo |
| `WINNER_PAR` | Winner Paralelo | Winner | Bola vencedora em linha paralela |
| `WINNER_CRU` | Winner Cruzado | Winner | Bola vencedora diagonal cruzada |
| `LOB` | Lob | Winner | Ponto por lob vencedor |
| `SMASH` | Smash | Winner | Ponto por smash |
| `DROP` | Drop Shot | Winner | Ponto por drop shot |
| `ACE` | Ace | Saque | Ace direto no saque |
| `ERRO_DIR` | Erro Direita | Erro | Erro não-forçado pelo lado direito |
| `ERRO_ESQ` | Erro Esquerda | Erro | Erro não-forçado pelo lado esquerdo |
| `ERRO_LOB` | Erro Lob | Erro | Erro de lob (na rede ou fora) |
| `ERRO_SMASH` | Erro Smash | Erro | Erro de smash |
| `ERRO_SAQUE` | Erro Saque | Erro | Falta ou dupla falta no saque |
| `FORCOU_ERRO` | Forçou Erro | Forçado | Adversário errou por pressão do jogador |

### 8.7 Atalhos de Teclado (Desktop)

| Tecla | Ação |
|---|---|
| `1` | Seleciona Jogador A1 |
| `2` | Seleciona Jogador A2 |
| `3` | Seleciona Jogador B1 |
| `4` | Seleciona Jogador B2 |
| `Q` | Winner Direita |
| `W` | Winner Esquerda |
| `E` | Winner Paralelo |
| `R` | Winner Cruzado |
| `A` | Lob |
| `S` | Smash |
| `D` | Drop Shot |
| `F` | Ace |
| `Z` | Erro Direita |
| `X` | Erro Esquerda |
| `C` | Erro Lob |
| `V` | Erro Smash |
| `B` | Erro Saque |
| `N` | Forçou Erro |
| `Ctrl+Z` | Undo |

---

## 9. Publicidade e Banners

### 9.1 Filosofia

A tela de registro de pontos é uma ferramenta de trabalho profissional usada sob pressão, ao sol, com atenção dividida entre a quadra e o celular. Qualquer elemento de distração nessa tela compromete a qualidade dos dados registrados — que é o produto central do app.

Publicidade mal posicionada não gera receita: gera cliques acidentais, dados incorretos e abandono do produto.

### 9.2 Onde anúncios aparecem (V1)

| ID | Tela | Posição | Formato Mobile | Formato Desktop | Frequência |
|---|---|---|---|---|---|
| `AD-01` | Home | Rodapé | 320×50 | 728×90 | Sempre visível |
| `AD-02` | Intervalo entre Sets | Centro da tela | 300×250 | 300×250 | 1× por set |
| `AD-03` | Resumo da Partida | Topo ou rodapé | 320×50 | 728×90 | 1× por partida |
| `AD-04` | Histórico de Partidas | Entre itens | 320×50 | 728×90 | A cada 5 itens |

### 9.3 Onde anúncios NÃO aparecem

- **Tela de Registro de Pontos** — área de trabalho ativa, sem distrações
- **Tela de Configurar Partida** — fluxo de entrada, precisa de foco
- **Modal de Undo** — ação crítica de correção
- **Tela de Fim de Partida / Transição** — momento de atenção do usuário

### 9.4 Regras gerais

- Banners nunca deslocam ou reduzem a área dos botões de registro
- Anúncios intersticiais (fullscreen) apenas na tela de Intervalo entre Sets
- Nenhum anúncio em tela cheia durante uma partida ativa (entre pontos)

---

## 10. Persistência e Recuperação de Partida

### 10.1 Autosave

- O estado completo da partida é salvo localmente após **cada ponto registrado**
- O save inclui: placar, lista de pontos, estatísticas, saque atual, set/game/ponto atual
- Não depende de conexão com internet
- Tempo de gravação local deve ser imperceptível (< 50ms)

### 10.2 Recuperação após Fechamento Inesperado

Quando o app é reaberto e detecta uma partida salva não encerrada, exibe imediatamente:

```
┌────────────────────────────────────────┐
│                                        │
│   Partida em andamento encontrada      │
│                                        │
│   Ana/Bia × Cris/Dani                 │
│   Set 1 · Game 3 · 40:30              │
│                                        │
│   [  Continuar Partida  ]              │
│   [  Descartar e ir ao Home  ]         │
│                                        │
└────────────────────────────────────────┘
```

- "Continuar Partida" → restaura exatamente o estado anterior
- "Descartar" → solicita confirmação adicional antes de apagar

### 10.3 Comportamento por Dispositivo

| Cenário | Mobile | Tablet | Desktop |
|---|---|---|---|
| App vai para segundo plano | Mantém estado em memória | Mantém estado em memória | Mantém estado na aba |
| App é fechado pelo SO | Restaura do armazenamento local | Restaura do armazenamento local | Restaura do localStorage/IndexedDB |
| Dispositivo reinicia | Restaura do armazenamento local | Restaura do armazenamento local | Restaura do localStorage/IndexedDB |
| Queda de conexão | Sem impacto (100% offline) | Sem impacto | Sem impacto |
| Troca de dispositivo | Sem suporte na V1 | Sem suporte na V1 | Sem suporte na V1 |

> Sync entre dispositivos é candidato para V2, quando a base de usuários justificar o investimento.

---

## 11. Adaptações por Dispositivo

### 11.1 Mobile (< 768px)

- Layout em coluna única
- Botões de jogador em 2 colunas (largura generosa)
- Botões de tipo de ponto em 2 colunas (grid rolável se necessário)
- Tudo acessível com polegar, sem precisar rolar na maior parte da interação
- Modo paisagem (opcional): placar à esquerda, botões à direita

### 11.2 Tablet (768px–1199px)

- Layout em duas colunas: placar + estatísticas à esquerda / botões à direita
- Placar mais detalhado com histórico do game visível
- Botões maiores (mínimo 120×70px)
- Estatísticas em tempo real sempre visíveis no painel esquerdo

```
┌──────────────────────┬──────────────────────────┐
│                      │                          │
│   PLACAR             │   QUEM FEZ O PONTO?      │
│   Ana/Bia 40 : 30    │   [Ana]  [Bia]           │
│   Set 1 · Game 3     │   [Cris] [Dani]          │
│                      │                          │
│   STATS AO VIVO      │   COMO FOI?              │
│   Winners: A5 / B3   │   [Win D] [Win E]        │
│   Erros:   A2 / B4   │   [Win P] [Win C]        │
│   Aces:    A1 / B0   │   [Lob]   [Smash]        │
│                      │   [Drop]  [Ace]          │
│                      │   [Err D] [Err E]        │
│                      │   [Err L] [Err S]        │
│                      │   [Err Sq][Forçou]       │
│                      │                          │
└──────────────────────┴──────────────────────────┘
```

### 11.3 Desktop Web (≥ 1200px)

- Layout em 3 colunas: histórico de pontos | registro | estatísticas
- Registro de ponto via teclado (atalhos mapeados na seção 8.7)
- Timeline completa de pontos visível na coluna esquerda durante a partida
- Publicidade na coluna direita, abaixo das estatísticas (sem competir com a área de registro)

```
┌─────────────────┬──────────────────────┬─────────────────┐
│                 │                      │                 │
│  HISTÓRICO      │   QUEM FEZ O PONTO?  │  ESTATÍSTICAS   │
│  DO JOGO        │   [Ana] [Bia]        │                 │
│                 │   [Cris][Dani]       │  Winners A: 5   │
│  Set 1:         │                      │  Winners B: 3   │
│  · Ana Win D    │   COMO FOI?          │  Erros A: 2     │
│  · Cris Err E   │   [Win D][Win E]     │  Erros B: 4     │
│  · Bia Ace      │   [Win P][Win C]     │                 │
│  · Dani Drop    │   [Lob  ][Smash ]    │                 │
│  · ...          │   [Drop ][Ace   ]    │  [Banner AD]    │
│                 │   [Err D][Err E ]    │                 │
│                 │   [Err L][Err S ]    │                 │
│                 │   [ErrSq][Forçou]    │                 │
│                 │                      │                 │
└─────────────────┴──────────────────────┴─────────────────┘
```

---

## 12. Sugestão de Estrutura de Pastas

Criar a pasta `09-Negocio` no vault com os seguintes documentos:

```
09-Negocio/
├── Visao-Produto.md      ← Missão, público-alvo, proposta de valor, diferencial
├── Monetizacao.md        ← Modelo de publicidade, slots, parceiros futuros, roadmap de receita
├── Mercado.md            ← Tamanho de mercado, perfil de usuário, onde jogam, frequência
└── Concorrentes.md       ← Ferramentas existentes, o que fazem bem, onde falham, nosso espaço
```

> Esses documentos não são necessários para o desenvolvimento do MVP mas são fundamentais para decisões de crescimento pós-lançamento e para alinhar o time em torno da estratégia de negócio.

---

## Notas de Implementação

- Funcionamento **100% offline** é não-negociável para o MVP
- Tempo de resposta do toque ao feedback visual: ≤ 100ms
- Armazenamento local: IndexedDB no web, AsyncStorage no mobile (React Native) ou equivalente nativo
- Não implementar login/auth na V1 — aumenta atrito sem valor proporcional no MVP
- Não implementar exportação de PDF na V1 — compartilhar via texto/screenshot é suficiente para validar

---

*Beach Tennis Scout — Documento de UX v2.0 — Uso interno*
