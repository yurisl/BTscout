import type { Player } from './Player.js';

export type TeamSide = 'A' | 'B';

export interface Team {
  id: string;
  side: TeamSide;
  players: Player[];
  matchId: string;
}
