# Sprint 1 — Protótipo Funcional Mínimo

> **Objetivo do Sprint:** Ter um protótipo que permita registrar uma partida completa de beach tennis do início ao fim — configurar, registrar pontos, ver placar em tempo real, desfazer erros e salvar offline — sem nenhuma outra funcionalidade.
>
> **Duração sugerida:** 2 semanas
> **Critério de conclusão:** Um único usuário consegue registrar uma partida real de duplas (formato Melhor de 3 Sets) do início ao fim, com placar correto, undo funcionando e dados persistidos offline.

---

## Premissa de Corte

O Sprint 1 entrega o **loop central** do produto: configurar → registrar → ver placar → desfazer. Tudo que é periférico a esse loop — histórico, estatísticas detalhadas, publicidade, compartilhamento, recuperação de partida — fica para sprints seguintes.

**O que fica de fora do Sprint 1 (e por quê):**

| Funcionalidade | Épico | Motivo do corte |
|---|---|---|
| Estatísticas detalhadas (tela de stats) | EP-05 | Placar já valida o loop; stats são valor adicional |
| Resumo pós-jogo | EP-06 | A partida termina sem cerimonial — ok para protótipo |
| Recuperação de partida (modal Home) | EP-08 | O autosave garante os dados; recuperação é UX, não dado |
| Histórico de partidas | EP-09 | Não necessário para validar o registro em si |
| Publicidade | EP-10 | Zero receita aceitável no protótipo |
| Atalhos de teclado | EP-02-04 | Conveniência, não bloqueante |
| Autocomplete de jogadores | EP-01-02 | Campos de texto simples bastam para o primeiro uso |
| Dados de contexto (torneio/local) | EP-01-05 | Campos opcionais; adiciona fricção sem valor no protótipo |
| Pro Set e Melhor de 5 Sets | EP-01-03 | Apenas Melhor de 3 no Sprint 1 (reduz escopo do engine) |
| Simples (modalidade) | EP-01-01 | Apenas Duplas no Sprint 1; Simples é trivial de adicionar depois |

---

## Stories do Sprint 1

### Grupo 1 — Domínio (sem UI)

Estas stories são puramente lógica de negócio. Devem ser implementadas e testadas antes de qualquer tela.

| ID | Story | Dependência |
|---|---|---|
| EP-03-01 🟢 | Progressão de pontos no game (0/15/30/40/Deuce/Vantagem) | — |
| EP-03-02 🟢 | Progressão de games e vitória do set | EP-03-01 |
| EP-03-03 🟢 | Tie-Break (7 pontos, win by 2) | EP-03-02 |
| EP-03-04 🟢 | Super Tie-Break como set decisivo (10 pontos, win by 2) | EP-03-02 |
| EP-03-05 🟢 | Rotação de saque entre games | EP-03-01 |

**Saída esperada do Grupo 1:**
Função pura `ScoringEngine.apply(matchState, pointEvent, matchFormat) → {newMatchState, transitions[]}` com 100% dos critérios de aceitação cobertos por testes unitários.

---

### Grupo 2 — Infraestrutura (sem UI)

| ID | Story | Dependência |
|---|---|---|
| EP-07-01 🟢 | Autosave após cada ponto (IndexedDB/Dexie) | EP-03-01 |
| EP-07-02 🟢 | App funcional 100% offline | EP-07-01 |

**Saída esperada do Grupo 2:**
Hook `useMatchStore` (Zustand) que chama o ScoringEngine e persiste no IndexedDB após cada evento. A partida sobrevive ao fechamento do browser.

---

### Grupo 3 — Configuração (UI)

| ID | Story | Dependência |
|---|---|---|
| EP-01-01 🟢 | Selecionar modalidade *(apenas Duplas no Sprint 1)* | — |
| EP-01-02 🟢 | Informar nomes dos jogadores *(sem autocomplete no Sprint 1)* | — |
| EP-01-03 🟢 | Selecionar formato *(apenas Melhor de 3 no Sprint 1)* | — |
| EP-01-04 🟢 | Definir quem saca primeiro | — |

**Saída esperada do Grupo 3:**
Tela `/match/new` com formulário funcional. Ao submeter, cria o objeto Match no IndexedDB e redireciona para `/match/[id]/scout`.

---

### Grupo 4 — Scout (UI principal)

| ID | Story | Dependência |
|---|---|---|
| EP-02-03 🟢 | Visualizar placar no header da tela de scout | EP-03-01 |
| EP-02-01 🟢 | Selecionar o jogador (Passo 1) | EP-02-03 |
| EP-02-02 🟢 | Selecionar tipo de ação (Passo 2) e salvar | EP-02-01, EP-07-01 |
| EP-04-01 🟢 | Desfazer o último ponto registrado | EP-02-02 |
| EP-04-02 🟢 | Sem publicidade no modal de undo | EP-04-01 |
| EP-08-01 🟢 | Detectar partida em andamento ao abrir o app | EP-07-01 |

**Saída esperada do Grupo 4:**
Tela `/match/[id]/scout` totalmente funcional. O loop completo de registro de uma partida funciona do primeiro ao último ponto.

