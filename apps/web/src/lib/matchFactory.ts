import type { Match, MatchType, MatchContext } from '@beach-tennis-scout/domain';
import { DEFAULT_FORMAT, configureSetServer } from '@beach-tennis-scout/domain';
import type { TeamSide } from '@beach-tennis-scout/domain';

export interface CreateMatchInput {
  type: MatchType;
  teamAPlayers: string[];
  teamBPlayers: string[];
  /** Índice (0 ou 1) do jogador da Dupla A que inicia sacando pelo time A neste set */
  teamAFirstServerIndex: number;
  /** Índice (0 ou 1) do jogador da Dupla B que inicia sacando pelo time B neste set */
  teamBFirstServerIndex: number;
  /** Dupla que sacará o primeiro ponto da partida */
  firstServingTeam: TeamSide;
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

  // Esqueleto do set 1 sem sacador definido — configureSetServer, logo
  // abaixo, é a única fonte de verdade que preenche servingTeam/servingPlayerId
  // (do domínio, não da UI), a partir das 3 respostas coletadas no formulário.
  const skeleton: Match = {
    id: matchId,
    type: input.type,
    status: 'in_progress',
    format: DEFAULT_FORMAT,
    teamA: { id: teamAId, side: 'A', players: playersA, matchId },
    teamB: { id: teamBId, side: 'B', players: playersB, matchId },
    servingTeam: input.firstServingTeam,
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
            servingTeam: input.firstServingTeam,
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

  if (input.context) skeleton.context = input.context;

  const teamAFirstServerId = playersA[input.teamAFirstServerIndex]?.id ?? playersA[0]!.id;
  const teamBFirstServerId = playersB[input.teamBFirstServerIndex]?.id ?? playersB[0]!.id;

  return configureSetServer(skeleton, {
    teamAFirstServerId,
    teamBFirstServerId,
    firstServingTeam: input.firstServingTeam,
  });
}
