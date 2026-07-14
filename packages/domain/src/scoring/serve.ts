import type { TeamSide } from '../entities/Team.js';
import type { SetServerConfig } from '../entities/ServeConfig.js';

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

export interface PointBasedServer {
  servingTeam: TeamSide;
  /** `null` quando a dupla sacante ainda não teve seu sacador configurado (ver `configureNextServer`) */
  servingPlayerId: string | null;
}

/**
 * Ordem oficial de saque do tie-break/Super Tie-Break, jogador a jogador:
 * o 1º sacador da rotação saca apenas 1 ponto; a partir daí, cada jogador
 * saca exatamente 2 pontos, alternando entre as duplas E, dentro de cada
 * dupla, entre o sacador designado e o outro jogador.
 *
 * Exemplo (A começa, A1 designado, B1 designado):
 * A1(1) → B1(2) → A2(2) → B2(2) → A1(2) → B1(2) → ...
 *
 * Reaproveita `tiebreakServingTeam` para o time (nível dupla) e deriva o
 * jogador a partir da mesma sequência de "grupos de saque": como os grupos
 * alternam estritamente entre as duas duplas, a ocorrência (1ª, 2ª, 3ª...
 * vez que ESTA dupla sacou) é sempre `floor(serveGroup / 2) + 1` —
 * ocorrência ímpar usa o sacador designado, ocorrência par usa o outro.
 *
 * Se a dupla sacante ainda não tem rotação configurada (aguardando
 * `configureNextServer`), retorna `servingPlayerId: null` — cabe ao
 * chamador (applyPoint) bloquear o próximo ponto até a configuração.
 */
export function pointBasedServer(
  config: SetServerConfig,
  totalPointsPlayed: number,
): PointBasedServer {
  const servingTeam = tiebreakServingTeam(config.firstServingTeam, totalPointsPlayed);
  const rotation = servingTeam === 'A' ? config.teamARotation : config.teamBRotation;
  if (!rotation) return { servingTeam, servingPlayerId: null };
  const serveGroup = Math.floor((totalPointsPlayed + 1) / 2);
  const occurrence = Math.floor(serveGroup / 2) + 1;
  const servingPlayerId = occurrence % 2 === 1 ? rotation[0] : rotation[1];
  return { servingTeam, servingPlayerId };
}

/**
 * Quantos saques (incluindo o próximo a ser cobrado) restam para o sacador
 * atual antes da troca de saque, dado o total de pontos já disputados.
 * O 1º sacador da rotação cobra apenas 1 ponto; os demais cobram 2.
 */
export function remainingServes(totalPointsPlayed: number): number {
  if (totalPointsPlayed === 0) return 1;
  const posInBlock = (totalPointsPlayed - 1) % 2;
  return 2 - posInBlock;
}

/**
 * Total de pontos disputados (somando os dois lados) em que ocorre a
 * próxima troca de lado, a partir do total já disputado. Trocas ocorrem
 * quando a soma dos pontos atinge 1, 5, 9, 13, 17, 21... (a cada 4 pontos).
 */
export function nextSideChangeAt(totalPointsPlayed: number): number {
  let candidate = 1;
  while (candidate <= totalPointsPlayed) candidate += 4;
  return candidate;
}

/**
 * `true` quando o total de pontos disputados (após o ponto atual) é um
 * marco de troca de lado (1, 5, 9, 13, 17, 21...).
 */
export function isSideChangePoint(totalPointsPlayedAfter: number): boolean {
  return totalPointsPlayedAfter % 4 === 1;
}
