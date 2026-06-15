import type { MatchSet } from '../entities/MatchSet.js';
import type { MatchFormat } from '../entities/Match.js';
import type { TeamSide } from '../entities/Team.js';

export type SetResolution =
  | { kind: 'winner'; side: TeamSide }
  | { kind: 'tiebreak' }
  | { kind: 'ongoing' };

/**
 * Avalia o estado do set após um game ser vencido e retorna a próxima ação.
 * Chamada apenas para sets do tipo 'regular' — super_tiebreak é resolvido em resolveMatch.
 */
export function resolveSet(set: MatchSet, format: MatchFormat): SetResolution {
  const { gamesA, gamesB } = set;
  const { gamesPerSet, tiebreakAt } = format;

  // Vitória direta: atingiu gamesPerSet com vantagem de 2
  if (gamesA >= gamesPerSet && gamesA - gamesB >= 2) return { kind: 'winner', side: 'A' };
  if (gamesB >= gamesPerSet && gamesB - gamesA >= 2) return { kind: 'winner', side: 'B' };

  // Empate no limiar → tie-break
  if (gamesA === tiebreakAt && gamesB === tiebreakAt) return { kind: 'tiebreak' };

  return { kind: 'ongoing' };
}

/**
 * Avalia o super tie-break diretamente nos pontos do set decisivo.
 */
export function resolveSuperTiebreak(set: MatchSet, format: MatchFormat): TeamSide | null {
  const { tiebreakScoreA, tiebreakScoreB } = set;
  const target = format.superTiebreakPoints;
  const diff = Math.abs(tiebreakScoreA - tiebreakScoreB);

  if ((tiebreakScoreA >= target || tiebreakScoreB >= target) && diff >= 2) {
    return tiebreakScoreA > tiebreakScoreB ? 'A' : 'B';
  }
  return null;
}
