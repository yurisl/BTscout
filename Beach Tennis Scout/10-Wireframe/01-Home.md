# Wireframe — Home / Dashboard

> **Tela:** Home
> **Rota Next.js:** `/`
> **Prioridade:** Alta — primeiro contato do usuário com o produto

---

## Objetivo

Ponto de entrada do aplicativo. Deve permitir iniciar uma nova partida ou retomar uma em andamento com o mínimo de toques possível. Usuários recorrentes precisam chegar à tela de scout em no máximo 2 toques a partir daqui.

---

## Componentes

| Componente | Tipo | Obrigatório |
|---|---|---|
| Header com logo | Estático | Sim |
| Ícone de configurações | Ícone-botão | Sim |
| Modal de partida em andamento | Modal condicional | Condicional |
| Botão "Nova Partida" | CTA primário | Sim |
| Lista de últimas partidas | Lista dinâmica | Sim (vazia no 1º uso) |
| Link "Ver Todas" | Link de navegação | Sim |
| Banner publicitário | AD-01 | Sim |
| Indicador offline | Badge condicional | Condicional |

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
├─────────────────────────────────────────┤
│                                         │
│  ╔═════════════════════════════════╗   │
│  ║   AD-01 · Banner 320×50        ║   │  ← publicidade rodapé
│  ╚═════════════════════════════════╝   │     fixo no bottom
│                                         │
└─────────────────────────────────────────┘
   ↑ altura total: 100dvh
```

**Comportamento condicional — Partida em andamento:**

```
┌─────────────────────────────────────────┐
│  🎾 Beach Tennis Scout      [⚙]        │
├─────────────────────────────────────────┤
│                                         │
│  ╭─────────────────────────────────╮   │
│  │  ⚡ Partida em andamento        │   │  ← modal/card de destaque
│  │                                 │   │     bg: #F57F17 (amarelo)
│  │  Ana/Bia × Cris/Dani           │   │
│  │  Set 1 · Game 3 · 40:30       │   │
│  │                                 │   │
│  │  [ CONTINUAR PARTIDA ]          │   │  ← botão principal, azul
│  │  [ Descartar ]                  │   │  ← link secundário, cinza
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
├──────────────────────────────────────────────────────┤
│  ╔════════════════════════════════════════════════╗  │
│  ║   AD-01 · Banner 468×60                       ║  │
│  ╚════════════════════════════════════════════════╝  │
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
├──────────────────────────────────────────────────────────────────┤
│  ╔════════════════════════════════════════════════════════════╗  │
│  ║   AD-01 · Banner 728×90                                   ║  │
│  ╚════════════════════════════════════════════════════════════╝  │
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

## Regras de Publicidade

- `AD-01` posicionado no rodapé fixo (`position: fixed; bottom: 0`)
- Banner não empurra o conteúdo — o layout reserva `50px` de padding-bottom no conteúdo principal
- O banner nunca aparece sobreposto ao botão "Nova Partida"
- Em dispositivos com safe area (iPhone com notch), adicionar `padding-bottom: env(safe-area-inset-bottom)` ao container do banner

---

## Notas de Implementação (Next.js)

- Rota: `app/page.tsx`
- Dados das partidas recentes: lidos do IndexedDB via hook `useRecentMatches(limit: 3)`
- Partida em andamento: verificada via `useActiveMatch()` no carregamento da página
- O CTA "Nova Partida" deve ter `prefetch` da rota `/match/new`
- Estado vazio (primeiro uso): exibir mensagem "Nenhuma partida registrada ainda. Comece agora!" no lugar da lista
- O banner AD-01 é carregado de forma assíncrona e não bloqueia o render da página

---

*Relacionado: [[02-Nova-Partida]] · [[03-Scout]] · [[05-Resumo]]*
