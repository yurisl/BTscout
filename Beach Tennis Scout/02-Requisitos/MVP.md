# MVP - Beach Tennis Scout

## Objetivo

Permitir registrar uma partida de Beach Tennis ponto a ponto e gerar estatísticas automáticas.

## Cadastro da partida

- Simples
- Duplas

### Jogadores

Simples:
- Jogador A
- Jogador B

Duplas:
- Jogador A1
- Jogador A2
- Jogador B1
- Jogador B2

## Regras padrão

Este produto é exclusivamente para Beach Tennis — nenhuma regra de tênis tradicional (ex: Advantage) é implementada. As regras abaixo são fixas, centralizadas em `packages/domain` e não configuráveis pela interface:

- Melhor de 3 sets
- Sets 1 e 2 até 6 games
- Tie-break em 6x6 (vence por 2 pontos de diferença)
- **Sistema No-Ad obrigatório:** em 40x40 (3x3 em pontos brutos), o próximo ponto encerra o game imediatamente — **nunca há Advantage**
- 3º set sempre em Super Tie-break até 10 pontos (vence por 2 pontos de diferença), substituindo o set inteiro

## Registro de pontos

Registrar:

- Quem venceu o ponto
- Como o ponto foi definido

## Winners

- Direita
- Esquerda
- Paralelo
- Cruzado
- Drop shot
- Lob
- Smash
- Ace

## Erros

- Direita
- Esquerda
- Smash
- Lob
- Saque
- Dupla falta

## Estatísticas

- Disponíveis em dois momentos:
  - **Ao vivo**, durante a partida, via botão "Estatísticas" sempre acessível (painel lateral no desktop, modal no mobile), sem interromper o registro de pontos
  - **Finais**, na tela de Resumo após o fim da partida
- Conteúdo (idêntico nos dois momentos, calculado a partir do mesmo `calculateStats`):
  - Pontos disputados
  - Winners (por tipo e total)
  - Erros (por tipo e total)
  - Percentuais (saque, % de pontos por winner/erro)
  - Estatísticas por jogador
  - Estatísticas por dupla (time)

## Pausar e continuar partida

- Botão "Pausar partida" disponível durante o registro — o estado já está salvo automaticamente a cada ponto (autosave), então pausar apenas retorna à Home
- Home: enquanto existir uma partida com status `in_progress`, exibe banner "Existe uma partida em andamento" com botão "Continuar partida"
- Ao reabrir o navegador (nova sessão) com uma partida em andamento salva, a Home pergunta uma vez: "Deseja continuar a partida em andamento?"

## Publicidade

- **Removida do MVP.** Nenhuma tela exibe banner, intersticial ou placeholder de anúncio. A infraestrutura de anúncios poderá ser reintroduzida em versão futura, sem impacto na tela de registro de pontos.