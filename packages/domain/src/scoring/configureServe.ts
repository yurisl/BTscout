import type { Match } from '../entities/Match.js';
import type { TeamSide } from '../entities/Team.js';
import type { SetServerConfig } from '../entities/ServeConfig.js';

export interface ConfigureSetServerInput {
  /** Jogador que iniciará sacando pela Dupla A neste set */
  teamAFirstServerId: string;
  /** Jogador que iniciará sacando pela Dupla B neste set */
  teamBFirstServerId: string;
  /** Dupla que fará o primeiro saque do set */
  firstServingTeam: TeamSide;
}

/**
 * Configura o sacador inicial do set atual. Deve ser chamada uma única vez,
 * no início de cada set (1º set, 2º set ou Super Tie-Break), antes de
 * qualquer ponto ser registrado nesse set — `applyPoint` rejeita eventos
 * enquanto o set não estiver configurado.
 *
 * A partir dessa configuração, o engine deriva sozinho a rotação de saque
 * pelo resto do set inteiro (games regulares, tie-break em 6x6 e Super
 * Tie-Break) — a interface não pergunta novamente a cada game.
 */
export function configureSetServer(match: Match, input: ConfigureSetServerInput): Match {
  const set = match.sets[match.currentSetIndex];
  if (!set) throw new Error('Nenhum set em andamento');
  if (set.status !== 'in_progress') throw new Error('Set atual já encerrado');

  const hasPoints = match.pointEvents.some((e) => e.setId === set.id);
  if (hasPoints) {
    throw new Error('Não é possível configurar o sacador: este set já possui pontos registrados');
  }

  if (!match.teamA.players.some((p) => p.id === input.teamAFirstServerId)) {
    throw new Error(`Jogador ${input.teamAFirstServerId} não pertence à Dupla A`);
  }
  if (!match.teamB.players.some((p) => p.id === input.teamBFirstServerId)) {
    throw new Error(`Jogador ${input.teamBFirstServerId} não pertence à Dupla B`);
  }

  const otherA = match.teamA.players.find((p) => p.id !== input.teamAFirstServerId)?.id
    ?? input.teamAFirstServerId;
  const otherB = match.teamB.players.find((p) => p.id !== input.teamBFirstServerId)?.id
    ?? input.teamBFirstServerId;

  const config: SetServerConfig = {
    teamARotation: [input.teamAFirstServerId, otherA],
    teamBRotation: [input.teamBFirstServerId, otherB],
    firstServingTeam: input.firstServingTeam,
  };

  const next: Match = structuredClone(match);
  const nextSet = next.sets[next.currentSetIndex]!;
  nextSet.serverConfig = config;

  next.servingTeam = config.firstServingTeam;
  next.servingPlayerId =
    config.firstServingTeam === 'A' ? config.teamARotation[0] : config.teamBRotation[0];

  if (nextSet.type === 'regular') {
    const game = nextSet.games[0];
    if (game) {
      game.servingTeam = next.servingTeam;
      game.servingPlayerId = next.servingPlayerId;
    }
  }

  return next;
}
