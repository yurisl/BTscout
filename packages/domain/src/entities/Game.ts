import type { TeamSide } from './Team.js';

export type GameType = 'regular' | 'tiebreak';
export type GameStatus = 'in_progress' | 'finished';

export interface Game {
  id: string;
  setId: string;
  matchId: string;
  gameNumber: number;
  type: GameType;
  pointsA: number;
  pointsB: number;
  status: GameStatus;
  winner: TeamSide | null;
  servingTeam: TeamSide;
  /** playerId do sacador atual */
  servingPlayerId: string | null;
}
