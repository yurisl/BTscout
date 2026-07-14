import type { Match, MatchFormat, MatchType } from '../entities/Match.js';
import type { Team } from '../entities/Team.js';
import type { Player } from '../entities/Player.js';
import { DEFAULT_FORMAT } from '../entities/Match.js';
import { configureFirstServer, configureNextServer } from '../scoring/configureServe.js';

let idCounter = 0;
function id(prefix = ''): string {
  return `${prefix}${++idCounter}`;
}

export function makePlayer(name: string, teamId: string, matchId: string, position: 1 | 2 = 1): Player {
  return { id: id('p'), name, position, teamId, matchId };
}

export function makeMatch(
  opts: { type?: MatchType; format?: Partial<MatchFormat>; servingTeam?: 'A' | 'B' } = {},
): Match {
  const matchId = id('m');
  const teamAId = id('t');
  const teamBId = id('t');

  const type = opts.type ?? 'singles';
  const format: MatchFormat = { ...DEFAULT_FORMAT, ...opts.format };

  const playerA1 = makePlayer('Ana', teamAId, matchId);
  const playerB1 = makePlayer('Bia', teamBId, matchId);

  const players: Player[] =
    type === 'doubles'
      ? [
          playerA1,
          makePlayer('Carol', teamAId, matchId, 2),
          playerB1,
          makePlayer('Dani', teamBId, matchId, 2),
        ]
      : [playerA1, playerB1];

  const teamA: Team = {
    id: teamAId,
    side: 'A',
    players: players.filter((p) => p.teamId === teamAId),
    matchId,
  };
  const teamB: Team = {
    id: teamBId,
    side: 'B',
    players: players.filter((p) => p.teamId === teamBId),
    matchId,
  };

  const setId = id('s');
  const gameId = id('g');

  const servingTeam = opts.servingTeam ?? 'A';

  const skeleton: Match = {
    id: matchId,
    type,
    status: 'in_progress',
    format,
    teamA,
    teamB,
    servingTeam,
    servingPlayerId: null,
    currentSetIndex: 0,
    sets: [
      {
        id: setId,
        matchId,
        setNumber: 1,
        type: 'regular',
        gamesA: 0,
        gamesB: 0,
        tiebreakScoreA: 0,
        tiebreakScoreB: 0,
        status: 'in_progress',
        winner: null,
        serverConfig: null,
        games: [
          {
            id: gameId,
            setId,
            matchId,
            gameNumber: 1,
            type: 'regular',
            pointsA: 0,
            pointsB: 0,
            status: 'in_progress',
            winner: null,
            servingTeam,
            servingPlayerId: null,
            serverConfig: null,
          },
        ],
      },
    ],
    winner: null,
    pointEvents: [],
    startedAt: new Date(),
    finishedAt: null,
    createdAt: new Date(),
  };

  // Configura o sacador inicial do set 1 usando o primeiro jogador de cada
  // dupla — exercita o mesmo domínio (configureFirstServer/configureNextServer)
  // usado pela app, só que respondendo as duas etapas de imediato para que
  // os testes de placar não precisem lidar com o fluxo reativo de perguntas.
  const firstServerId = servingTeam === 'A' ? playerA1.id : playerB1.id;
  let match = configureFirstServer(skeleton, { firstServingTeam: servingTeam, firstServerId });

  if (type === 'doubles') {
    const otherServerId = servingTeam === 'A' ? playerB1.id : playerA1.id;
    match = configureNextServer(match, { serverId: otherServerId });
  }

  return match;
}

/** Retorna o playerId do time A (primeiro jogador) */
export function playerA(match: Match): string {
  return match.teamA.players[0]!.id;
}

/** Retorna o playerId do time B (primeiro jogador) */
export function playerB(match: Match): string {
  return match.teamB.players[0]!.id;
}

/**
 * Simula respostas automáticas e determinísticas (sempre o 1º jogador de
 * cada dupla) ao fluxo de configuração de saque em duas etapas — usada por
 * testes de placar/undo/stats que não testam a configuração de saque em
 * si, apenas precisam que a partida continue avançando por sets/Super
 * Tie-Break sem travar no novo guard de `applyPoint`. Chamada antes de
 * cada ponto, é um no-op quando o set atual já está totalmente configurado.
 */
export function ensureServeConfigured(match: Match): Match {
  const set = match.sets[match.currentSetIndex];
  if (!set || match.status !== 'in_progress') return match;

  let next = match;

  if (!set.serverConfig) {
    const team = next.servingTeam;
    const firstServerId = team === 'A' ? next.teamA.players[0]!.id : next.teamB.players[0]!.id;
    next = configureFirstServer(next, { firstServingTeam: team, firstServerId });
  }

  if (next.type === 'doubles' && next.servingPlayerId === null) {
    const team = next.servingTeam;
    const serverId = team === 'A' ? next.teamA.players[0]!.id : next.teamB.players[0]!.id;
    next = configureNextServer(next, { serverId });
  }

  return next;
}
