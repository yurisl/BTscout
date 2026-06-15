import type { Match, MatchType, MatchContext } from '@beach-tennis-scout/domain';
import { DEFAULT_FORMAT } from '@beach-tennis-scout/domain';
import type { TeamSide } from '@beach-tennis-scout/domain';

export interface CreateMatchInput {
  type: MatchType;
  teamAPlayers: string[];
  teamBPlayers: string[];
  servingTeam: TeamSide;
  servingPlayerIndex: number;
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

  const servingTeamPlayers = input.servingTeam === 'A' ? playersA : playersB;
  const servingPlayerId = servingTeamPlayers[input.servingPlayerIndex]?.id ?? null;

  const setId = crypto.randomUUID();
  const gameId = crypto.randomUUID();
  const now = new Date();

  const match: Match = {
    id: matchId,
    type: input.type,
    status: 'in_progress',
    format: DEFAULT_FORMAT,
    teamA: { id: teamAId, side: 'A', players: playersA, matchId },
    teamB: { id: teamBId, side: 'B', players: playersB, matchId },
    servingTeam: input.servingTeam,
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
            servingTeam: input.servingTeam,
            servingPlayerId,
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
