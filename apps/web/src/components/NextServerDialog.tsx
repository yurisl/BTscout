'use client';

import type { Match, TeamSide } from '@beach-tennis-scout/domain';
import styles from './ServeSetupModal.module.css';

interface Props {
  match: Match;
  team: TeamSide;
  isSuperTiebreak: boolean;
  onConfirm: (playerId: string) => void;
}

/**
 * Modal exibido uma única vez por set, no momento em que a dupla adversária
 * está prestes a sacar pela 1ª vez neste set (após o 1º game, em sets
 * regulares; após o 1º ponto, no Super Tie-Break). Um único toque escolhe
 * o jogador; a partir daí a rotação oficial já implementada
 * (`pointBasedServer`) segue sozinha pelo resto do set/Super Tie-Break —
 * este modal nunca reaparece na mesma etapa.
 */
export default function NextServerDialog({ match, team, isSuperTiebreak, onConfirm }: Props) {
  const roster = team === 'A' ? match.teamA.players : match.teamB.players;
  const title = isSuperTiebreak
    ? 'Qual jogador da dupla adversária fará os próximos dois saques?'
    : 'Quem sacará neste game?';

  return (
    <div className={styles.backdrop}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label={title}>
        <p className={styles.title}>{title}</p>
        <div className={styles.optionRow}>
          {roster.map((p) => (
            <button
              key={p.id}
              className={`${styles.optionBtn} ${team === 'A' ? styles.optionBtnA : styles.optionBtnB}`}
              onClick={() => onConfirm(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
