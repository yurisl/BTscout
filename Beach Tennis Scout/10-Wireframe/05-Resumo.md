# Wireframe — Resumo da Partida

> **Tela:** Resumo Pós-Jogo
> **Rota Next.js:** `/match/[id]/stats` (variante encerrada) — mesma rota de Estatísticas
> **Prioridade:** Média-Alta — primeira impressão do valor gerado pelo app
> **Publicidade:** AD-03 (banner no topo ou rodapé, partida encerrada)

---

## Objetivo

Apresentar o resultado final da partida com placar completo, vencedor em destaque, e estatísticas que mostram o valor do produto. Esta tela é o "relatório" que justifica o uso do app — se o usuário sair desta tela com a sensação de que aprendeu algo sobre a partida, ele volta na próxima.

O Resumo é a variante encerrada da tela de Estatísticas. A rota é a mesma (`/match/[id]/stats`); o componente detecta `match.status === 'finished'` e renderiza esta versão.

---

## Componentes

| Componente | Tipo | Notas |
|---|---|---|
| Header com botão home | Fixo | Sem botão "voltar ao scout" |
| Banner AD-03 | Publicidade | Topo ou rodapé, visível nesta tela |
| Card de vencedor | Destaque visual | Fundo verde, nome grande |
| Placar final por set | Display | Séries de sets horizontais |
| Tabs de escopo | Tabs | Partida / Set 1 / Set 2 / ... |
| Card de totais | Cards | Pontos / Winners / Erros |
| Tabela de winners | Tabela | Por subtipo, A vs B |
| Tabela de erros | Tabela | Por subtipo, A vs B |
| Estatísticas de saque | Seção | % 1º/2º saque, aces, duplas |
| Botão Compartilhar | CTA secundário | `navigator.share()` |
| Botão Nova Partida | CTA primário | → /match/new |
| Botão Voltar ao Home | Link | → / |

---

## Comportamento — Mobile (< 768px)

```
┌─────────────────────────────────────────┐
│  [⌂]  Resumo da Partida                │  ← header 56px
│                                         │    ícone home, não "voltar"
├─────────────────────────────────────────┤
│                                         │
│  ╔═════════════════════════════════╗   │
│  ║  AD-03 · Banner 320×50        ║   │  ← publicidade topo
│  ╚═════════════════════════════════╝   │    (primeira aparição desde
│                                         │     que a partida começou)
│  ┌─────────────────────────────────┐   │
│  │  🏆  ANA / BIA VENCEU          │   │  ← card vencedor
│  │                                 │   │    bg: #2E7D32 (verde)
│  │      6  ·  7(5)                 │   │    fonte título: 20px bold
│  │      ×                          │   │    Sets vencidos
│  │      4  ·  6  ·  Super TB 7    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PLACAR DETALHADO                       │
│  ┌─────────────────────────────────┐   │
│  │         Set 1  Set 2  Super TB  │   │
│  │  A/B     6      7(5)    10      │   │
│  │  C/D     4      6        7      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [ Partida ] [ Set 1 ] [ Set 2 ] [STB] │  ← tabs de escopo
│  ──────────                             │
│                                         │
│  TOTAIS DA PARTIDA                      │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  DUPLA A     │  │  DUPLA B     │   │
│  │  37 pontos   │  │  29 pontos   │   │
│  │  18 winners  │  │  10 winners  │   │
│  │   4 erros    │  │  12 erros    │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  WINNERS                                │
│  ┌─────────────────────────────────┐   │
│  │                    A     B      │   │
│  │  Winner Direita    5     2      │   │
│  │  Winner Esquerda   3     3      │   │
│  │  Winner Paralelo   2     1      │   │
│  │  Winner Cruzado    1     1      │   │
│  │  Lob               2     1      │   │
│  │  Smash             3     1      │   │
│  │  Drop Shot         1     0      │   │
│  │  Ace               1     1      │   │
│  │  ─────────────── ───   ───      │   │
│  │  TOTAL            18    10      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ERROS NÃO-FORÇADOS                     │
│  ┌─────────────────────────────────┐   │
│  │                    A     B      │   │
│  │  Erro Direita      1     4      │   │
│  │  Erro Esquerda     1     3      │   │
│  │  Erro Lob          0     2      │   │
│  │  Erro Smash        1     1      │   │
│  │  Erro Saque        1     2      │   │
│  │  ─────────────── ───   ───      │   │
│  │  TOTAL             4    12      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FORÇOU ERRO DO ADVERSÁRIO              │
│  ┌─────────────────────────────────┐   │
│  │                    A     B      │   │
│  │  Forçou Erro      15     7      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  SAQUE                                  │
│  ┌─────────────────────────────────┐   │
│  │                    A     B      │   │
│  │  1º Saque entrou  68%   71%     │   │
│  │  Pontos no 1º Sq  72%   65%     │   │
│  │  2º Saque entrou  80%   75%     │   │
│  │  Pontos no 2º Sq  60%   55%     │   │
│  │  Aces              2     1      │   │
│  │  Duplas Faltas     0     2      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🔗  COMPARTILHAR               │   │  ← compartilhar texto/imagem
│  └─────────────────────────────────┘   │    bg: cinza escuro
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       ✚  NOVA PARTIDA           │   │  ← CTA primário, azul
│  └─────────────────────────────────┘   │
│                                         │
│             [Voltar ao Home]            │  ← link simples, cinza
│                                         │
│  [espaço safe area]                     │
└─────────────────────────────────────────┘
```

