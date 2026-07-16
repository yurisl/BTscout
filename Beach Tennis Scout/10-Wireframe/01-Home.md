# Wireframe — Home / Dashboard

> **Tela:** Home
> **Rota Next.js:** `/`
> **Prioridade:** Alta — primeiro contato do usuário com o produto

> ⚠️ Cores citadas neste documento (ex: `#1565C0`) são de versão anterior à identidade "Areia & Oceano". Paleta oficial: [[../12-Design-System/01-Colors|12-Design-System/01-Colors]] — Dupla A em Azul Oceano `#1E88E5`, fundo Areia Clara `#F6F3EE`. **CTA primário desta tela é Laranja Escuro `#B45309`** (não Azul Oceano — ver [[../12-Design-System/01-Colors|12-Design-System/01-Colors]] § "Laranja Escuro").
>
> ⚠️ **Logo (revisado em 2026-07-16):** o "🎾 Beach Tennis Scout" em texto nos mockups abaixo foi substituído pelo logo gráfico real, no lugar do `<h1>` de título. Não é uma imagem única: são **3 peças em sequência** — palmeira → wordmark "BEACH TENNIS SCOUT" (a peça maior/mais legível) → bola — para que o texto do nome não fique pequeno demais para ler no header (problema da primeira versão, que usava o selo completo como uma imagem só). Estrutura do header (logo à esquerda, botão "Nova Partida" à direita) continua igual. Ver [[../12-Design-System/03-Components|12-Design-System/03-Components]] § Logo.

---

## Objetivo

Ponto de entrada do aplicativo. Deve permitir iniciar uma nova partida ou retomar uma em andamento com o mínimo de toques possível. Usuários recorrentes precisam chegar à tela de scout em no máximo 2 toques a partir daqui.

---

## Componentes

| Componente | Tipo | Obrigatório |
|---|---|---|
| Header com logo | Estático | Sim |
| Ícone de configurações | Ícone-botão | Sim |
| Banner "Existe uma partida em andamento" | Card persistente | Condicional (enquanto houver partida `in_progress`) |
| Diálogo "Deseja continuar a partida em andamento?" | Modal, perguntado 1× por sessão | Condicional |
| Botão "Nova Partida" | CTA primário | Sim |
| Lista de últimas partidas | Lista dinâmica | Sim (vazia no 1º uso) |
| Link "Ver Todas" | Link de navegação | Sim |
| Indicador offline | Badge condicional | Condicional |

> Sem publicidade nesta ou em nenhuma outra tela do MVP — decisão de produto pós-validação do primeiro deploy.

---

## Comportamento — Mobile (< 768px)

```
┌─────────────────────────────────────────┐  ← viewport 390px
│                                         │
│  🎾 Beach Tennis Scout      [⚙]        │  ← header fixo, 56px altura
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │   ✚  NOVA PARTIDA              │   │  ← CTA primário
│  │                                 │   │     altura: 80px
│  └─────────────────────────────────┘   │     bg: #1565C0 (azul)
│                                         │     fonte: 20px bold, branco
│                                         │
├─────────────────────────────────────────┤
│  Partidas Recentes                      │  ← label seção, 14px
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Ana/Bia × Cris/Dani           │   │  ← card de partida
│  │  6-4, 6-3    •    14/06/2026   │   │     altura: 64px
│  └─────────────────────────────────┘   │     toque → Resumo/Detalhe
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  João/Pedro × Rafa/Bruno        │   │
│  │  7-6(4), 4-6, 10-7  •  13/06  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Ana/Bia × Luana/Carol         │   │
│  │  6-2, 6-1    •    12/06/2026   │   │
│  └─────────────────────────────────┘   │
│                                         │
│                    [Ver Todas →]        │  ← link direita, 14px
│                                         │
└─────────────────────────────────────────┘
   ↑ altura total: 100dvh — sem banner de publicidade
```

**Comportamento condicional — Partida em andamento (banner persistente na Home):**

```
┌─────────────────────────────────────────┐
│  🎾 Beach Tennis Scout      [⚙]        │
├─────────────────────────────────────────┤
│                                         │
│  ╭─────────────────────────────────╮   │
│  │  Existe uma partida em          │   │  ← banner de destaque
│  │  andamento                      │   │     bg: --color-a-light
│  │  Ana/Bia vs Cris/Dani           │   │     border: --color-a
│  │                                 │   │
│  │       [ Continuar partida ]     │   │  ← botão principal, azul
│  ╰─────────────────────────────────╯   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   ✚  NOVA PARTIDA              │   │  ← CTA secundário neste estado
│  └─────────────────────────────────┘   │
│                                         │
│  [lista de recentes abaixo...]          │
│                                         │
└─────────────────────────────────────────┘
```

