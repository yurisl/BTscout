# Player — Jogador

> Representa um indivíduo que participa de uma partida. É a menor unidade de identidade do domínio.

---

## Objetivo

`Player` é quem executa as ações dentro da quadra. Cada `PointEvent` registra não apenas qual time ganhou o ponto, mas qual jogador específico realizou a ação final — um winner, um saque, um erro. Essa granularidade é o que permite gerar estatísticas individuais, não apenas por time.

No MVP, `Player` é uma entidade simples com nome e posição dentro do time. A partir da V2, pode evoluir para um perfil com histórico cross-partida.

---

## Responsabilidades

- Ser identificado pelo nome dentro de uma partida
- Ter uma posição dentro do time (Jogador 1 ou Jogador 2 em duplas)
- Ser o sujeito atribuído a cada `PointEvent`
- Ser a unidade de granularidade das estatísticas individuais

---

## Dados que deve armazenar

| Campo | Descrição |
|---|---|
| `id` | Identificador único do jogador dentro da partida |
| `name` | Nome do jogador (obrigatório, texto livre no MVP) |
| `position` | Posição no time: `1` ou `2` (em duplas); `1` em simples |
| `teamId` | Time ao qual pertence |
| `matchId` | Partida à qual pertence |

### Evolução para V2+

A partir da V2, um `Player` poderá ter um `profileId` vinculado a um perfil persistente, permitindo:
- Histórico de partidas do jogador
- Evolução de estatísticas ao longo do tempo
- Comparação entre jogadores de diferentes partidas

No MVP, essa vinculação não existe. Cada jogador é criado inline na partida e não persiste como entidade independente entre sessões.

---

## Regras de Negócio

1. **O nome do jogador é obrigatório.** Uma partida não pode ser iniciada sem nomes definidos para todos os jogadores.

2. **Em duplas, cada time tem Jogador 1 e Jogador 2.** A distinção é usada para estatísticas individuais e para exibição na UI (os botões de seleção no registro de ponto mostram os nomes).

3. **Em simples, há apenas Jogador 1 em cada time.** O campo `position` existe mas tem valor fixo `1`.

4. **O jogador não muda de time durante a partida.** Não existe troca de time mid-match.

5. **Um ponto sem jogador identificado não é válido no modelo de 2 toques.** O primeiro toque do registro sempre seleciona o jogador — não existe ponto atribuído somente ao time sem identificação do jogador.

6. **Em situações de erro do adversário (tipo `FORCOU_ERRO`):** o jogador creditado é o que *forçou* o erro (o que estava com a posse da ação), não o que errou. O adversário que errou não recebe evento — o erro forçado é uma categoria de winner do ponto de vista estatístico.

---

## Relacionamentos

| Entidade | Tipo | Descrição |
|---|---|---|
| `Team` | N para 1 | Pertence a um time |
| `Match` | N para 1 | Pertence a uma partida |
| `PointEvent` | 1 para N | É o sujeito de múltiplos eventos de ponto |
| `Statistics` | referenciado por | As estatísticas individuais são agregadas por jogador |

---

*Relacionado: [[02-Team]] · [[06-PointEvent]] · [[07-Statistics]]*