---

## Comportamento — Tablet (768px–1199px)

```
┌──────────────────────────────────────────────────────┐
│  [⌂]  Resumo da Partida                   [⚙]       │
├──────────────────────────────────────────────────────┤
│  ╔════════════════════════════════════════════════╗  │
│  ║   AD-03 · Banner 468×60                       ║  │
│  ╚════════════════════════════════════════════════╝  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  🏆  ANA / BIA VENCEU    6 · 7(5) × 4 · 6   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [ Partida ] [ Set 1 ] [ Set 2 ] [ Super TB ]        │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────┐      │
│  │  TOTAIS       A  B │  │  SAQUE        A  B │      │
│  │  Pontos      37 29 │  │  1º Saque%  68 71  │      │
│  │  Winners     18 10 │  │  Pts no 1º  72 65  │      │
│  │  Erros        4 12 │  │  2º Saque%  80 75  │      │
│  │  Forçou Erro 15  7 │  │  Aces        2  1  │      │
│  └────────────────────┘  │  Duplas Flt  0  2  │      │
│                           └────────────────────┘      │
│  ┌────────────────────┐  ┌────────────────────┐      │
│  │  WINNERS      A  B │  │  ERROS        A  B │      │
│  │  Direita      5  2 │  │  Direita      1  4 │      │
│  │  Esquerda     3  3 │  │  Esquerda     1  3 │      │
│  │  Paralelo     2  1 │  │  Lob          0  2 │      │
│  │  Cruzado      1  1 │  │  Smash        1  1 │      │
│  │  Lob          2  1 │  │  Saque        1  2 │      │
│  │  Smash        3  1 │  │  ─────────── ─  ─  │      │
│  │  Drop Shot    1  0 │  │  TOTAL        4 12 │      │
│  │  Ace          1  1 │  └────────────────────┘      │
│  │  ─────────── ─  ─  │                              │
│  │  TOTAL       18 10 │                              │
│  └────────────────────┘                              │
│                                                      │
│  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │  COMPARTILHAR   │  │     ✚  NOVA PARTIDA      │   │
│  └─────────────────┘  └─────────────────────────┘   │
│                                                      │
│                    [Voltar ao Home]                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Comportamento — Desktop (≥ 1200px)

```
┌──────────────────────────────────────────────────────────────────┐
│  [⌂]  Resumo da Partida                              [⚙]        │
├──────────────────────────────────────────────────────────────────┤
│  ╔════════════════════════════════════════════════════════════╗  │
│  ║   AD-03 · Banner 728×90                                   ║  │
│  ╚════════════════════════════════════════════════════════════╝  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🏆  ANA / BIA VENCEU                                   │   │
│  │  Set 1: 6-4 · Set 2: 7-6(5) · Super TB: 10-7            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [ Partida ] [ Set 1 ] [ Set 2 ] [ Super TB ]                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────┐  ┌──────────────┐   │
│  │  TOTAIS      │  │  WINNERS        A  B │  │  ERROS  A  B │   │
│  │  Pts A:  37  │  │  Direita        5  2 │  │  Dir    1  4 │   │
│  │  Pts B:  29  │  │  Esquerda       3  3 │  │  Esq    1  3 │   │
│  │  Win A:  18  │  │  Paralelo       2  1 │  │  Lob    0  2 │   │
│  │  Win B:  10  │  │  Cruzado        1  1 │  │  Smash  1  1 │   │
│  │  Err A:   4  │  │  Lob            2  1 │  │  Saque  1  2 │   │
│  │  Err B:  12  │  │  Smash          3  1 │  │  ─────  ─  ─ │   │
│  │  Forç A: 15  │  │  Drop Shot      1  0 │  │  Total  4 12 │   │
│  │  Forç B:  7  │  │  Ace            1  1 │  └──────────────┘   │
│  └──────────────┘  │  ──────────── ──  ── │                     │
│                    │  TOTAL         18 10 │  ┌──────────────┐   │
│  ┌──────────────┐  └──────────────────────┘  │  SAQUE  A  B │   │
│  │  FORÇOU ERRO │                            │  1º%  68 71  │   │
│  │  A: 15 · B:7 │                            │  Pts1 72 65  │   │
│  └──────────────┘                            │  2º%  80 75  │   │
│                                              │  Pts2 60 55  │   │
│                                              │  Aces  2  1  │   │
│                                              │  DFlt  0  2  │   │
│                                              └──────────────┘   │
│                                                                  │
│  ┌──────────────────┐      ┌──────────────────────────────────┐ │
│  │  🔗 COMPARTILHAR │      │          ✚  NOVA PARTIDA         │ │
│  └──────────────────┘      └──────────────────────────────────┘ │
│                                         [Voltar ao Home]        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Card de Vencedor

