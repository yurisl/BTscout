import type { TeamSide } from './Team.js';

/**
 * Configuração de saque de um set, definida uma única vez no início do set
 * (1º set, 2º set ou Super Tie-Break) e usada pelo engine para calcular
 * automaticamente quem saca em cada game/ponto seguinte, sem perguntar
 * novamente ao usuário durante o set.
 */
export interface SetServerConfig {
  /** [sacador designado, outro jogador] da Dupla A — ordem de rotação dentro do set */
  teamARotation: [string, string];
  /** [sacador designado, outro jogador] da Dupla B — ordem de rotação dentro do set */
  teamBRotation: [string, string];
  /** Dupla que saca o primeiro ponto/game deste set */
  firstServingTeam: TeamSide;
}
