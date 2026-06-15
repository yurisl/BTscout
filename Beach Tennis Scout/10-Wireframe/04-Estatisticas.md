# Wireframe — Estatísticas em Tempo Real

> **Tela:** Estatísticas
> **Rota Next.js:** `/match/[id]/stats`
> **Prioridade:** Média — complementar à tela de Scout
> **Publicidade:** Sem publicidade durante partida ativa; AD-03 no rodapé quando partida encerrada

---

## Objetivo

Exibir as estatísticas acumuladas da partida em andamento ou encerrada. Durante a partida, é acessada via menu `[⋮]` e permite voltar ao scout. Quando a partida é encerrada, esta tela se torna o Resumo Final.

Esta tela é calculada exclusivamente a partir dos `PointEvent`s registrados — nenhum dado é gravado manualmente aqui.

---

## Componentes

| Componente | Tipo | Estado |
|---|---|---|
| Header com placar e botão voltar | Fixo | Sempre |
| Seletor de escopo (Partida / Set 1 / Set 2 / ...) | Tabs | Sempre |
| Placar atual | Display | Sempre |
| Cards de totais (pontos, winners, erros) | Cards | Sempre |
| Tabela de winners por subtipo | Tabela | Sempre |
| Tabela de erros por subtipo | Tabela | Sempre |
| Estatísticas de saque | Seção | Sempre |
| Banner AD-03 | Publicidade | Apenas partida encerrada |
| Botão "Voltar ao Scout" | CTA | Apenas partida ativa |
| Botões pós-jogo (Compartilhar / Nova Partida) | CTAs | Apenas partida encerrada |

---

## Comportamento — Mobile (< 768px)

```
┌─────────────────────────────────────────┐
│  [←]  Estatísticas              [⋮]    │  ← header 56px
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ANA / BIA    6×4  ×  2×6  CRI/DAN │  ← placar compacto
│  │       Set 1: 40 : 30 (atual)   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [ Partida ] [ Set 1 ] [ Set 2 ]       │  ← tabs de escopo
│  ──────────                             │    aba ativa: sublinhado azul
│                                         │
│  TOTAIS                                 │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  DUPLA A ¹   │  │   DUPLA B ¹  │   │  ← 2 colunas lado a lado
│  │   21 pts     │  │   18 pts     │   │    altura: 64px
│  └──────────────┘  └──────────────┘   │
│  ¹ Em simples: nome do jogador (ex: "ANA" / "CARLOS")   │
│                                         │
│  WINNERS                                │
│  ┌─────────────────────────────────┐   │
│  │               A    B           │   │  ← tabela comparativa
│  │  Winner Dir   3    1           │   │    linha: 36px
│  │  Winner Esq   1    2           │   │
│  │  Winner Par   1    0           │   │
│  │  Winner Cruz  0    1           │   │
│  │  Lob          1    0           │   │
│  │  Smash        2    1           │   │
│  │  Drop Shot    1    0           │   │
│  │  Ace          1    0           │   │
│  │  ──────────── ─    ─           │   │
│  │  TOTAL        10   5           │   │    linha de total: bold
│  └─────────────────────────────────┘   │
│                                         │
│  ERROS NÃO-FORÇADOS                     │
│  ┌─────────────────────────────────┐   │
│  │               A    B           │   │
│  │  Erro Dir     1    3           │   │
│  │  Erro Esq     1    2           │   │
│  │  Erro Lob     0    1           │   │
│  │  Erro Smash   0    1           │   │
│  │  Erro Saque   0    1           │   │
│  │  ──────────── ─    ─           │   │
│  │  TOTAL        2    8           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FORÇOU ERRO DO ADVERSÁRIO              │
│  ┌─────────────────────────────────┐   │
│  │               A    B           │   │
│  │  Forçou Erro  9    5           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  SAQUE                                  │
│  ┌─────────────────────────────────┐   │
│  │               A    B           │   │
│  │  1º Saque %   68%  71%         │   │
│  │  2º Saque %   80%  75%         │   │
│  │  Aces         1    0           │   │
│  │  Duplas Faltas 0   1           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       VOLTAR AO SCOUT           │   │  ← apenas partida ativa
│  └─────────────────────────────────┘   │    bg: #1565C0
│                                         │
│  [espaço safe area]                     │
└─────────────────────────────────────────┘
```

**Quando partida encerrada — diferenças:**

```
┌─────────────────────────────────────────┐
│  [←]  Resumo Final              [⋮]    │  ← título muda
├─────────────────────────────────────────┤
│                                         │
│  ╔═════════════════════════════════╗   │  ← AD-03 aparece APENAS
│  ║  AD-03 · Banner 320×50        ║   │     quando partida encerrada
│  ╚═════════════════════════════════╝   │
│                                         │
│  [ VENCEDOR: ANA / BIA ]               │  ← destaque em verde
│                                         │
│  [ ... estatísticas ... ]               │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │        COMPARTILHAR             │   │  ← substituem "Voltar ao Scout"
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │        NOVA PARTIDA             │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │        VOLTAR AO HOME           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Comportamento — Tablet (768px–1199px)

```
┌──────────────────────────────────────────────────────┐
│  [←]  Estatísticas                        [⋮]       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  ANA/BIA  6-4 · 2-6 · 40:30  ×  CRIS/DANI  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [ Partida ] [ Set 1 ] [ Set 2 ]                     │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────┐      │
│  │  TOTAIS            │  │  SAQUE             │      │
│  │  Pts A: 21         │  │  1º %  A:68 / B:71 │      │
│  │  Pts B: 18         │  │  2º %  A:80 / B:75 │      │
│  │  Win A: 10  B: 5   │  │  Aces  A: 1 / B: 0 │      │
│  │  Err A:  2  B: 8   │  │  DFlt  A: 0 / B: 1 │      │
│  └────────────────────┘  └────────────────────┘      │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────┐      │
│  │  WINNERS      A  B │  │  ERROS        A  B │      │
│  │  Direita      3  1 │  │  Direita      1  3 │      │
│  │  Esquerda     1  2 │  │  Esquerda     1  2 │      │
│  │  Paralelo     1  0 │  │  Lob          0  1 │      │
│  │  Cruzado      0  1 │  │  Smash        0  1 │      │
│  │  Lob          1  0 │  │  Saque        0  1 │      │
│  │  Smash        2  1 │  │  ─────────────────  │      │
│  │  Drop         1  0 │  │  TOTAL        2  8 │      │
│  │  Ace          1  0 │  │                    │      │
│  │  ──────────── ─  ─ │  │  FORÇOU ERRO  A  B │      │
│  │  TOTAL       10  5 │  │               9  5 │      │
│  └────────────────────┘  └────────────────────┘      │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │                VOLTAR AO SCOUT               │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Comportamento — Desktop (≥ 1200px)

