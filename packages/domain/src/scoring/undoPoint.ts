import type { Match } from '../entities/Match.js';
import type { MatchSet } from '../entities/MatchSet.js';
import type { Game } from '../entities/Game.js';
import type { SetSnapshot, GameSnapshot } from '../entities/PointEvent.js';

export interface UndoPointResult {
  match: Match;
  /** Evento removido, útil para logging ou confirmação na UI */
  removedEvent: Match['pointEvents'][number];
}

export function undoPoint(match: Match): UndoPointResult {
  if (match.pointEvents.length === 0) {
    throw new Error('Nenhum ponto para desfazer');
  }

  const next: Match = structuredClone(match);
  const removedEvent = next.pointEvents.pop()!;
  const snap = removedEvent.scoreSnapshotBefore;

  next.sets = snap.sets.map((ss) => restoreSet(ss, next.id));
  next.currentSetIndex = snap.currentSetIndex;
  next.servingTeam = snap.servingTeam;
  next.servingPlayerId = snap.servingPlayerId;
  next.status = snap.matchStatus;
  next.winner = snap.matchWinner;
  next.finishedAt = snap.finishedAt;

  return { match: next, removedEvent };
}

// ---------------------------------------------------------------------------

function restoreSet(ss: SetSnapshot, matchId: string): MatchSet {
  return {
    id: ss.id,
    matchId,
    setNumber: ss.setNumber,
    type: ss.type,
    gamesA: ss.gamesA,
    gamesB: ss.gamesB,
    tiebreakScoreA: ss.tiebreakScoreA,
    tiebreakScoreB: ss.tiebreakScoreB,
    status: ss.status,
    winner: ss.winner,
    tiebreakInitialServingTeam: ss.tiebreakInitialServingTeam,
    games: ss.games.map((gs) => restoreGame(gs, ss.id, matchId)),
  };
}

function restoreGame(gs: GameSnapshot, setId: string, matchId: string): Game {
  return {
    id: gs.id,
    setId,
    matchId,
    gameNumber: gs.gameNumber,
    type: gs.type,
    pointsA: gs.pointsA,
    pointsB: gs.pointsB,
    status: gs.status,
    winner: gs.winner,
    servingTeam: gs.servingTeam,
    servingPlayerId: gs.servingPlayerId,
  };
}
