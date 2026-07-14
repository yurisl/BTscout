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
- 3º set sempre em Super Tie-break até 10 pontos (contagem direta, sem 15/30/40/Vantagem/Deuce, vence por 2 pontos de diferença — empate em 9x9 ou acima continua até alguém abrir 2), substituindo o set inteiro

## Configuração de saque (duplas)

- O app pergunta quem inicia sacando **apenas no início de cada set** — 1º set, 2º set e Super Tie-Break — nunca a cada game
- A pergunta tem 3 respostas: qual jogador saca primeiro pela Dupla A, qual jogador saca primeiro pela Dupla B, e qual dupla faz o primeiro saque do set
- Essas respostas alimentam o motor de regras do domínio (`configureSetServer`), que passa a calcular sozinho a rotação de saque pelo resto do set (por game em sets regulares, ponto a ponto no tie-break de 6x6 e no Super Tie-Break) — nenhuma pergunta adicional durante o set
- Em simples não há pergunta: como só existe um jogador por lado, o próprio motor configura o sacador automaticamente a cada set

### Ordem oficial de saque do Super Tie-Break

- O 1º sacador da rotação saca apenas 1 ponto
- A partir daí, cada jogador saca exatamente 2 pontos, alternando entre as duplas e, dentro de cada dupla, entre o sacador designado e o outro jogador (ex: A1→B1→A2→B2→A1→B1→...)
- Essa lógica vive inteiramente em `packages/domain` — a interface só exibe o resultado

### Mudança de lado no Super Tie-Break

- Aviso automático e apenas informativo quando o total de pontos disputados atinge 1, 5, 9, 13, 17, 21... (a cada 4 pontos)
- Não há tempo de descanso

### Cabeçalho do Super Tie-Break

Durante o Super Tie-Break, o placar exibe: rótulo "SUPER TIE-BREAK", placar direto (ex: 7 x 6), jogador sacando, quantidade de saques restantes do sacador atual, e indicação de quantos pontos faltam para a próxima troca de lado.

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