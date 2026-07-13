# Wireframe — Estatísticas em Tempo Real

> **Tela/Componente:** Estatísticas
> **Durante a partida:** overlay (`StatsDrawer`) sobre o Scout — painel lateral em telas ≥768px, modal/bottom-sheet em <768px. **Não é uma navegação de rota.**
> **Partida encerrada:** página própria de Resumo — rota `/partida/[id]/resumo`
> **Prioridade:** Alta — acessível a 1 toque a qualquer momento durante o registro
> **Publicidade:** Nenhuma, em nenhum dos dois estados (ver [[02-Monetizacao]])

---

## Objetivo

Exibir as estatísticas acumuladas da partida em andamento ou encerrada, calculadas exclusivamente a partir dos `PointEvent`s registrados (`calculateStats`, `packages/domain`) — nenhum dado é gravado manualmente aqui.

**Durante a partida:** o botão `[📊 Estatísticas]`, sempre visível no header do Scout (ver [[03-Scout]]), abre o mesmo conteúdo como um painel sobreposto (`StatsDrawer`), sem navegar para outra rota. Fechar o painel (✕, tecla `Esc` ou toque fora) retorna exatamente ao estado do Scout em que o usuário estava — inclusive se um jogador já havia sido selecionado no Passo 1 do registro, aguardando o Passo 2.

**Quando a partida é encerrada:** o mesmo conteúdo (componente `MatchStats`) é reaproveitado na página de Resumo (`/partida/[id]/resumo`), acrescido do placar final e dos botões de ação pós-jogo.

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
| Botão fechar `[✕]` (overlay) | CTA | Apenas partida ativa — fecha o painel/modal sem navegar |
| Botões pós-jogo (Compartilhar / Nova Partida) | CTAs | Apenas partida encerrada |

---

## Comportamento — Mobile (< 768px)

**Partida ativa (overlay/modal sobre o Scout, não é uma tela própria):**

```
┌─────────────────────────────────────────┐
│  Estatísticas                    [✕]   │  ← header do modal, 56px
│  (Scout permanece por trás, intacto)   │
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
│  [espaço safe area]                     │
└─────────────────────────────────────────┘
```

> Não há botão "Voltar ao Scout": o modal é um overlay, então tocar `[✕]`, fora do modal ou `Esc` simplesmente o fecha — o Scout já está por trás, no exato estado em que estava.

**Quando a partida é encerrada — página própria de Resumo (`/partida/[id]/resumo`), não overlay:**

```
┌─────────────────────────────────────────┐
│  [←]  Resumo Final                     │  ← título muda
├─────────────────────────────────────────┤
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

> Conteúdo do painel `StatsDrawer` durante partida ativa (`[←]` abaixo = fechar o painel, não navegação) ou da página de Resumo quando a partida está encerrada.

```
┌──────────────────────────────────────────────────────┐
│  [←]  Estatísticas                                   │
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
│  │              FECHAR ESTATÍSTICAS             │   │  ← só existe durante
│  └──────────────────────────────────────────────┘   │    partida ativa (overlay)
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Comportamento — Desktop (≥ 1200px)

> Em telas ≥768px o `StatsDrawer` é um **painel lateral fixo** (não centralizado/modal) — o conteúdo abaixo representa esse painel.

```
┌──────────────────────────────────────────────────────────────────┐
│  [✕]  Estatísticas da Partida                                    │
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
│         │           FECHAR ESTATÍSTICAS             │            │
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

## Publicidade

Nenhuma, nem durante a partida ativa (overlay) nem na página de Resumo pós-jogo — decisão de produto pós-primeiro-deploy (ver [[02-Monetizacao]]).

---

## Fluxo de Navegação

```
Estatísticas (partida ativa — overlay, sem navegação de rota)
 └── [✕] ou toque fora ou Esc   → fecha o painel, permanece no Scout exatamente como estava

Estatísticas (partida encerrada — página /partida/[id]/resumo)
 ├── [←]                        → Home (/)
 ├── [COMPARTILHAR]             → share dialog nativo
 ├── [NOVA PARTIDA]             → /partida/nova
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

- Componente compartilhado: `apps/web/src/components/MatchStats.tsx` — renderiza comparativo por dupla + cartões por jogador a partir de `calculateStats(match)` (`packages/domain`)
- Durante a partida: `MatchStats` é renderizado dentro de `StatsDrawer` (`apps/web/src/components/StatsDrawer.tsx`), aberto a partir do botão `[📊]` no header do Scout (`MatchScreen.tsx`) — controlado por estado local (`statsOpen`), sem rota própria
- `StatsDrawer` é responsivo via CSS (media query `min-width: 768px`): painel lateral fixo no desktop, modal/bottom-sheet no mobile — mesmo componente, sem branch de código por dispositivo
- Partida encerrada: rota `/partida/[id]/resumo/page.tsx` reaproveita o mesmo `MatchStats`
- Sem SSR — dados vêm do `localStorage` (`apps/web/src/lib/storage.ts`), sempre client-side
- Tabelas de winners e erros devem usar `font-variant-numeric: tabular-nums` para alinhamento correto dos números
- Tabs de escopo por set (Partida / Set 1 / Set 2 / ...) descritas nesta wireframe são candidatas para V2 — a implementação atual do MVP mostra apenas o total agregado da partida

---

*Relacionado: [[03-Scout]] · [[05-Resumo]]*