**Comportamento condicional — Diálogo de retomada (1× por sessão do navegador):**

```
┌─────────────────────────────────────────┐
│              ░░░░░░░░░░░░              │  ← backdrop
│         ╭───────────────────╮          │
│         │ Deseja continuar   │          │
│         │ a partida em       │          │
│         │ andamento?         │          │
│         │                    │          │
│         │ Ana/Bia vs         │          │
│         │ Cris/Dani          │          │
│         │                    │          │
│         │ [Agora não] [Continuar partida]│
│         ╰───────────────────╯          │
└─────────────────────────────────────────┘
```

- Exibido apenas quando a Home carrega em uma nova sessão de navegador (`sessionStorage`) **e** existe uma partida `in_progress`
- "Agora não" apenas fecha o diálogo — o banner persistente acima continua disponível
- "Continuar partida" → navega direto para `/partida/[id]`, exatamente no ponto salvo

---

## Comportamento — Tablet (768px–1199px)

```
┌──────────────────────────────────────────────────────┐
│  🎾 Beach Tennis Scout                    [⚙]       │  ← header 64px
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────────────────────────────────────────┐  │
│   │                                              │  │
│   │         ✚  NOVA PARTIDA                     │  │  ← CTA 96px altura
│   │                                              │  │
│   └──────────────────────────────────────────────┘  │
│                                                      │
│  Partidas Recentes                                   │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Ana/Bia × Cri..  │  │ João/Ped × Raf.. │         │  ← grid 2 colunas
│  │ 6-4, 6-3         │  │ 7-6, 4-6, 10-7  │         │
│  │ 14/06            │  │ 13/06            │         │
│  └──────────────────┘  └──────────────────┘         │
│                                                      │
│  ┌──────────────────┐                               │
│  │ Ana/Bia × Lua... │                               │
│  │ 6-2, 6-1         │                               │
│  │ 12/06            │                               │
│  └──────────────────┘        [Ver Todas →]          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Comportamento — Desktop (≥ 1200px)

```
┌──────────────────────────────────────────────────────────────────┐
│  🎾 Beach Tennis Scout                              [⚙]         │  ← header 64px
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌─────────────────────────────────────────┐             │
│         │                                         │             │
│         │         ✚  NOVA PARTIDA                │             │  ← CTA centralizado
│         │                                         │             │     max-width: 480px
│         └─────────────────────────────────────────┘             │
│                                                                  │
│  Partidas Recentes                                               │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Ana/Bia         │  │ João/Pedro      │  │ Ana/Bia         │ │  ← grid 3 colunas
│  │ × Cris/Dani     │  │ × Rafa/Bruno    │  │ × Luana/Carol   │ │
│  │ 6-4, 6-3        │  │ 7-6, 4-6, 10-7 │  │ 6-2, 6-1        │ │
│  │ 14/06/2026      │  │ 13/06/2026      │  │ 12/06/2026      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│                                           [Ver Todas →]         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Navegação

```
Home
 │
 ├── [NOVA PARTIDA]          → /match/new
 ├── [CONTINUAR PARTIDA]     → /match/[id]/scout  (se partida em andamento)
 ├── [card de partida]       → /match/[id]/stats
 ├── [Ver Todas]             → /history
 └── [⚙]                   → /settings
```

---

## Publicidade

Nenhuma. A Home não reserva espaço para banner, intersticial ou qualquer placeholder de anúncio — decisão de produto pós-validação do primeiro deploy (ver [[02-Monetizacao]]).

---

## Notas de Implementação (Next.js)

- Rota: `app/page.tsx` (implementação real em `apps/web/src/app/page.tsx`)
- Dados das partidas: lidos do `localStorage` via `loadMatches()` (`apps/web/src/lib/storage.ts`)
- Partida em andamento: `matches.filter(m => m.status === 'in_progress')`, a mais recente exibida no banner
- Diálogo de retomada: exibido no máximo 1× por sessão de navegador, controlado por uma flag em `sessionStorage` (`bts:resume-asked`)
- O CTA "Nova Partida" navega para `/partida/nova`
- Estado vazio (primeiro uso): exibir mensagem "Nenhuma partida registrada ainda. Comece agora!" no lugar da lista

---

*Relacionado: [[02-Nova-Partida]] · [[03-Scout]] · [[05-Resumo]]*
