import type { Game } from '../entities/Game.js';
import type { MatchFormat } from '../entities/Match.js';
import type { TeamSide } from '../entities/Team.js';

/**
 * Retorna o vencedor do game ou null se o game ainda não foi decidido.
 * Armazena pontos como inteiros brutos; a exibição 0/15/30/40 é responsabilidade da UI.
 */
export function resolveGame(game: Game, format: MatchFormat): TeamSide | null {
  const { pointsA, pointsB } = game;
  const diff = Math.abs(pointsA - pointsB);

  if (game.type === 'regular') {
    // Precisa de pelo menos 4 pontos (equivalente ao "game" após 40) com 2 de vantagem
    if ((pointsA >= 4 || pointsB >= 4) && diff >= 2) {
      return pointsA > pointsB ? 'A' : 'B';
    }
    return null;
  }

  // tie-break: pontuação numérica direta, vencer por 2
  const target = format.tiebreakPoints;
  if ((pointsA >= target || pointsB >= target) && diff >= 2) {
    return pointsA > pointsB ? 'A' : 'B';
  }
  return null;
}

/** Converte pontos brutos de game regular para exibição (uso opcional pela UI) */
export function toDisplayScore(pointsA: number, pointsB: number): string {
  const labels = ['0', '15', '30', '40'];

  if (pointsA >= 3 && pointsB >= 3) {
    const diff = pointsA - pointsB;
    if (diff === 0) return 'Deuce';
    return diff > 0 ? 'Vant. A' : 'Vant. B';
  }

  const a = labels[Math.min(pointsA, 3)] ?? '40';
  const b = labels[Math.min(pointsB, 3)] ?? '40';
  return `${a}:${b}`;
}
