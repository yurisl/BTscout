# Wireframe — Nova Partida / Configurar Partida

> **Tela:** Configuração de Partida
> **Rota Next.js:** `/match/new`
> **Prioridade:** Alta — portão de entrada para o fluxo de scout

---

## Objetivo

Capturar os dados necessários para iniciar uma partida. O formulário deve ser rápido de preencher — jogadores com nomes salvos anteriormente preenchem via autocomplete. Campos obrigatórios são mínimos. Campos opcionais ficam agrupados em seção recolhível.

**Sem publicidade nesta tela.** O usuário está em modo de configuração e qualquer distração aumenta o risco de configuração incorreta.

---

## Componentes

| Componente | Tipo | Obrigatório |
|---|---|---|
| Header com título e botão voltar | Fixo | Sim |
| Seletor de modalidade (Simples / Duplas) | Toggle | Sim |
| Campos de nome dos jogadores | Input com autocomplete | Sim |
| Seletor de formato da partida | Radio/Toggle | Sim |
| Seletor de quem saca primeiro | Toggle duplo | Sim |
| Seção "Dados do Contexto" recolhível | Accordeon | Não |
| Botão "Iniciar Partida" | CTA primário | Sim |

---

## Comportamento — Mobile (< 768px)

```
┌─────────────────────────────────────────┐
│  [←]  Nova Partida                      │  ← header fixo 56px
│                                         │
├─────────────────────────────────────────┤
│  (scroll vertical)                      │
│                                         │
│  MODALIDADE                             │  ← label seção
│  ┌─────────────┐  ┌─────────────┐      │
│  │   Simples   │  │   Duplas    │      │  ← toggle, 48px altura
│  └─────────────┘  └─────────────┘      │  ← selecionado: bg azul
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  DUPLA A                                │  ← label azul (#1565C0)
│  ┌─────────────────────────────────┐   │
│  │  Jogador A1  _______________    │   │  ← input 48px, autocomplete
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │  ← aparece só em Duplas
│  │  Jogador A2  _______________    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  DUPLA B                                │  ← label vermelho (#C62828)
│  ┌─────────────────────────────────┐   │
│  │  Jogador B1  _______________    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Jogador B2  _______________    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  FORMATO DA PARTIDA                     │
│                                         │
│  ◉ Melhor de 3 Sets                     │  ← radio, 48px linha
│    Sets até 6, TB em 6x6,              │
│    Super TB no 3º set                   │  ← descrição em 12px cinza
│                                         │
│  ○ Pro Set                              │
│    Até 16 games, TB em 15x15           │
│                                         │
│  ○ Melhor de 5 Sets                     │
│    Sets até 6, TB em 6x6,              │
│    Super TB no 5º set                   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  QUEM SACA PRIMEIRO?                    │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │    DUPLA A      │  │   DUPLA B    │ │  ← toggle, 52px altura
│  └─────────────────┘  └──────────────┘ │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ▶ Dados do Contexto (opcional)         │  ← accordeon fechado
│                                         │
│  (expandido:)                           │
│  ┌─────────────────────────────────┐   │
│  │  Torneio  ____________________  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Local    ____________________  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Categoria  __________________  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Obs.     ____________________  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │       INICIAR PARTIDA           │   │  ← CTA 64px altura
│  │                                 │   │     bg: #2E7D32 (verde)
│  └─────────────────────────────────┘   │     fonte: 18px bold
│                                         │
│  [espaço para safe area bottom]         │
│                                         │
└─────────────────────────────────────────┘
```

**Autocomplete de jogadores:**

```
┌─────────────────────────────────────┐
│  Jogador A1  [ Ana _____________ ]  │
│              ┌─────────────────┐    │
│              │ Ana Silva       │    │  ← sugestões do histórico local
│              │ Ana Costa       │    │
│              │ Ana Beatriz     │    │
│              └─────────────────┘    │
└─────────────────────────────────────┘
```

---

## Comportamento — Tablet (768px–1199px)

