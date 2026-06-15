# Wireframe — Scout / Registro de Pontos

> **Tela:** Scout
> **Rota Next.js:** `/match/[id]/scout`
> **Prioridade:** CRÍTICA — tela mais importante do sistema
> **Publicidade:** NENHUMA — área de trabalho protegida

---

## Objetivo

Registrar cada ponto da partida com exatamente 2 toques, com feedback imediato (≤ 100ms), enquanto o usuário mantém atenção na quadra. Deve funcionar com uma mão, ao sol, sem scroll obrigatório.

Esta é a única tela do sistema onde **zero elementos de publicidade são permitidos**, em qualquer formato, posição ou tamanho.

---

## Regra de Não Interferência — Publicidade

```
╔══════════════════════════════════════════════════════════════╗
║  ZONA PROTEGIDA — NENHUM ANÚNCIO PERMITIDO                  ║
║                                                              ║
║  • Sem banners em qualquer posição                           ║
║  • Sem intersticiais entre pontos                            ║
║  • Sem pop-ups de qualquer tipo                              ║
║  • Sem elementos flutuantes externos                         ║
║  • Sem notificações de anúncios                              ║
║                                                              ║
║  Motivo: qualquer distração compromete o registro e          ║
║  compromete a qualidade dos dados — produto central do app.  ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Variantes por Modalidade

O Passo 1 (seleção do jogador) é o único elemento que muda estruturalmente entre simples e duplas. Todo o restante da tela — placar, Passo 2, undo, menu — é idêntico nas duas modalidades.

| Aspecto | Simples | Duplas |
|---|---|---|
| Botões no Passo 1 | 2 (um por lado) | 4 (dois por lado) |
| Tamanho dos botões de jogador | Maiores — 96px altura | Menores — 64px altura |
| Cor Lado A | Azul `#1565C0` | Azul `#1565C0` |
| Cor Lado B | Vermelho `#C62828` | Vermelho `#C62828` |
| Indicador de saque no header | `● Saque: Ana` | `● Saque: Ana / Bia` |
| Histórico de pontos | `Ana — Winner Dir` | `Ana — Winner Dir` |
| Atalhos de teclado (Passo 1) | `1` = Jogador A · `2` = Jogador B | `1` A1 · `2` A2 · `3` B1 · `4` B2 |
| Estatísticas | Por jogador individual | Por jogador individual + por dupla |

---

## Fluxo de Estado — 1 Ponto Registrado

```
┌─────────────────────────────────────────────────┐
│  ESTADO 0 — Aguardando                          │
│  Simples: placar + "Quem fez o ponto?" + 2 btn  │
│  Duplas:  placar + "Quem fez o ponto?" + 4 btn  │
└───────────────────┬─────────────────────────────┘
                    │ Toque 1: jogador selecionado
                    │ → vibração 50ms
                    │ → botão do jogador: highlight
                    ▼
┌─────────────────────────────────────────────────┐
│  ESTADO 1 — Jogador selecionado                 │
│  Exibe: jogador destacado + "Como foi?" +        │
│  grid de 14 tipos de ponto ativos               │
└───────────────────┬─────────────────────────────┘
                    │ Toque 2: tipo de ponto
                    │ → vibração 150ms + som
                    │ → ponto salvo no IndexedDB
                    │ → placar atualizado com animação
                    ▼
┌─────────────────────────────────────────────────┐
│  ESTADO 0 — Aguardando (próximo ponto)          │
│  Cooldown de 600ms antes de aceitar novo toque  │
└─────────────────────────────────────────────────┘
```

**Fluxos alternativos:**

```
ESTADO 0  →  [↩ Undo]  →  Modal de confirmação
                           │ [Confirmar]  → remove último PointEvent
                           │              → placar restaurado
                           │              → ESTADO 0
                           │ [Cancelar]   → ESTADO 0

ESTADO 1  →  [↩ Undo / Cancelar]  →  ESTADO 0 (deseleciona jogador)

ESTADO qualquer  →  [⋮ Menu]  →  Opções: Encerrar Partida / Configurações
```

---

## Comportamento — Mobile (< 768px)

### Variante Duplas — Estado 0 (aguardando)

