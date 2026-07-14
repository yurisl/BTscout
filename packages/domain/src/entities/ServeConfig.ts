import type { TeamSide } from './Team.js';

/**
 * Configuração de saque de um set, preenchida em duas etapas reativas — não
 * mais de uma vez só no início do set:
 *
 * 1. `configureFirstServer` — respondida antes do 1º ponto do set, define
 *    apenas a dupla e o jogador que sacam primeiro (preenche a rotação
 *    dessa dupla; a da adversária fica `null`).
 * 2. `configureNextServer` — respondida quando a dupla adversária está
 *    prestes a sacar pela primeira vez neste set (após o 1º game, em sets
 *    regulares; após o 1º ponto, no Super Tie-Break). Preenche a rotação
 *    da dupla adversária.
 *
 * Em simples não há ambiguidade de jogador (1 por dupla), então
 * `configureFirstServer` já preenche as duas rotações de imediato — a
 * segunda etapa nunca ocorre.
 */
export interface SetServerConfig {
  /** [sacador designado, outro jogador] da Dupla A — ordem de rotação dentro do set. `null` até ser configurada. */
  teamARotation: [string, string] | null;
  /** [sacador designado, outro jogador] da Dupla B — ordem de rotação dentro do set. `null` até ser configurada. */
  teamBRotation: [string, string] | null;
  /** Dupla que saca o primeiro ponto/game deste set */
  firstServingTeam: TeamSide;
}
