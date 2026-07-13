import type { Game } from '../entities/Game.js';
import type { MatchFormat } from '../entities/Match.js';
import type { TeamSide } from '../entities/Team.js';

/**
 * Retorna o vencedor do game ou null se o game ainda não foi decidido.
 * Armazena pontos como inteiros brutos; a exibição 0/15/30/40 é responsabilidade da UI.
 *
 * Beach Tennis usa SEMPRE o sistema No-Ad — nunca há "Vantagem". Em 40x40 (3x3 em
 * pontos brutos), o próximo ponto encerra o game imediatamente (ponto decisivo),
 * sem exigir 2 pontos de diferença.
 */
export function resolveGame(game: Game, format: MatchFormat): TeamSide | null {
  const { pointsA, pointsB } = game;
  const diff = Math.abs(pointsA - pointsB);

  if (game.type === 'regular') {
    // No-Ad: o primeiro time a atingir 4 pontos vence — sem exigir vantagem de 2.
    // Como o game é reavaliado a cada ponto, o único caminho até pointsX=4 com o
    // adversário em 3 é vindo de 3x3 (40x40), então esta condição já implementa
    // corretamente o ponto decisivo do 40x40 sem nunca passar por "Advantage".
    if (pointsA >= 4 || pointsB >= 4) {
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

/**
 * Converte pontos brutos de game regular para exibição (uso opcional pela UI).
 * Beach Tennis não usa Advantage: o único estado empatado possível é 40x40 (3x3),
 * já que o game é encerrado imediatamente no ponto seguinte (No-Ad). Por isso não
 * existe rótulo de "Vantagem" — apenas 0/15/30/40 e o empate 40x40.
 */
export function toDisplayScore(pointsA: number, pointsB: number): string {
  const labels = ['0', '15', '30', '40'];
  const a = labels[Math.min(pointsA, 3)] ?? '40';
  const b = labels[Math.min(pointsB, 3)] ?? '40';
  return `${a}:${b}`;
}
