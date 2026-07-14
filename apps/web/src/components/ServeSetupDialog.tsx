'use client';

import { useState } from 'react';
import type { Match, TeamSide } from '@beach-tennis-scout/domain';
import styles from './ServeSetupDialog.module.css';

export interface ServeSetupResult {
  teamAFirstServerId: string;
  teamBFirstServerId: string;
  firstServingTeam: TeamSide;
}

interface Props {
  match: Match;
  title: string;
  subtitle?: string;
  onConfirm: (result: ServeSetupResult) => void;
}

/**
 * Pergunta feita apenas no início de cada set (1º set, 2º set e Super
 * Tie-Break): quem saca pela Dupla A, quem saca pela Dupla B, e qual dupla
 * saca primeiro. A partir daí o domínio (`configureSetServer` +
 * `pointBasedServer`/rotação de game) calcula sozinho o resto do set —
 * nenhuma pergunta adicional é feita a cada game.
 */
export default function ServeSetupDialog({ match, title, subtitle, onConfirm }: Props) {
  const [teamAServerId, setTeamAServerId] = useState(match.teamA.players[0]!.id);
  const [teamBServerId, setTeamBServerId] = useState(match.teamB.players[0]!.id);
  const [firstServingTeam, setFirstServingTeam] = useState<TeamSide>(match.servingTeam);

  return (
    <div className={styles.overlay}>
      <p className={styles.title}>{title}</p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <div className={styles.group}>
        <div className={styles.groupLabel} style={{ color: 'var(--color-a)' }}>
          Quem saca primeiro pela Dupla A?
        </div>
        <div className={styles.optionRow}>
          {match.teamA.players.map((p) => (
            <button
              key={p.id}
              className={`${styles.optionBtn} ${teamAServerId === p.id ? styles.optionBtnActiveA : ''}`}
              onClick={() => setTeamAServerId(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupLabel} style={{ color: 'var(--color-b)' }}>
          Quem saca primeiro pela Dupla B?
        </div>
        <div className={styles.optionRow}>
          {match.teamB.players.map((p) => (
            <button
              key={p.id}
              className={`${styles.optionBtn} ${teamBServerId === p.id ? styles.optionBtnActiveB : ''}`}
              onClick={() => setTeamBServerId(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupLabel}>Qual dupla fará o primeiro saque do set?</div>
        <div className={styles.optionRow}>
          <button
            className={`${styles.optionBtn} ${firstServingTeam === 'A' ? styles.optionBtnActiveA : ''}`}
            onClick={() => setFirstServingTeam('A')}
          >
            Dupla A
          </button>
          <button
            className={`${styles.optionBtn} ${firstServingTeam === 'B' ? styles.optionBtnActiveB : ''}`}
            onClick={() => setFirstServingTeam('B')}
          >
            Dupla B
          </button>
        </div>
      </div>

      <button
        className={styles.confirmBtn}
        onClick={() =>
          onConfirm({
            teamAFirstServerId: teamAServerId,
            teamBFirstServerId: teamBServerId,
            firstServingTeam,
          })
        }
      >
        Confirmar
      </button>
    </div>
  );
}