```
┌─────────────────────────────────────────┐  ← 390px viewport
│                                         │
│  Set 1 · Game 4      40 : 30    [↩]   │  ← header fixo 56px
│  ● Saque: Ana / Bia              [⋮]   │    [↩] = undo, [⋮] = menu
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         QUEM FEZ O PONTO?              │  ← label 13px, cinza claro
│                                         │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │       ANA        │  │     BIA     │ │  ← Dupla A, bg #1565C0
│  └──────────────────┘  └─────────────┘ │    altura: 64px, fonte: 16px bold
│                                         │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │       CRIS       │  │    DANI     │ │  ← Dupla B, bg #C62828
│  └──────────────────┘  └─────────────┘ │    altura: 64px
│                                         │
├─────────────────────────────────────────┤
│           COMO FOI?                     │  ← desativado (30% opacidade)
│  ┌──────────────────┐  ┌─────────────┐ │     até Passo 1 ser concluído
│  │  Winner Direita  │  │ Winner Esq  │ │
│  └──────────────────┘  └─────────────┘ │  ← bg #2E7D32, 30% opacidade
│  ┌──────────────────┐  ┌─────────────┐ │    altura: 52px
│  │  Winner Paralelo │  │ Winner Cruz │ │
│  └──────────────────┘  └─────────────┘ │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │       Lob        │  │    Smash    │ │
│  └──────────────────┘  └─────────────┘ │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │    Drop Shot     │  │     Ace     │ │  ← Drop: #00838F · Ace: #6A1B9A
│  └──────────────────┘  └─────────────┘ │
│  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  │  ← divisor winners / erros
│  ┌──────────────────┐  ┌─────────────┐ │
│  │  Erro Direita    │  │  Erro Esq   │ │  ← bg #E65100, 30% opacidade
│  └──────────────────┘  └─────────────┘ │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │    Erro Lob      │  │  Erro Smash │ │
│  └──────────────────┘  └─────────────┘ │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │   Erro Saque     │  │ Forçou Erro │ │  ← Forçou: #F57F17
│  └──────────────────┘  └─────────────┘ │
│  [espaço safe area ~34px]               │
└─────────────────────────────────────────┘
```

### Variante Simples — Estado 0 (aguardando)

Em simples, há apenas 1 jogador por lado. Os botões são maiores pois ocupam o dobro do espaço vertical.

```
┌─────────────────────────────────────────┐
│  Set 1 · Game 4      40 : 30    [↩]   │  ← header fixo 56px
│  ● Saque: Ana                    [⋮]   │    saque: apenas 1 nome
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         QUEM FEZ O PONTO?              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │             ANA                 │   │  ← Jogador A, bg #1565C0
│  │                                 │   │    altura: 96px (maior que duplas)
│  └─────────────────────────────────┘   │    fonte: 20px bold
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │            CARLOS               │   │  ← Jogador B, bg #C62828
│  │                                 │   │    altura: 96px
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│           COMO FOI?                     │  ← mesmo grid de 14 tipos
│  ┌──────────────────┐  ┌─────────────┐ │     idêntico ao de duplas
│  │  Winner Direita  │  │ Winner Esq  │ │
│  └──────────────────┘  └─────────────┘ │
│  ... (restante igual) ...               │
│  [espaço safe area ~34px]               │
└─────────────────────────────────────────┘
```

> **Diferença visual chave:** em simples, os 2 botões de jogador são grandes e empilhados verticalmente, cada um com 96px de altura. Em duplas, os 4 botões formam um grid 2×2 com 64px cada. O restante da tela (Passo 2, header) é idêntico.

### Duplas — Estado 1 (após selecionar "ANA")

```
┌─────────────────────────────────────────┐
│  Set 1 · Game 4      40 : 30    [↩]   │
│  ● Saque: Ana / Bia              [⋮]   │
├─────────────────────────────────────────┤
│         QUEM FEZ O PONTO?              │
│                                         │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │ ✓     ANA        │  │     BIA     │ │  ← Ana: borda #FFF 2px + highlight
│  │                  │  │  (dim 50%)  │ │     Bia: 50% opacidade
│  └──────────────────┘  └─────────────┘ │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │       CRIS       │  │    DANI     │ │  ← Dupla B: 50% opacidade
│  │   (dim 50%)      │  │  (dim 50%)  │ │
│  └──────────────────┘  └─────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│           COMO FOI?                     │  ← ativado (100% opacidade)
│  ┌──────────────────┐  ┌─────────────┐ │
│  │  Winner Direita  │  │ Winner Esq  │ │
│  └──────────────────┘  └─────────────┘ │
│  ... (14 tipos, todos ativos) ...       │
└─────────────────────────────────────────┘
```