---

## Definição de "Protótipo Funcional"

O Sprint 1 está completo quando **todos** os seguintes cenários funcionam de ponta a ponta, sem ajuda técnica:

### Cenário 1 — Partida simples até o fim
1. Abrir o app → Home em branco
2. Tocar "Nova Partida" → preencher 4 nomes de jogadores → selecionar Melhor de 3 → Dupla A saca → "Iniciar Partida"
3. Registrar pontos até o fim da partida (2+ sets) com o placar correto em cada etapa
4. Ao final, a partida exibe `status: finished` e o vencedor correto

### Cenário 2 — Undo no meio da partida
1. Registrar 5 pontos em sequência
2. Tocar `[↩]` → confirmar undo
3. Verificar que o placar voltou exatamente ao estado pré-último ponto
4. Registrar mais pontos normalmente após o undo

### Cenário 3 — Tie-break
1. Jogar um set até 6:6 em games
2. Verificar que o tie-break começa automaticamente com pontuação numérica
3. Jogar até o fim do tie-break (7 pontos, win by 2)
4. Verificar que o set fecha como `7-6` e o próximo set começa

### Cenário 4 — Super Tie-Break decisivo
1. Jogar até cada time vencer 1 set
2. Verificar que o Set 3 abre como super tie-break (sem games, pontuação numérica direto no set)
3. Jogar até o fim (10 pontos, win by 2)
4. Verificar que a partida encerra com vencedor correto

### Cenário 5 — Persistência offline
1. Registrar 10 pontos
2. Fechar o browser completamente
3. Reabrir o browser → o app detecta a partida em andamento
4. Continuar o registro de onde parou

### Cenário 6 — Alternância de saque
1. Registrar pontos e verificar que o indicador de saque no header alterna corretamente a cada game
2. Em um tie-break, verificar que o saque alterna após o 1º ponto e depois a cada 2 pontos

---

## O que o Sprint 1 NÃO valida

- Se o layout está bonito (é um protótipo funcional, não de design)
- Se os anúncios estão configurados
- Se o histórico persiste entre sessões diferentes (o autosave garante a sessão atual)
- Se as estatísticas detalhadas estão corretas (não há tela de stats no Sprint 1)
- Se funciona em iOS Safari, Android Chrome e desktop simultaneamente (testar apenas 1 plataforma)

---

## Sequência de Desenvolvimento Recomendada

```
Semana 1
│
├── Dias 1-2: ScoringEngine (puro, testável)
│   └── EP-03-01 → EP-03-02 → EP-03-03 → EP-03-04 → EP-03-05
│   └── Meta: 100% dos cenários de placar cobertos por testes
│
├── Dias 3-4: Persistência
│   └── EP-07-01 → EP-07-02
│   └── Meta: useMatchStore salva e restaura partida do IndexedDB
│
└── Dia 5: Tela de Configuração
    └── EP-01-01, EP-01-02, EP-01-03, EP-01-04 (podem ser paralelos)
    └── Meta: formulário cria Match no IndexedDB e redireciona

Semana 2
│
├── Dias 6-7: Header do Scout + Passo 1
│   └── EP-02-03 → EP-02-01
│   └── Meta: placar no header atualiza corretamente; seleção de jogador funciona
│
├── Dias 8-9: Passo 2 + Undo
│   └── EP-02-02 → EP-04-01 → EP-04-02
│   └── Meta: loop completo de 2 toques funciona; undo funciona
│
└── Dia 10: Recuperação + Testes dos 6 cenários
    └── EP-08-01
    └── Meta: todos os 6 cenários passam; protótipo está completo
```

---

## Riscos do Sprint 1

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Lógica de deuce/vantagem implementada errada | Média | Alto | Testes unitários exaustivos antes de qualquer UI |
| Super tie-break sem `gameId` quebra o modelo de dados | Média | Alto | Validar schema IndexedDB com `gameId: null` antes de integrar com UI |
| Undo desfaz set encerrado mas state não reabre corretamente | Alta | Alto | Testar undo unitariamente para cada tipo de transição (game, set, match) |
| IndexedDB no iOS Safari tem limites de armazenamento | Baixa | Médio | Escolher 1 plataforma para Sprint 1; iOS validado no Sprint 2 |
| Cooldown de 600ms impede registro rápido em testes | Baixa | Baixo | Desabilitar cooldown em modo de desenvolvimento |

---

## Métricas de Sucesso do Protótipo

Após o Sprint 1, medir com 2-3 usuários reais em campo:

- **Tempo médio de registro por ponto:** meta ≤ 3 segundos do começo do rally ao toque no botão de ação
- **Taxa de erros de registro:** quantos undos por partida (indica usabilidade dos botões)
- **Completude:** quantas partidas iniciadas chegaram ao fim sem abandono por problema técnico
- **Fidelidade do placar:** comparar placar registrado com placar real anotado manualmente em paralelo

---

*Relacionado: [[01-Epics]] · [[02-User-Stories]] · [[08-Dominio/09-ScoringEngine]] · [[10-Wireframe/03-Scout]]*
