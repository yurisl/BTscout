import type { TeamSide, Team } from './Team.js';
import type { MatchSet } from './MatchSet.js';
import type { PointEvent } from './PointEvent.js';

export type MatchType = 'singles' | 'doubles';
export type MatchStatus = 'pending' | 'in_progress' | 'finished';

export interface MatchFormat {
  /** Sets necessários para vencer a partida (ex: 2 em melhor de 3) */
  setsToWin: number;
  /** Games para vencer um set regular */
  gamesPerSet: number;
  /** Games empatados que ativam tie-break */
  tiebreakAt: number;
  /** Pontos para vencer o tie-break (vencer por 2) */
  tiebreakPoints: number;
  /** Se o set decisivo é super tie-break ao invés de set regular */
  lastSetIsSuperTiebreak: boolean;
  /** Pontos para vencer o super tie-break (vencer por 2) */
  superTiebreakPoints: number;
}

export interface MatchContext {
  tournamentName?: string;
  location?: string;
  category?: string;
  notes?: string;
}

export interface Match {
  id: string;
  type: MatchType;
  status: MatchStatus;
  format: MatchFormat;
  teamA: Team;
  teamB: Team;
  servingTeam: TeamSide;
  servingPlayerId: string | null;
  currentSetIndex: number;
  sets: MatchSet[];
  winner: TeamSide | null;
  context?: MatchContext;
  pointEvents: PointEvent[];
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
}

/** Formato padrão do MVP: Melhor de 3, super tie-break no 3º set */
export const DEFAULT_FORMAT: MatchFormat = {
  setsToWin: 2,
  gamesPerSet: 6,
  tiebreakAt: 6,
  tiebreakPoints: 7,
  lastSetIsSuperTiebreak: true,
  superTiebreakPoints: 10,
};