### Simples — Estado 1 (após selecionar "ANA")

```
┌─────────────────────────────────────────┐
│  Set 1 · Game 4      40 : 30    [↩]   │
│  ● Saque: Ana                    [⋮]   │
├─────────────────────────────────────────┤
│         QUEM FEZ O PONTO?              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✓           ANA                 │   │  ← borda branca 2px + highlight
│  │         (selecionado)           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │            CARLOS               │   │  ← 50% opacidade
│  │          (dim 50%)              │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│           COMO FOI?                     │  ← ativado
│  ... (14 tipos, todos ativos) ...       │
└─────────────────────────────────────────┘
```

---

## Comportamento — Tablet (768px–1199px)

Layout em 2 colunas: painel esquerdo fixo com placar e stats, painel direito com o registro.

### Tablet — Duplas

```
┌──────────────────────┬──────────────────────────────┐
│                      │                              │
│  ┌────────────────┐  │  QUEM FEZ O PONTO?           │
│  │ ANA / BIA      │  │                              │
│  │    40  :  30   │  │  ┌──────────┐  ┌──────────┐ │
│  │ Set 1 · Game 4 │  │  │   ANA    │  │   BIA    │ │  ← Dupla A, grid 2×2
│  │ ● Saque: A/B   │  │  └──────────┘  └──────────┘ │
│  └────────────────┘  │  ┌──────────┐  ┌──────────┐ │
│                      │  │   CRIS   │  │   DANI   │ │  ← Dupla B
│  ÚLTIMOS PONTOS      │  └──────────┘  └──────────┘ │
│  ┌────────────────┐  │                              │
│  │ Ana  Win Dir   │  │  COMO FOI?                   │
│  │ Bia  Ace       │  │  ┌──────────┐  ┌──────────┐ │
│  │ Cris Err Esq   │  │  │ Win Dir  │  │ Win Esq  │ │
│  │ Dani Drop      │  │  └──────────┘  └──────────┘ │
│  └────────────────┘  │  ┌──────────┐  ┌──────────┐ │
│                      │  │ Win Par  │  │ Win Cruz │ │
│  STATS AO VIVO       │  └──────────┘  └──────────┘ │
│  ┌────────────────┐  │  ┌──────────┐  ┌──────────┐ │
│  │ Winners A: 5   │  │  │   Lob    │  │  Smash   │ │
│  │ Winners B: 3   │  │  └──────────┘  └──────────┘ │
│  │ Erros   A: 2   │  │  ┌──────────┐  ┌──────────┐ │
│  │ Erros   B: 4   │  │  │ Drop     │  │   Ace    │ │
│  │ Aces    A: 1   │  │  └──────────┘  └──────────┘ │
│  └────────────────┘  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                      │  ┌──────────┐  ┌──────────┐ │
│  [↩ Desfazer]        │  │ Err Dir  │  │ Err Esq  │ │
│  [⋮ Menu]            │  └──────────┘  └──────────┘ │
│                      │  ┌──────────┐  ┌──────────┐ │
│                      │  │ Err Lob  │  │ Err Sma  │ │
│                      │  └──────────┘  └──────────┘ │
│                      │  ┌──────────┐  ┌──────────┐ │
│                      │  │ Err Saq  │  │ Forçou   │ │
│                      │  └──────────┘  └──────────┘ │
│  ← col: 35%          │  ← col: 65%                  │
└──────────────────────┴──────────────────────────────┘
   ↑ Sem publicidade em nenhuma das colunas
```

### Tablet — Simples

Em simples, os 2 botões de jogador ficam lado a lado (cada um ~50% da largura da coluna direita), com altura maior.

