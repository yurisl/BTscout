import type { Match, MatchType, MatchContext } from '@beach-tennis-scout/domain';
import { DEFAULT_FORMAT } from '@beach-tennis-scout/domain';

export interface CreateMatchInput {
  type: MatchType;
  teamAPlayers: string[];
  teamBPlayers: string[];
  context?: MatchContext;
}

export function createMatch(input: CreateMatchInput): Match {
  const matchId = crypto.randomUUID();
  const teamAId = crypto.randomUUID();
  const teamBId = crypto.randomUUID();

  const playersA = input.teamAPlayers.map((name, i) => ({
    id: crypto.randomUUID(),
    name,
    position: (i + 1) as 1 | 2,
    teamId: teamAId,
    matchId,
  }));

  const playersB = input.teamBPlayers.map((name, i) => ({
    id: crypto.randomUUID(),
    name,
    position: (i + 1) as 1 | 2,
    teamId: teamBId,
    matchId,
  }));

  const setId = crypto.randomUUID();
  const gameId = crypto.randomUUID();
  const now = new Date();

  // O sacador não é definido na criação da partida — permanece em aberto
  // (serverConfig: null / servingPlayerId: null) até o modal exibido no
  // início do set (configureFirstServer/configureNextServer) resolvê-lo.
  // `servingTeam` recebe um placeholder ('A') que é sobrescrito assim que
  // o primeiro modal é respondido; não tem efeito antes disso.
  const match: Match = {
    id: matchId,
    type: input.type,
    status: 'in_progress',
    format: DEFAULT_FORMAT,
    teamA: { id: teamAId, side: 'A', players: playersA, matchId },
    teamB: { id: teamBId, side: 'B', players: playersB, matchId },
    servingTeam: 'A',
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
            servingTeam: 'A',
            servingPlayerId: null,
            serverConfig: null,
          },
        ],
      },
    ],
    winner: null,
    pointEvents: [],
    startedAt: now,
    finishedAt: null,
    createdAt: now,
  };

  if (input.context) match.context = input.context;

  return match;
}
