'use client';

import { useState } from 'react';
import type { Match, TeamSide } from '@beach-tennis-scout/domain';
import styles from './ServeSetupModal.module.css';

export interface InitialServeResult {
  firstServingTeam: TeamSide;
  firstServerId: string;
}

interface Props {
  match: Match;
  isSuperTiebreak: boolean;
  onConfirm: (result: InitialServeResult) => void;
}

/**
 * Modal exibido antes do 1º ponto de cada set — inclusive em simples, que
 * reinicia esse fluxo a cada set assim como duplas. Em duplas são 2 toques
 * (dupla → jogador), cada um avançando automaticamente para o próximo
 * passo. Em simples só existe 1 jogador possível por lado, então 1 toque
 * (dupla) já resolve tudo — `configureFirstServer` preenche as duas
 * rotações de uma vez.
 */
export default function InitialServeDialog({ match, isSuperTiebreak, onConfirm }: Props) {
  const [team, setTeam] = useState<TeamSide | null>(null);
  const isSingles = match.type === 'singles';

  const teamLabel = isSuperTiebreak ? 'Quem fará o primeiro saque?' : 'Quem iniciará o saque neste set?';
  const playerLabel = isSuperTiebreak
    ? 'Qual jogador fará o primeiro saque?'
    : 'Qual jogador da dupla iniciará sacando?';

  function chooseTeam(side: TeamSide) {
    if (isSingles) {
      const roster = side === 'A' ? match.teamA.players : match.teamB.players;
      onConfirm({ firstServingTeam: side, firstServerId: roster[0]!.id });
      return;
    }
    setTeam(side);
  }

  function choosePlayer(playerId: string) {
    if (!team) return;
    onConfirm({ firstServingTeam: team, firstServerId: playerId });
  }

  const roster = team ? (team === 'A' ? match.teamA.players : match.teamB.players) : [];

  return (
    <div className={styles.backdrop}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label={team ? playerLabel : teamLabel}>
        {!team ? (
          <>
            <p className={styles.title}>{teamLabel}</p>
            <div className={styles.optionRow}>
              <button className={`${styles.optionBtn} ${styles.optionBtnA}`} onClick={() => chooseTeam('A')}>
                {isSingles ? 'Time A' : 'Dupla A'}
              </button>
              <button className={`${styles.optionBtn} ${styles.optionBtnB}`} onClick={() => chooseTeam('B')}>
                {isSingles ? 'Time B' : 'Dupla B'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.title}>{playerLabel}</p>
            <div className={styles.optionRow}>
              {roster.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.optionBtn} ${team === 'A' ? styles.optionBtnA : styles.optionBtnB}`}
                  onClick={() => choosePlayer(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
