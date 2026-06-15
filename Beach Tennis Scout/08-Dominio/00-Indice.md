# Domínio — Índice

> Modelagem do domínio de negócio do Beach Tennis Scout. Não contém código, SQL ou diagramas de banco de dados. Foca exclusivamente nas entidades, regras e relacionamentos do negócio.

---

## Entidades

| Documento | Entidade | Responsabilidade |
|---|---|---|
| [[01-Match]] | Match | Agregado raiz. Representa a partida completa do início ao fim |
| [[02-Team]] | Team | Agrupa os jogadores de um lado da quadra (A ou B) |
| [[03-Player]] | Player | Indivíduo que executa ações na quadra e recebe estatísticas individuais |
| [[04-Set]] | Set | Subdivisão da partida composta por games |
| [[05-Game]] | Game | Subdivisão do set composta por pontos (regular, tie-break, super tie-break) |
| [[06-PointEvent]] | PointEvent | Registro atômico e imutável de cada ponto disputado. Fonte primária da verdade |
| [[07-Statistics]] | Statistics | Agregado calculado de performance, derivado dos PointEvents |
| [[09-ScoringEngine]] | ScoringEngine | Motor de domínio que processa eventos e governa todas as transições de estado |

---

## Hierarquia do Domínio

```
Match
 ├── Team A
 │    ├── Player A1
 │    └── Player A2
 ├── Team B
 │    ├── Player B1
 │    └── Player B2
 ├── Set 1
 │    ├── Game 1
 │    │    ├── PointEvent 1
 │    │    └── PointEvent 2 ...
 │    └── Game 2 ...
 ├── Set 2 ...
 ├── Set 3 (super tie-break — sem games filhos)
 │    ├── PointEvent N
 │    └── PointEvent N+1 ...
 └── Statistics (calculadas a partir de todos os PointEvents)
```

---

## Princípios de Modelagem

- **PointEvent como fonte da verdade:** nenhuma estatística é armazenada diretamente. Tudo é derivado da sequência de eventos.
- **ScoringEngine como serviço puro:** toda a inteligência das regras do beach tennis vive no engine, que é uma função determinística testável em isolamento.
- **Entidades como estruturas de estado:** `Match`, `Set`, `Game` são contêineres de estado — o comportamento pertence ao engine.
- **Undo sem limite:** o modelo de event sourcing torna o undo natural — basta remover o último evento e restaurar o snapshot anterior.

---

## Formatos de Partida Suportados no MVP

| Formato | Sets para Vencer | Set Decisivo |
|---|---|---|
| Melhor de 3 (padrão) | 2 | Super tie-break (10 pontos) |
| Pro Set | — | Um único set até 16 games (tie-break em 15x15) |
| Melhor de 5 | 3 | Set regular ou super tie-break |