```
Mobile:
┌─────────────────────────────────────────┐
│  🏆  ANA / BIA VENCEU                  │  bg: #1B5E20 (verde escuro)
│                                         │  font título: 22px bold, branco
│  6  ·  7(5)                             │  Sets vencidos: grande
│  × 4  ·  6  ·  Super TB 7              │  Sets perdidos: menor, cinza
└─────────────────────────────────────────┘  border-radius: 12px
```

**Quando empate (não deve acontecer — mas por segurança):**
Exibir "PARTIDA ENCERRADA" sem vencedor destacado.

---

## Placar Detalhado por Sets

```
┌───────────────────────────────────────────┐
│               Set 1  Set 2  Super TB      │
│  ANA / BIA      6     7(5)    10          │  ← row A: bold
│  CRIS / DANI    4      6       7          │  ← row B: normal
└───────────────────────────────────────────┘
  Nota: 7(5) = venceu o set 7x6, tie-break por 7x5
```

---

## Funcionalidade de Compartilhamento

Ao tocar em "Compartilhar", gera um texto formatado via `navigator.share()`:

```
🏆 Beach Tennis Scout

ANA / BIA × CRIS / DANI
Set 1: 6-4 | Set 2: 7-6(5) | Super TB: 10-7

ESTATÍSTICAS
━━━━━━━━━━━━━━━━━━━━━━━
              A      B
Winners      18     10
Erros         4     12
1º Saque%    68%    71%
Aces          2      1

Registrado com Beach Tennis Scout
```

Fallback (sem `navigator.share()`): copia o texto para o clipboard e exibe toast "Copiado!".

---

## Regras de Publicidade

- `AD-03` aparece no topo da tela, imediatamente abaixo do header.
- O banner nunca aparece antes desta tela — é a primeira exposição a publicidade desde o início da partida.
- O banner não é `position: fixed` — rola com o conteúdo no mobile.
- No desktop, o banner fica fixo no topo após o header.
- Nunca obstrui o card de vencedor, o placar ou os botões de ação.

---

## Fluxo de Navegação

```
Resumo da Partida
 ├── [⌂ Home]            → / (home)
 ├── [COMPARTILHAR]      → share dialog nativo / clipboard
 ├── [NOVA PARTIDA]      → /match/new
 ├── [Voltar ao Home]    → /
 └── [Tab Set N]         → filtro local de escopo (sem troca de rota)
```

---

## Labels por Modalidade

| Modalidade | Card de vencedor | Placar final | Colunas de stats |
|---|---|---|---|
| Duplas | "ANA / BIA venceram" | "ANA/BIA × CRIS/DANI" | "DUPLA A" / "DUPLA B" |
| Simples | "ANA venceu" | "ANA × CARLOS" | Nome: "ANA" / "CARLOS" |

- Em simples não existe "DUPLA" — os nomes dos jogadores substituem o label da equipe em todo o resumo.
- O card de vencedor usa verbo no singular ("venceu") em simples e no plural ("venceram") em duplas.

---

## Notas de Implementação (Next.js)

- Rota: `app/match/[id]/stats/page.tsx` — mesma rota de Estatísticas
- Detecção de estado: `if (match.status === 'finished') renderResumoView() else renderStatsAtivas()`
- Placar detalhado: derivado de `match.sets[]`, iterando por `setNumber`
- Tie-break score exibido entre parênteses: `7(5)` = set vencido por 7-6, tie-break 7-5
- Função de compartilhamento: `shareMatchSummary(match, stats)` retorna string formatada
- `navigator.share()` disponível apenas em HTTPS e em alguns browsers mobile
- Clipboard fallback: `navigator.clipboard.writeText(text)`
- Toast de "Copiado!": componente simples com `setTimeout` de 2 segundos
- Dados de stats: `Statistics.calculate(match.pointEvents)` — recalculado no mount, sem cache
- O botão "Nova Partida" deve fazer `router.push('/match/new')` sem prefetch de dados da partida anterior

---

*Relacionado: [[03-Scout]] · [[04-Estatisticas]] · [[01-Home]]*