```
┌──────────────────────┬──────────────────────────────┐
│                      │                              │
│  ┌────────────────┐  │  QUEM FEZ O PONTO?           │
│  │ ANA × CARLOS   │  │                              │
│  │    40  :  30   │  │  ┌──────────────────────┐   │
│  │ Set 1 · Game 4 │  │  │         ANA          │   │  ← largura total da coluna
│  │ ● Saque: Ana   │  │  │                      │   │    altura: 80px
│  └────────────────┘  │  └──────────────────────┘   │
│                      │  ┌──────────────────────┐   │
│  ÚLTIMOS PONTOS      │  │       CARLOS         │   │  ← Jogador B, vermelho
│  ┌────────────────┐  │  │                      │   │    altura: 80px
│  │ Ana   Win Dir  │  │  └──────────────────────┘   │
│  │ Carlos Err Esq │  │                              │
│  │ Ana   Lob      │  │  COMO FOI?                   │
│  └────────────────┘  │  ┌──────────┐  ┌──────────┐ │
│                      │  │ Win Dir  │  │ Win Esq  │ │  ← mesmo grid de duplas
│  STATS AO VIVO       │  └──────────┘  └──────────┘ │
│  ┌────────────────┐  │  ... (restante idêntico) ... │
│  │ Winners A: 5   │  │                              │
│  │ Winners B: 3   │  │                              │
│  └────────────────┘  │                              │
│  [↩ Desfazer]        │                              │
│  [⋮ Menu]            │                              │
│  ← col: 35%          │  ← col: 65%                  │
└──────────────────────┴──────────────────────────────┘
```

---

## Comportamento — Desktop (≥ 1200px)

Layout em 3 colunas: histórico | registro | estatísticas.

### Desktop — Duplas

```
┌──────────────────┬────────────────────────┬──────────────────┐
│                  │                        │                  │
│  HISTÓRICO       │   Set 1 · Game 4       │  ESTATÍSTICAS    │
│  DA PARTIDA      │   ANA/BIA  ×  CRI/DAN │                  │
│                  │   40       :  30       │  DUPLA A         │
│  Set 1 — Game 4  │   ● Saque: Ana / Bia  │  Winners: 5      │
│  ──────────────  │            [↩]  [⋮]   │   Dir: 2         │
│  1. Ana  Win D   │                        │   Esq: 1         │
│  2. Bia  Ace     │  QUEM FEZ O PONTO?     │   Par: 1         │
│  3. Cris Err E   │                        │   Ace: 1         │
│  4. Dani Drop    │  ┌────────┐  ┌───────┐ │  Erros: 2        │
│  5. Ana  Win P   │  │  ANA   │  │  BIA  │ │   Dir: 1         │
│  6. Cris Saque   │  └────────┘  └───────┘ │   Esq: 1         │
│  7. Bia  Err D   │  ┌────────┐  ┌───────┐ │                  │
│  8. Ana  Win D   │  │  CRIS  │  │ DANI  │ │  DUPLA B         │
│                  │  └────────┘  └───────┘ │  Winners: 3      │
│  (scroll)        │                        │  Erros: 4        │
│                  │  COMO FOI?             │                  │
│                  │                        │  PLACAR SETS     │
│                  │  ┌────────┐  ┌───────┐ │  Set 1: A/B      │
│                  │  │Win Dir │  │Win Esq│ │  Games: 3-2      │
│                  │  └────────┘  └───────┘ │  Ponto: 40-30    │
│                  │  ┌────────┐  ┌───────┐ │                  │
│                  │  │Win Par │  │Win Cru│ │                  │
│                  │  └────────┘  └───────┘ │  ← sem publicidade
│                  │  ┌────────┐  ┌───────┐ │     nesta coluna
│                  │  │  Lob   │  │ Smash │ │
│                  │  └────────┘  └───────┘ │
│                  │  ┌────────┐  ┌───────┐ │
│                  │  │  Drop  │  │  Ace  │ │
│                  │  └────────┘  └───────┘ │
│                  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                  │  ┌────────┐  ┌───────┐ │
│                  │  │Err Dir │  │Err Esq│ │
│                  │  └────────┘  └───────┘ │
│                  │  ┌────────┐  ┌───────┐ │
│                  │  │Err Lob │  │Err Sma│ │
│                  │  └────────┘  └───────┘ │
│                  │  ┌────────┐  ┌───────┐ │
│                  │  │Err Saq │  │Forçou │ │
│                  │  └────────┘  └───────┘ │
│  ← col: 22%      │  ← col: 50%            │  ← col: 28%      │
└──────────────────┴────────────────────────┴──────────────────┘
   ↑ NENHUMA DAS 3 COLUNAS contém publicidade
```

