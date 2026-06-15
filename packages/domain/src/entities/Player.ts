export type PlayerPosition = 1 | 2;

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  teamId: string;
  matchId: string;
}
