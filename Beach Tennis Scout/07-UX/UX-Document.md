# Beach Tennis Scout — Documento de UX

> **Versão:** 3.1
> **Data:** 2026-07-14
> **Status:** MVP — Nova identidade visual "Areia & Oceano" (tema claro, ver [[12-Design-System/00-Indice]]); regras No-Ad, estatísticas ao vivo, pausar/continuar partida, publicidade removida

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
9. [[#9. Publicidade]]
10. [[#Persistência e Recuperação de Partida]]
11. [[#Adaptações por Dispositivo]]
12. [[#Sugestão de Estrutura de Pastas]]

---

## 1. Diretrizes de Produto

Esta seção documenta as decisões estratégicas que guiam todas as escolhas de UX e funcionalidade do MVP.

### Modelo de Negócio

- **Produto gratuito:** Não há plano pago na V1. O app é 100% gratuito para todos os usuários.
- **Sem publicidade no MVP:** Após a validação do primeiro deploy, a decisão de produto foi remover toda publicidade (banners, intersticiais e qualquer placeholder de anúncio) da V1. O objetivo do MVP é validar adoção e qualidade do registro de dados — anúncios competiam com esse objetivo sem gerar receita relevante nesta fase. A infraestrutura de anúncios poderá ser reintroduzida em versão futura (ver [[02-Monetizacao]]), mas nenhuma tela do MVP reserva espaço para ela.
- **Sem Premium na V1:** Qualquer referência a "plano premium" ou "versão sem anúncios" está fora do escopo desta versão (já que não há anúncios a remover).

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
| **Tema claro, sempre** | Fundo areia claro (nunca escuro) + botões de alto contraste — o Beach Tennis é jogado de dia, sob sol forte; um fundo escuro reduz a legibilidade exatamente na condição de uso mais comum. Ver [[12-Design-System/00-Indice]] |
| **Undo sem limite** | Desfazer qualquer quantidade de pontos, sempre disponível |
| **Feedback imediato** | Vibração + som + animação a cada ponto registrado (≤ 100ms) |
| **Dados nunca se perdem** | Autosave local após cada ponto, recuperação automática |
| **Área de scout sem distrações** | Tela de registro 100% livre de publicidade — o MVP não exibe nenhum anúncio em nenhuma tela |
| **Estatísticas sempre a um toque** | Botão "Estatísticas" sempre acessível durante a partida, sem interromper o registro |
| **Pausar sem perder nada** | A partida pode ser pausada a qualquer momento; o estado já está salvo automaticamente |

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
- **Banner "Existe uma partida em andamento"** (quando houver): nome das duplas + botão **"Continuar partida"**, exibido em destaque logo abaixo do header
- Lista das últimas 3 partidas com duplas, placar final e data
- Link **"Ver Todas"** → Histórico
- Nenhum espaço reservado para publicidade

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
│ ← Início  Duplas  [📊 Estatísticas] │  ← Header fixo
│           [⏸ Pausar]  [↩ Desfazer] │     (estatísticas sempre acessível)
│  Set 1  •  Game 3  •  40 : 30       │  ← Placar
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

> Os símbolos entre colchetes (📊 ⏸ ↩) nos mockups ASCII acima representam ícones **Lucide** (`chart-column-increasing`, `pause`, `undo-2`) no produto real — o app não usa emojis, ver [[12-Design-System/05-Icons]].
>
> **Sem publicidade nesta tela** — nem em nenhuma outra do MVP. Ver [[#9. Publicidade]].
>
> **Botão "Estatísticas" sempre acessível:** ao tocar, abre um painel lateral (desktop, telas ≥768px) ou modal/bottom-sheet (mobile) com pontos disputados, winners, erros, percentuais e detalhamento por jogador/dupla — sem sair da tela de registro nem perder o passo em que o usuário estava (jogador já selecionado, aguardando o tipo de ponto). Ver [[04-Estatisticas]].
>
> **Botão "Pausar":** salva o estado atual (já ocorre automaticamente a cada ponto) e volta para a Home, onde a partida aparece em destaque para retomada. Ver seção [[#10. Persistência e Recuperação de Partida]].

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

**Propósito:** Pausa entre sets.

**Componentes:**
- Placar do set encerrado (destaque visual)
- Vencedor do set
- Indicação de quem saca no próximo set
- Lembrete de troca de lado (quando aplicável segundo o formato)
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

> Exportação de PDF é uma funcionalidade candidata para V2, não é prioridade do MVP.

---

### 5.7 Tela: Histórico de Partidas

**Propósito:** Consultar partidas anteriores.

**Componentes:**
- Lista de partidas com: duplas, placar final, data, local/torneio (se preenchido)
- Filtros simples: por data, por jogador, por torneio (quando disponível)
- Tap na partida → Detalhe completo

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

- Tamanho mínimo: 100×64px no mobile
- Mostra o nome do jogador (não "Jogador 1")
- Cor de fundo por dupla (ver [[12-Design-System/01-Colors]]):
  - Dupla A → Azul Oceano (`#1E88E5`)
  - Dupla B → Coral (`#FF7043`) — **nunca vermelho**, reservado exclusivamente ao estado de erro
- Estado selecionado: contorno reforçado + destaque
- Estado aguardando: todos os 4 botões visíveis e ativos

### 6.3 Botão de Tipo de Ponto (Passo 2)

- Tamanho mínimo: 80×52px no mobile
- Visível apenas após o Passo 1 ser concluído
- Cores semânticas (ver [[12-Design-System/01-Colors]]):
  - Winners → Verde Vitória (`#2E7D32`)
  - Forçou Erro do Adversário → Verde Vitória (`#2E7D32`) — **exatamente o mesmo destaque dos Winners**, mesma cor, peso e altura de botão
  - Erros → Erro (`#E53935`)
- Disposição: grid de 3 colunas (Forçou Erro ocupa a linha inteira)

### 6.4 Botão Undo

- Posição: canto superior direito, sempre visível durante a partida
- Ícone: Lucide `undo-2` (substituiu o emoji ↩ usado anteriormente — ver [[12-Design-System/05-Icons]])
- Cor: neutro — não compete com botões de ação
- Desativado (opacidade reduzida) quando não há ponto para desfazer

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

## 9. Publicidade

### 9.1 Decisão de produto (pós-validação do primeiro deploy)

Após validar o primeiro deploy do MVP, a publicidade foi **removida por completo** do produto. Nenhuma tela exibe banner, intersticial ou qualquer placeholder reservando espaço para anúncio — inclusive as telas que antes previam banners (Home, Intervalo entre Sets, Resumo da Partida, Histórico).

**Motivação:** a tela de registro de pontos — e, por extensão, todo o fluxo ao redor dela — é uma ferramenta de trabalho profissional usada sob pressão, ao sol, com atenção dividida entre a quadra e o celular. Qualquer elemento de distração compromete a qualidade dos dados registrados, que é o produto central do app. Nesta fase de validação, a prioridade é adoção e confiabilidade dos dados, não receita publicitária.

### 9.2 Futuro

A infraestrutura de anúncios **poderá ser reintroduzida em versão futura**, condicionada a validação de uso real e sem comprometer a tela de registro de pontos (que deve permanecer livre de anúncios mesmo se a monetização por publicidade for retomada). Ver [[02-Monetizacao]] para o racional de negócio.

---

## 10. Persistência e Recuperação de Partida

### 10.1 Autosave

- O estado completo da partida é salvo localmente após **cada ponto registrado**
- O save inclui: placar, lista de pontos, estatísticas, saque atual, set/game/ponto atual
- Não depende de conexão com internet
- Tempo de gravação local deve ser imperceptível (< 50ms)

### 10.2 Pausar Partida

- Botão **"Pausar"** disponível a qualquer momento na tela de registro (ver 5.3)
- Como o autosave já grava o estado a cada ponto, pausar é apenas navegar para a Home — nenhum dado é perdido
- Na Home, enquanto houver uma partida com status `in_progress`, um banner fixo é exibido: **"Existe uma partida em andamento"** com o botão **"Continuar partida"**

### 10.3 Recuperação após Fechamento Inesperado (reabertura do navegador)

Quando o app é reaberto em uma nova sessão do navegador (ex.: navegador foi fechado e reaberto) e existe uma partida salva com status `in_progress`, a Home exibe uma única vez o diálogo:

```
┌────────────────────────────────────────┐
│                                        │
│  Deseja continuar a partida            │
│  em andamento?                        │
│                                        │
│  Ana/Bia × Cris/Dani                  │
│                                        │
│   [  Agora não  ]  [ Continuar partida ]│
│                                        │
└────────────────────────────────────────┘
```

- "Continuar partida" → navega direto para a tela de registro, exatamente no estado salvo
- "Agora não" → fecha o diálogo; o banner da Home (10.2) continua disponível para retomar quando o usuário quiser
- O diálogo é perguntado no máximo uma vez por sessão de navegador (controlado via `sessionStorage`), para não incomodar a cada visita à Home dentro da mesma sessão
- Excluir a partida continua sendo uma ação explícita e separada, feita a partir do card da partida (não a partir deste diálogo)

### 10.4 Comportamento por Dispositivo

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
- O botão "Estatísticas" abre o painel **como painel lateral fixo** (não modal) em telas ≥768px — comportamento nativo do componente `StatsDrawer`, que também é reutilizado nas telas de resumo pós-partida

```
┌─────────────────┬──────────────────────┬─────────────────┐
│                 │                      │                 │
│  HISTÓRICO      │   QUEM FEZ O PONTO?  │  ESTATÍSTICAS   │
│  DO JOGO        │   [Ana] [Bia]        │  (painel lateral│
│                 │   [Cris][Dani]       │   ao abrir)     │
│  Set 1:         │                      │  Winners A: 5   │
│  · Ana Win D    │   COMO FOI?          │  Winners B: 3   │
│  · Cris Err E   │   [Win D][Win E]     │  Erros A: 2     │
│  · Bia Ace      │   [Win P][Win C]     │  Erros B: 4     │
│  · Dani Drop    │   [Lob  ][Smash ]    │                 │
│  · ...          │   [Drop ][Ace   ]    │  Por jogador ↓  │
│                 │   [Err D][Err E ]    │                 │
│                 │   [Err L][Err S ]    │                 │
│                 │   [ErrSq][Forçou]    │                 │
│                 │                      │                 │
└─────────────────┴──────────────────────┴─────────────────┘
```

> Em mobile (<768px), o mesmo botão abre o painel como modal/bottom-sheet cobrindo a parte inferior da tela, preservando o placar visível acima.

---

## 12. Sugestão de Estrutura de Pastas

Criar a pasta `09-Negocio` no vault com os seguintes documentos:

```
09-Negocio/
├── Visao-Produto.md      ← Missão, público-alvo, proposta de valor, diferencial
├── Monetizacao.md        ← Publicidade removida no MVP; racional e critérios para reintrodução futura
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
- Toda decisão de cor, tipografia, componente, espaçamento, ícone e movimento é normativa em [[12-Design-System/00-Indice]] — este documento descreve fluxos e telas, aquele é a fonte de verdade visual

---

*Beach Tennis Scout — Documento de UX v3.1 — Uso interno*