```
┌──────────────────────────────────────────────────────┐
│  [←]  Nova Partida                        [⚙]       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  MODALIDADE                                          │
│  [ Simples ]  [ Duplas ]                             │
│                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │  DUPLA A            │  │  DUPLA B            │   │  ← lado a lado
│  │                     │  │                     │   │
│  │  Jogador A1 [ ___ ] │  │  Jogador B1 [ ___ ] │   │
│  │  Jogador A2 [ ___ ] │  │  Jogador B2 [ ___ ] │   │
│  │                     │  │                     │   │
│  └─────────────────────┘  └─────────────────────┘   │
│                                                      │
│  FORMATO                         SAQUE INICIAL       │
│  ◉ Melhor de 3 Sets              [ Dupla A ]         │
│  ○ Pro Set                       [ Dupla B ]         │
│  ○ Melhor de 5 Sets                                  │
│                                                      │
│  ▶ Dados do Contexto (opcional)                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              INICIAR PARTIDA                 │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Comportamento — Desktop (≥ 1200px)

```
┌──────────────────────────────────────────────────────────────────┐
│  [←]  Nova Partida                                   [⚙]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌──────────────────────────────────────────┐            │
│         │  MODALIDADE:  [ Simples ]  [ Duplas ]    │            │
│         └──────────────────────────────────────────┘            │
│                                                                  │
│  ┌────────────────────────────┐  ┌────────────────────────────┐ │
│  │  DUPLA A                  │  │  DUPLA B                  │ │
│  │                            │  │                            │ │
│  │  Jogador A1 [ _________ ] │  │  Jogador B1 [ _________ ] │ │
│  │  Jogador A2 [ _________ ] │  │  Jogador B2 [ _________ ] │ │
│  │                            │  │                            │ │
│  └────────────────────────────┘  └────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────┐  ┌────────────────────────────┐ │
│  │  FORMATO                  │  │  SAQUE INICIAL             │ │
│  │                            │  │                            │ │
│  │  ◉ Melhor de 3 Sets       │  │  [ DUPLA A ]  [ DUPLA B ] │ │
│  │  ○ Pro Set                 │  │                            │ │
│  │  ○ Melhor de 5 Sets       │  │                            │ │
│  └────────────────────────────┘  └────────────────────────────┘ │
│                                                                  │
│  ▶ Dados do Contexto (opcional)                                  │
│                                                                  │
│         ┌──────────────────────────────────────────┐            │
│         │            INICIAR PARTIDA               │            │
│         └──────────────────────────────────────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Navegação

```
Nova Partida
 │
 ├── [←] Voltar             → Home
 └── [INICIAR PARTIDA]      → /match/[id]/scout
      (cria o Match no IndexedDB e redireciona)
```

---

## Validação do Formulário

| Campo | Regra | Mensagem de erro |
|---|---|---|
| Jogador A1 | Obrigatório, min 1 char | "Informe o nome do Jogador A1" |
| Jogador A2 | Obrigatório em Duplas | "Informe o nome do Jogador A2" |
| Jogador B1 | Obrigatório | "Informe o nome do Jogador B1" |
| Jogador B2 | Obrigatório em Duplas | "Informe o nome do Jogador B2" |
| Formato | Obrigatório (padrão: Melhor de 3) | — |
| Saque inicial | Obrigatório (padrão: Dupla A) | — |

- Validação ocorre apenas no submit, não em tempo real (menos distração)
- "Iniciar Partida" fica ativo o tempo todo — validação bloqueia apenas no toque
- Campos com erro recebem borda vermelha + mensagem abaixo

---

## Regras de Publicidade

- **Nenhum anúncio nesta tela.**
- Justificativa: o usuário está configurando dados da partida. Qualquer distração aumenta risco de nome errado, formato errado ou saque inicial errado — o que compromete todo o registro de pontos subsequente.

---

## Notas de Implementação (Next.js)

- Rota: `app/match/new/page.tsx`
- Formulário gerenciado com React Hook Form + Zod
- Autocomplete: lista de nomes lida do IndexedDB (`usePlayerHistory()`)
- Ao salvar jogadores, persistir nomes únicos no IndexedDB para uso futuro
- `[INICIAR PARTIDA]` cria o objeto `Match` via `ScoringEngine.createMatch(config)` e salva no IndexedDB
- Após criação, redirecionar para `/match/[id]/scout` com `router.push`
- A mudança de Simples → Duplas deve ocultar/exibir o campo Jogador 2 de cada time com animação suave
- O acordeão de contexto usa estado local React, sem persistência

---

*Relacionado: [[01-Home]] · [[03-Scout]]*
