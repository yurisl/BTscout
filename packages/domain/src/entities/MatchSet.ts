import type { TeamSide } from './Team.js';
import type { Game } from './Game.js';

/** 'regular' = set com games. 'super_tiebreak' = set decisivo sem games, pontuação direta. */
export type SetType = 'regular' | 'super_tiebreak';
export type SetStatus = 'in_progress' | 'finished';

export interface MatchSet {
  id: string;
  matchId: string;
  setNumber: number;
  type: SetType;
  gamesA: number;
  gamesB: number;
  /** Pontos do tie-break (6x6) ou do super tie-break decisivo */
  tiebreakScoreA: number;
  tiebreakScoreB: number;
  status: SetStatus;
  winner: TeamSide | null;
  /** Vazio quando type === 'super_tiebreak' */
  games: Game[];
  /** Time que sacou o primeiro ponto do super tie-break; usado para rotação de saque */
  tiebreakInitialServingTeam: TeamSide | null;
}