```
┌──────────────────────────────────────────────────────────────────┐
│  [←]  Estatísticas da Partida                        [⚙]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ANA/BIA  ×  CRIS/DANI          [ Partida ] [ Set 1 ] [ Set 2 ] │
│  Set 1: 6-4 · Set 2: 2-6 · 40:30 (em andamento)                 │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  TOTAIS         │  │  SAQUE          │  │  FORÇOU ERRO    │  │
│  │  Pts A: 21      │  │  1º% A:68/B:71  │  │  A: 9 · B: 5   │  │
│  │  Pts B: 18      │  │  2º% A:80/B:75  │  │                 │  │
│  │  Win A:10/B:5   │  │  Aces A:1/B:0   │  │                 │  │
│  │  Err A:2 /B:8   │  │  DFlt A:0/B:1   │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐  │
│  │  WINNERS               A  B │  │  ERROS NÃO-FORÇADOS A  B │  │
│  │  Winner Direita        3  1 │  │  Erro Direita       1  3 │  │
│  │  Winner Esquerda       1  2 │  │  Erro Esquerda      1  2 │  │
│  │  Winner Paralelo       1  0 │  │  Erro Lob           0  1 │  │
│  │  Winner Cruzado        0  1 │  │  Erro Smash         0  1 │  │
│  │  Lob                   1  0 │  │  Erro Saque         0  1 │  │
│  │  Smash                 2  1 │  │  ─────────────────────    │  │
│  │  Drop Shot             1  0 │  │  TOTAL              2  8 │  │
│  │  Ace                   1  0 │  └──────────────────────────┘  │
│  │  ──────────────────────────  │                                │
│  │  TOTAL                10  5 │                                │
│  └──────────────────────────────┘                                │
│                                                                  │
│         ┌──────────────────────────────────────────┐            │
│         │              VOLTAR AO SCOUT              │            │
│         └──────────────────────────────────────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Seletor de Escopo (Tabs)

```
[ Partida ] [ Set 1 ] [ Set 2 ] [ Set 3 ]
  ────────
  (aba ativa com sublinhado azul)
```

- Exibe apenas as abas dos sets já jogados mais "Partida" (total)
- "Partida" agrega todos os PointEvents; "Set N" filtra por `setId`
- Aba ativa por padrão: "Partida"

---

## Regras de Publicidade

- **Durante partida ativa:** nenhuma publicidade — o usuário pode voltar ao scout a qualquer momento e distração compromete a continuidade.
- **Partida encerrada:** `AD-03` (320×50 mobile / 728×90 desktop) exibido no topo da tela, acima do placar final. Não obstrui estatísticas.
- Banner `AD-03` nunca aparece sobreposto aos botões de ação pós-jogo.

---

## Fluxo de Navegação

```
Estatísticas (partida ativa)
 ├── [←]                        → Scout (/match/[id]/scout)
 └── [VOLTAR AO SCOUT]          → Scout (/match/[id]/scout)

Estatísticas (partida encerrada)
 ├── [←]                        → Home (/)
 ├── [COMPARTILHAR]             → share dialog nativo
 ├── [NOVA PARTIDA]             → /match/new
 └── [VOLTAR AO HOME]           → /
```

---

## Labels por Modalidade

| Modalidade | Header das colunas A/B | Cabeçalho do placar |
|---|---|---|
| Duplas | "DUPLA A" / "DUPLA B" | "ANA / BIA × CRIS / DANI" |
| Simples | Nome do jogador: "ANA" / "CARLOS" | "ANA × CARLOS" |

- Nas tabelas de winners e erros, a coluna `A` e `B` mantém apenas a inicial — o header acima identifica quem é quem.
- Estatísticas de duplas somam os pontos dos dois jogadores da equipe; em simples não há agregação (já é um jogador por lado).

---

## Notas de Implementação (Next.js)

- Rota: `app/match/[id]/stats/page.tsx`
- Dados calculados via `Statistics.calculate(pointEvents, scopeFilter)` do `packages/domain`
- A mesma rota serve para partida ativa e partida encerrada — o status `match.status` determina qual variante renderizar
- Tabs de escopo: estado local com `useState`, sem troca de rota
- Compartilhar: `navigator.share()` com fallback para copiar texto ao clipboard
- Sem SSR para esta rota — dados vêm do IndexedDB, sempre client-side
- Tabelas de winners e erros devem usar `font-variant-numeric: tabular-nums` para alinhamento correto dos números

---

*Relacionado: [[03-Scout]] · [[05-Resumo]]*
