# PointEvent — Evento de Ponto

> Representa o registro atômico e imutável de um único ponto disputado na partida. É a fonte primária de verdade de todo o sistema.

---

## Objetivo

`PointEvent` é o coração do modelo de dados. Cada vez que o scout registra um ponto — 2 toques na tela — um `PointEvent` é criado. Nada é calculado antes de existir um evento. O placar, as estatísticas e o histórico são todos *derivados* da sequência de `PointEvent`s registrados.

Essa abordagem é conhecida como **event sourcing leve**: em vez de armazenar apenas o placar atual, o sistema armazena cada ponto que levou àquele placar. Isso permite:
- Recalcular o estado em qualquer momento
- Desfazer qualquer ponto sem corromper dados
- Gerar estatísticas de qualquer granularidade
- Auditar a sequência exata de uma partida
- Alimentar análises de padrões na V4

---

## Responsabilidades

- Registrar de forma permanente um ponto ocorrido na partida
- Identificar quem executou a ação (jogador) e qual foi o resultado (tipo do ponto)
- Referenciar o contexto exato na partida (set, game, momento)
- Servir como insumo único para o cálculo de estatísticas
- Ser a unidade de granularidade do undo

---

## Dados que deve armazenar

| Campo | Descrição |
|---|---|
| `id` | Identificador único do evento |
| `matchId` | Partida onde ocorreu |
| `setId` | Set onde ocorreu |
| `gameId` | Game onde ocorreu (nulo no super tie-break, onde o set é a referência direta) |
| `sequenceNumber` | Número sequencial global dentro da partida (1, 2, 3...) — define a ordem exata |
| `winnerSide` | Time que ganhou o ponto: `A` ou `B` |
| `playerId` | Jogador que executou a ação final do ponto |
| `pointType` | Categoria do ponto: `winner`, `error`, `forced_error` |
| `pointSubtype` | Subtipo específico: ver tabela abaixo |
| `servingTeam` | Time que estava sacando neste ponto |
| `servingPlayer` | Jogador que estava sacando |
| `isFirstServe` | Se era o primeiro saque (`true`) ou segundo (`false`) |
| `scoreSnapshotBefore` | Placar imediatamente antes deste ponto (snapshot para undo eficiente) |
| `createdAt` | Timestamp do registro |

---

## Tipos e Subtipos de Ponto

### Categoria: `winner`

O jogador identificado executou uma ação que o adversário não conseguiu devolver.

| Subtipo | Código | Descrição |
|---|---|---|
| Winner Direita | `WINNER_DIR` | Bola vencedora pelo lado direito |
| Winner Esquerda | `WINNER_ESQ` | Bola vencedora pelo lado esquerdo |
| Winner Paralelo | `WINNER_PAR` | Bola vencedora em linha paralela |
| Winner Cruzado | `WINNER_CRU` | Bola vencedora em diagonal cruzada |
| Lob | `LOB` | Ponto por lob vencedor |
| Smash | `SMASH` | Ponto por smash vencedor |
| Drop Shot | `DROP` | Ponto por drop shot vencedor |
| Ace | `ACE` | Ponto direto no saque sem o adversário tocar a bola |

### Categoria: `error`

O jogador identificado cometeu um erro não-forçado.

| Subtipo | Código | Descrição |
|---|---|---|
| Erro Direita | `ERRO_DIR` | Erro não-forçado pelo lado direito |
| Erro Esquerda | `ERRO_ESQ` | Erro não-forçado pelo lado esquerdo |
| Erro Lob | `ERRO_LOB` | Lob que foi na rede ou fora |
| Erro Smash | `ERRO_SMASH` | Smash que foi na rede ou fora |
| Erro Saque | `ERRO_SAQUE` | Falta no saque (em saque de primeiro) |
| Dupla Falta | `DUPLA_FALTA` | Duas faltas consecutivas — ponto direto para o adversário |

> **Importante:** Em erros, o jogador identificado (`playerId`) é quem **cometeu** o erro. O `winnerSide` aponta para o time adversário, que ganhou o ponto em consequência. O ponto é creditado ao time adversário nas estatísticas de resultado, mas o erro é contabilizado no jogador que cometeu.

### Categoria: `forced_error`

O jogador identificado forçou a situação que levou o adversário ao erro. O crédito vai para quem forçou.

| Subtipo | Código | Descrição |
|---|---|---|
| Forçou Erro | `FORCOU_ERRO` | Ponto ganho porque o adversário errou sob pressão |

> Em `forced_error`, o `playerId` é quem **forçou** o erro (quem ganhou o ponto), não quem errou. Não há um `playerId` do adversário registrado — este modelo simplificado é suficiente para o MVP.

---

## Regras de Negócio

1. **Um `PointEvent` é imutável após criado.** Ele nunca é editado. Para corrigir um erro de registro, o ponto é desfeito via undo (o evento é removido da sequência) e um novo evento correto é registrado.

2. **O `sequenceNumber` é monotonicamente crescente dentro de uma partida.** Permite reconstruir a ordem exata de qualquer forma.

3. **O `scoreSnapshotBefore` armazena o estado do placar antes do ponto.** Isso torna o undo O(1) — basta restaurar o snapshot — sem precisar recalcular toda a sequência.

4. **Todo ponto tem um `winnerSide`, um `playerId`, um `pointType` e um `pointSubtype`.** Não existe ponto parcialmente preenchido — o registro só é salvo quando o segundo toque (subtipo) é concluído.

5. **`isFirstServe` é relevante para calcular estatísticas de aproveitamento de saque.** Um `ACE` no primeiro saque e um `ACE` no segundo saque têm pesos diferentes para esse cálculo.

6. **`gameId` pode ser nulo** apenas quando o ponto ocorre dentro de um set do tipo `super_tiebreak`, que não cria objetos `Game`.

---

## Como os PointEvents Geram Estatísticas

Os `PointEvent`s são a única fonte de dado para cálculo de estatísticas. Nenhuma estatística é armazenada diretamente no momento do registro — tudo é derivado. O processo é:

```
PointEvent[] (sequência completa da partida)
    │
    ▼
Statistics.calculate(events)
    │
    ├── Para cada evento com pointType = 'winner'
    │       → incrementa winner do playerId pelo subtipo
    │
    ├── Para cada evento com pointType = 'error'
    │       → incrementa erro do playerId pelo subtipo
    │
    ├── Para cada evento com pointType = 'forced_error'
    │       → incrementa "forçou erro" do playerId
    │
    ├── Para cada evento com subtipo 'ACE' ou 'ERRO_SAQUE'/'DUPLA_FALTA'
    │       → alimenta estatísticas de saque do servingPlayer
    │
    └── Para cada evento
            → incrementa total de pontos do winnerSide
```

Ver detalhamento completo em [[07-Statistics]].

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Match` | N para 1 | Pertence a uma partida |
| `Set` | N para 1 | Pertence a um set |
| `Game` | N para 1 | Pertence a um game (opcional no super tie-break) |
| `Player` | N para 1 | Jogador que executou a ação |
| `Statistics` | alimenta | É a matéria-prima do cálculo de estatísticas |
| `ScoringEngine` | criado por | O engine cria um evento a cada ponto registrado |

---

*Relacionado: [[01-Match]] · [[03-Player]] · [[04-Set]] · [[05-Game]] · [[07-Statistics]] · [[08-ScoringEngine]]*
