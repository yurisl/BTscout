import type { Match } from '../entities/Match.js';
import type { TeamSide } from '../entities/Team.js';
import type { SetServerConfig } from '../entities/ServeConfig.js';
import { oppositeTeam } from './serve.js';

export interface ConfigureFirstServerInput {
  /** Dupla que fará o primeiro saque do set */
  firstServingTeam: TeamSide;
  /** Jogador dessa dupla que inicia sacando */
  firstServerId: string;
}

export interface ConfigureNextServerInput {
  /** Jogador da dupla adversária (a que ainda não tem rotação definida) que fará seu primeiro saque neste set */
  serverId: string;
}

function teamRoster(match: Match, team: TeamSide) {
  return team === 'A' ? match.teamA.players : match.teamB.players;
}

function buildRotation(match: Match, team: TeamSide, firstServerId: string): [string, string] {
  const roster = teamRoster(match, team);
  const other = roster.find((p) => p.id !== firstServerId)?.id ?? firstServerId;
  return [firstServerId, other];
}

function patchActiveGameServer(
  set: Match['sets'][number],
  servingTeam: TeamSide,
  servingPlayerId: string | null,
): void {
  if (set.type !== 'regular') return;
  const game = set.games.findLast((g) => g.status === 'in_progress');
  if (game) {
    game.servingTeam = servingTeam;
    game.servingPlayerId = servingPlayerId;
  }
}

/**
 * Primeira etapa da configuração de saque de um set: define apenas a dupla
 * e o jogador que sacam primeiro. Deve ser chamada uma única vez, antes do
 * 1º ponto do set (1º set, 2º set ou Super Tie-Break) — `applyPoint`
 * rejeita eventos enquanto o set não tiver essa configuração inicial.
 *
 * Em duplas, a rotação da dupla adversária fica `null` até
 * `configureNextServer` ser chamada (quando ela estiver prestes a sacar
 * pela primeira vez neste set). Em simples, como não há ambiguidade de
 * jogador, as duas rotações já são preenchidas nesta única chamada.
 */
export function configureFirstServer(match: Match, input: ConfigureFirstServerInput): Match {
  const set = match.sets[match.currentSetIndex];
  if (!set) throw new Error('Nenhum set em andamento');
  if (set.status !== 'in_progress') throw new Error('Set atual já encerrado');
  if (set.serverConfig) {
    throw new Error('O sacador inicial deste set já foi configurado');
  }

  if (!teamRoster(match, input.firstServingTeam).some((p) => p.id === input.firstServerId)) {
    throw new Error(`Jogador ${input.firstServerId} não pertence à Dupla ${input.firstServingTeam}`);
  }

  const next: Match = structuredClone(match);
  const nextSet = next.sets[next.currentSetIndex]!;

  const rotation = buildRotation(next, input.firstServingTeam, input.firstServerId);
  const config: SetServerConfig = {
    firstServingTeam: input.firstServingTeam,
    teamARotation: input.firstServingTeam === 'A' ? rotation : null,
    teamBRotation: input.firstServingTeam === 'B' ? rotation : null,
  };

  // Simples: cada dupla tem exatamente 1 jogador possível — sem ambiguidade,
  // então a rotação da dupla adversária já é conhecida e preenchida de
  // imediato, dispensando a segunda etapa (configureNextServer) por completo.
  if (next.type === 'singles') {
    const otherTeam = oppositeTeam(input.firstServingTeam);
    const otherPlayerId = teamRoster(next, otherTeam)[0]!.id;
    const otherRotation: [string, string] = [otherPlayerId, otherPlayerId];
    if (otherTeam === 'A') config.teamARotation = otherRotation;
    else config.teamBRotation = otherRotation;
  }

  nextSet.serverConfig = config;
  next.servingTeam = input.firstServingTeam;
  next.servingPlayerId = input.firstServerId;
  patchActiveGameServer(nextSet, next.servingTeam, next.servingPlayerId);

  return next;
}

/**
 * Segunda etapa da configuração de saque de um set: preenche a rotação da
 * dupla que ainda não a tem — chamada quando essa dupla está prestes a
 * sacar pela primeira vez neste set (após o 1º game, em sets regulares;
 * após o 1º ponto, no Super Tie-Break). Não pergunta novamente qual dupla
 * é — isso já é determinado pelo estado da partida.
 *
 * Se essa dupla já é quem está prestes a sacar (match.servingTeam) e o
 * sacador ainda não foi resolvido (match.servingPlayerId === null), essa
 * chamada também resolve `match.servingPlayerId` e o game ativo — é o que
 * libera `applyPoint` para aceitar o próximo ponto.
 */
export function configureNextServer(match: Match, input: ConfigureNextServerInput): Match {
  const set = match.sets[match.currentSetIndex];
  if (!set) throw new Error('Nenhum set em andamento');
  if (set.status !== 'in_progress') throw new Error('Set atual já encerrado');
  if (!set.serverConfig) {
    throw new Error('Configure o sacador inicial deste set antes de continuar');
  }

  const teamOfServer: TeamSide | null = match.teamA.players.some((p) => p.id === input.serverId)
    ? 'A'
    : match.teamB.players.some((p) => p.id === input.serverId)
      ? 'B'
      : null;
  if (!teamOfServer) {
    throw new Error(`Jogador ${input.serverId} não pertence a nenhuma das duplas desta partida`);
  }

  const next: Match = structuredClone(match);
  const nextSet = next.sets[next.currentSetIndex]!;
  const config = nextSet.serverConfig!;

  const existingRotation = teamOfServer === 'A' ? config.teamARotation : config.teamBRotation;
  if (existingRotation) {
    throw new Error(`O sacador da Dupla ${teamOfServer} já foi configurado neste set`);
  }

  const rotation = buildRotation(next, teamOfServer, input.serverId);
  if (teamOfServer === 'A') config.teamARotation = rotation;
  else config.teamBRotation = rotation;

  // Se for exatamente a dupla que está prestes a sacar e ainda não tinha
  // jogador resolvido, resolve agora — é o gatilho que libera applyPoint.
  if (next.servingTeam === teamOfServer && next.servingPlayerId === null) {
    next.servingPlayerId = input.serverId;
    patchActiveGameServer(nextSet, next.servingTeam, next.servingPlayerId);
  }

  return next;
}
