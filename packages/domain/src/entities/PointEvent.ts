import type { TeamSide } from './Team.js';

export type PointType = 'winner' | 'error' | 'forced_error';

export type WinnerSubtype =
  | 'WINNER_DIR'
  | 'WINNER_ESQ'
  | 'WINNER_PAR'
  | 'WINNER_CRU'
  | 'LOB'
  | 'SMASH'
  | 'DROP'
  | 'ACE';

export type ErrorSubtype =
  | 'ERRO_DIR'
  | 'ERRO_ESQ'
  | 'ERRO_LOB'
  | 'ERRO_SMASH'
  | 'ERRO_SAQUE'
  | 'DUPLA_FALTA';

export type ForcedErrorSubtype = 'FORCOU_ERRO';

export type PointSubtype = WinnerSubtype | ErrorSubtype | ForcedErrorSubtype;

/**
 * Snapshot dos campos mutáveis da partida imediatamente ANTES deste ponto.
 * Armazena IDs e estrutura completa de sets/games para permitir undo O(1)
 * sem recalcular a sequência inteira de eventos.
 */
export interface GameSnapshot {
  id: string;
  gameNumber: number;
  type: 'regular' | 'tiebreak';
  pointsA: number;
  pointsB: number;
  status: 'in_progress' | 'finished';
  winner: TeamSide | null;
  servingTeam: TeamSide;
  servingPlayerId: string | null;
}

export interface SetSnapshot {
  id: string;
  setNumber: number;
  type: 'regular' | 'super_tiebreak';
  gamesA: number;
  gamesB: number;
  tiebreakScoreA: number;
  tiebreakScoreB: number;
  status: 'in_progress' | 'finished';
  winner: TeamSide | null;
  tiebreakInitialServingTeam: TeamSide | null;
  games: GameSnapshot[];
}

export interface ScoreSnapshot {
  sets: SetSnapshot[];
  currentSetIndex: number;
  servingTeam: TeamSide;
  servingPlayerId: string | null;
  matchStatus: 'pending' | 'in_progress' | 'finished';
  matchWinner: TeamSide | null;
  finishedAt: Date | null;
}

export interface PointEvent {
  id: string;
  matchId: string;
  setId: string;
  /** null quando o ponto ocorre em set tipo super_tiebreak */
  gameId: string | null;
  sequenceNumber: number;
  winnerSide: TeamSide;
  /** Jogador que executou a ação (winner, erro, forçou erro) */
  playerId: string;
  pointType: PointType;
  pointSubtype: PointSubtype;
  servingTeam: TeamSide;
  servingPlayerId: string;
  isFirstServe: boolean;
  scoreSnapshotBefore: ScoreSnapshot;
  createdAt: Date;
}