### Desktop — Simples

Em simples os 2 botões do Passo 1 ficam lado a lado com largura total da coluna central, mais altos que na versão duplas.

```
┌──────────────────┬────────────────────────┬──────────────────┐
│                  │                        │                  │
│  HISTÓRICO       │   Set 1 · Game 4       │  ESTATÍSTICAS    │
│  DA PARTIDA      │   ANA  ×  CARLOS       │                  │
│                  │   40    :  30          │  ANA             │
│  Set 1 — Game 4  │   ● Saque: Ana         │  Winners: 5      │
│  ──────────────  │            [↩]  [⋮]   │  Erros: 2        │
│  1. Ana   Win D  │                        │                  │
│  2. Carlos Err E │  QUEM FEZ O PONTO?     │  CARLOS          │
│  3. Ana   Lob    │                        │  Winners: 3      │
│                  │  ┌───────────────────┐ │  Erros: 4        │
│  (scroll)        │  │        ANA        │ │                  │
│                  │  └───────────────────┘ │  PLACAR SETS     │
│                  │  ┌───────────────────┐ │  Set 1: A/B      │
│                  │  │      CARLOS       │ │  Games: 3-2      │
│                  │  └───────────────────┘ │  Ponto: 40-30    │
│                  │   (botões: largura     │                  │
│                  │    total, 72px altura) │                  │
│                  │                        │  ← sem publicidade
│                  │  COMO FOI?             │                  │
│                  │  ┌────────┐  ┌───────┐ │
│                  │  │Win Dir │  │Win Esq│ │  ← mesmo grid
│                  │  └────────┘  └───────┘ │     de duplas
│                  │  ... (idêntico) ...    │
│  ← col: 22%      │  ← col: 50%            │  ← col: 28%      │
└──────────────────┴────────────────────────┴──────────────────┘
   ↑ NENHUMA DAS 3 COLUNAS contém publicidade
```

---

## Componentes Detalhados

### Header da Tela de Scout

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│  Set 1 · Game 4 · 40 : 30                  [↩]  [⋮] │
│  ● Saque: Ana / Bia                                   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

