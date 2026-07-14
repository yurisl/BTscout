import type { TeamSide } from './Team.js';
import type { SetServerConfig } from './ServeConfig.js';

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
  /**
   * Rotação de saque ponto a ponto usada apenas por games `type: 'tiebreak'`
   * (6x6 dentro de um set regular). Derivada da rotação do set no momento em
   * que o tie-break é criado — ver `applyPoint`. `null` para games regulares.
   */
  serverConfig: SetServerConfig | null;
}
