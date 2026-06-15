import type { TeamSide } from '../entities/Team.js';

export function oppositeTeam(side: TeamSide): TeamSide {
  return side === 'A' ? 'B' : 'A';
}

/**
 * Determina o time sacante em um tie-break dado o total de pontos já disputados.
 * Regra: time inicial saca o 1º ponto, depois alterna a cada 2 pontos.
 *
 * totalPointsPlayed=0 → time inicial
 * totalPointsPlayed=1 → outro time
 * totalPointsPlayed=2 → outro time
 * totalPointsPlayed=3 → time inicial
 * ...
 */
export function tiebreakServingTeam(
  initialServingTeam: TeamSide,
  totalPointsPlayed: number,
): TeamSide {
  const serveGroup = Math.floor((totalPointsPlayed + 1) / 2);
  return serveGroup % 2 === 0 ? initialServingTeam : oppositeTeam(initialServingTeam);
}
