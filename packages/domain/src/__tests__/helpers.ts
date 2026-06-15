import type { Match, MatchFormat, MatchType } from '../entities/Match.js';
import type { Team } from '../entities/Team.js';
import type { Player } from '../entities/Player.js';
import { DEFAULT_FORMAT } from '../entities/Match.js';

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
  const servingPlayerId = servingTeam === 'A' ? playerA1.id : playerB1.id;

  return {
    id: matchId,
    type,
    status: 'in_progress',
    format,
    teamA,
    teamB,
    servingTeam,
    servingPlayerId,
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
        tiebreakInitialServingTeam: null,
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
            servingPlayerId,
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
}

/** Retorna o playerId do time A (primeiro jogador) */
export function playerA(match: Match): string {
  return match.teamA.players[0]!.id;
}

/** Retorna o playerId do time B (primeiro jogador) */
export function playerB(match: Match): string {
  return match.teamB.players[0]!.id;
}