| Elemento | Especificação |
|---|---|
| Altura total do header | 56px mobile / 64px tablet+desktop |
| Fonte do placar | 18px bold, branco, `font-variant-numeric: tabular-nums` |
| Fonte do saque | 13px, cinza claro (#9E9E9E) |
| Background | #121212 (fundo escuro para contraste ao sol) |
| `[↩]` Undo | 44×44px touch target, ícone 20px, cinza #757575 |
| `[⋮]` Menu | 44×44px touch target, ícone 20px, cinza #757575 |

### Botões de Jogador (Passo 1)

| Estado | Visual |
|---|---|
| Aguardando | Dupla A: bg #1565C0 opaco / Dupla B: bg #C62828 opaco |
| Hover (desktop) | Brilho 10% |
| Selecionado | Borda branca 2px + brilho + checkmark no canto |
| Outros (após seleção) | Opacidade 50%, não-interativos |
| Desativado (cooldown) | Opacidade 30%, cursor not-allowed |

```
Mobile — Estado aguardando:
┌────────────────────────────────────┐
│          ANA                       │  altura: 64px
│                                    │  font: 18px bold
└────────────────────────────────────┘  bg: #1565C0
                                        border-radius: 8px

Mobile — Estado selecionado:
┌────────────────────────────────────┐
│  ✓       ANA                       │  borda: 2px solid #FFFFFF
│                                    │  bg: #1E88E5 (mais claro)
└────────────────────────────────────┘
```

### Botões de Tipo de Ponto (Passo 2)

| Categoria | Cor de fundo | Exemplos |
|---|---|---|
| Winners | `#2E7D32` verde escuro | Win Direita, Win Esq, Win Par, Win Cruz, Lob, Smash |
| Drop Shot | `#00838F` ciano | Drop Shot |
| Ace | `#6A1B9A` roxo | Ace |
| Erros | `#E65100` laranja | Erro Dir, Erro Esq, Erro Lob, Erro Smash, Erro Saque |
| Forçou Erro | `#F57F17` amarelo escuro | Forçou Erro |

```
Mobile — Botão tipo (Estado 0, inativo):
┌──────────────────┐
│  Winner Direita  │  altura: 52px
│                  │  font: 13px bold
└──────────────────┘  bg: #2E7D32 com opacidade 30%
                      (inativo até Passo 1 ser concluído)

Mobile — Botão tipo (Estado 1, ativo):
┌──────────────────┐
│  Winner Direita  │  bg: #2E7D32 opaco
│                  │  border-radius: 8px
└──────────────────┘  shadow: 0 2px 4px rgba(0,0,0,0.4)
```

### Grid de Tipos de Ponto — Ordem dos Botões

```
Linha 1: [ Winner Direita  ] [ Winner Esquerda ]
Linha 2: [ Winner Paralelo ] [ Winner Cruzado  ]
Linha 3: [ Lob             ] [ Smash            ]
Linha 4: [ Drop Shot       ] [ Ace              ]
─────────────────────────────────────────────────  ← divisor visual
Linha 5: [ Erro Direita    ] [ Erro Esquerda   ]
Linha 6: [ Erro Lob        ] [ Erro Smash      ]
Linha 7: [ Erro Saque      ] [ Forçou Erro     ]
```

**Lógica do divisor:** separa visualmente "ações que geraram o ponto" (winners) de "erros que cederam o ponto". Ajuda na leitura rápida, especialmente sob sol.

### Modal de Undo

```
┌──────────────────────────────────────────┐
│                                          │
│   Desfazer último ponto?                 │
│                                          │
│   Ana — Winner Direita                   │
│   40:30 → 30:30                          │
│                                          │
│   ┌──────────────────────────────────┐  │
│   │         DESFAZER                 │  │  ← bg #E65100
│   └──────────────────────────────────┘  │
│                                          │
│             [ Cancelar ]                 │  ← link, cinza
│                                          │
└──────────────────────────────────────────┘
   ↑ overlay escuro 60% atrás
   ↑ sem publicidade no modal
```

### Tela de Intervalo entre Sets

Exibida automaticamente pelo ScoringEngine quando um set é encerrado.

```
┌─────────────────────────────────────────┐
│                                         │
│         FIM DO SET 1                    │  ← título grande
│                                         │
│   ┌──────────────────────────────────┐  │
│   │  ANA / BIA     6  ×  4  CRI/DAN │  │  ← placar do set
│   └──────────────────────────────────┘  │
│                                         │
│   ✓  ANA / BIA vence o Set 1           │
│                                         │
│   Próximo set: saque de CRIS / DANI     │
│   ↔  Troque de lado                    │
│                                         │
│  ╔═════════════════════════════════╗    │
│  ║  AD-02 · Banner 300×250        ║    │  ← ÚNICO momento de anúncio
│  ╚═════════════════════════════════╝    │    dentro do fluxo da partida
│                                         │
│   ┌──────────────────────────────────┐  │
│   │       INICIAR SET 2             │  │  ← CTA, verde
│   └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Menu de Contexto `[⋮]`

```
┌──────────────────────────────────┐
│  ⋮ Opções da Partida             │
│  ────────────────────────────    │
│  📊  Ver Estatísticas            │  → /match/[id]/stats
│  ✏   Editar Configuração         │  (desativado após 1º ponto)
│  ⚡  Encerrar Partida Agora      │  → confirmar → /match/[id]/stats
│  ✕   Cancelar                    │
└──────────────────────────────────┘
```

---

## Atalhos de Teclado (Desktop)

| Tecla | Ação | Fase |
|---|---|---|
| `1` | Seleciona Jogador A1 | Passo 1 |
| `2` | Seleciona Jogador A2 | Passo 1 |
| `3` | Seleciona Jogador B1 | Passo 1 |
| `4` | Seleciona Jogador B2 | Passo 1 |
| `Q` | Winner Direita | Passo 2 |
| `W` | Winner Esquerda | Passo 2 |
| `E` | Winner Paralelo | Passo 2 |
| `R` | Winner Cruzado | Passo 2 |
| `A` | Lob | Passo 2 |
| `S` | Smash | Passo 2 |
| `D` | Drop Shot | Passo 2 |
| `F` | Ace | Passo 2 |
| `Z` | Erro Direita | Passo 2 |
| `X` | Erro Esquerda | Passo 2 |
| `C` | Erro Lob | Passo 2 |
| `V` | Erro Smash | Passo 2 |
| `B` | Erro Saque | Passo 2 |
| `N` | Forçou Erro | Passo 2 |
| `Ctrl+Z` | Undo | Qualquer |
| `Esc` | Cancelar seleção (volta ao Estado 0) | Passo 1 |

---

## Especificações de Design para Sol Forte

| Propriedade | Valor | Motivo |
|---|---|---|
| Background geral | `#121212` | Fundo escuro reduz reflexo de tela |
| Texto principal | `#FFFFFF` | Máximo contraste |
| Texto secundário | `#BDBDBD` | Legível sem competir com ações |
| Botões de jogador (A) | `#1565C0` com texto branco | Azul escuro legível ao sol |
| Botões de jogador (B) | `#C62828` com texto branco | Vermelho escuro legível ao sol |
| Botões winners | `#2E7D32` com texto branco | Verde escuro |
| Botões erros | `#E65100` com texto branco | Laranja escuro |
| Font size mínimo botões | 13px bold | Legível com tela a ~50cm |
| Touch target mínimo | 44×44px | Recomendação WCAG / Apple HIG |
| Border radius | 8px | Feedback visual de área clicável |
| Sombra nos botões | `0 2px 8px rgba(0,0,0,0.5)` | Separação visual no tema escuro |

---

## Feedback Multicanal

| Evento | Visual | Vibração | Som |
|---|---|---|---|
| Toque 1 (jogador) | Botão destaca, outros dim | 50ms | — |
| Toque 2 (tipo) | Flash de cor na borda da tela | 150ms | bola.mp3 |
| Ponto salvo | Placar anima (slide up) | — | — |
| Undo executado | Placar reverte (slide down) | 80ms | — |
| Fim de set | Tela de intervalo abre | 200ms | set-point.mp3 |
| Fim de partida | Confetti + tela de resumo | 300ms | match-point.mp3 |

---

## Proteção contra Toque Acidental

- Cooldown de **600ms** após cada ponto registrado — toques nesse período são ignorados
- O Passo 2 só é renderizado e interativo após o Passo 1 ser completado
- Botão `[⋮]` requer confirmação para ações destrutivas (encerrar partida)
- Botão `[←]` do browser/sistema é interceptado e exibe modal de confirmação antes de sair

---

## Fluxo de Navegação

```
Scout
 │
 ├── [↩ Undo]               → Modal de confirmação → permanece na tela
 ├── [⋮ > Ver Estatísticas] → /match/[id]/stats (volta aqui)
 ├── [Fim de Set automático] → Tela de Intervalo → volta ao Scout
 └── [Fim de Partida]        → /match/[id]/stats (modo resumo final)
```

---

## Notas de Implementação (Next.js)

- Rota: `app/match/[id]/scout/page.tsx`
- Estado da partida: gerenciado via Zustand store `useMatchStore`
- Cada ponto: `ScoringEngine.applyPoint(state, event)` → novo estado → persist IndexedDB → atualiza store
- Feedback de vibração: `navigator.vibrate([50])` e `navigator.vibrate([150])`
- Feedback sonoro: `<audio>` pré-carregado no mount do componente
- Animação do placar: CSS transition `transform: translateY` com `useTransition`
- `router.back()` e botão físico Android: interceptar com `beforeunload` / `popstate`
- Cooldown: `useRef` para timestamp do último ponto, checado antes de processar toque
- A tela deve ser exibida em **modo landscape** no tablet quando a resolução permitir (media query)
- **Nenhum componente de publicidade deve ser importado ou renderizado nesta página**
- Service worker deve cachear esta rota para funcionamento offline completo

---

*Relacionado: [[02-Nova-Partida]] · [[04-Estatisticas]] · [[05-Resumo]]*
