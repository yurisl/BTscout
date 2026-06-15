'use client';

import { useState } from 'react';
import type { Match, Player, PointSubtype, PointType, TeamSide } from '@beach-tennis-scout/domain';
import styles from './PointRegistration.module.css';

interface PointResult {
  winnerSide: TeamSide;
  playerId: string;
  pointType: PointType;
  pointSubtype: PointSubtype;
  isFirstServe: boolean;
}

interface Props {
  match: Match;
  onPoint: (result: PointResult) => void;
}

const WINNERS: { subtype: PointSubtype; label: string }[] = [
  { subtype: 'WINNER_DIR', label: 'Dir' },
  { subtype: 'WINNER_ESQ', label: 'Esq' },
  { subtype: 'WINNER_PAR', label: 'Paralela' },
  { subtype: 'WINNER_CRU', label: 'Cruzada' },
  { subtype: 'LOB', label: 'Lob' },
  { subtype: 'SMASH', label: 'Smash' },
  { subtype: 'DROP', label: 'Drop' },
  { subtype: 'ACE', label: 'Ace' },
];

// Beach tennis: apenas 1 saque. Sem dupla falta.
const ERRORS: { subtype: PointSubtype; label: string }[] = [
  { subtype: 'ERRO_DIR', label: 'Direita' },
  { subtype: 'ERRO_ESQ', label: 'Esquerda' },
  { subtype: 'ERRO_LOB', label: 'Lob' },
  { subtype: 'ERRO_SMASH', label: 'Smash' },
  { subtype: 'ERRO_SAQUE', label: 'Erro de Saque' },
];

const FORCED: { subtype: PointSubtype; label: string }[] = [
  { subtype: 'FORCOU_ERRO', label: 'Forçou Erro' },
];

const WINNER_SET = new Set(WINNERS.map((w) => w.subtype));
const ERROR_SET = new Set(ERRORS.map((e) => e.subtype));

function subtypeToPointType(sub: PointSubtype): PointType {
  if (WINNER_SET.has(sub)) return 'winner';
  if (ERROR_SET.has(sub)) return 'error';
  return 'forced_error';
}

function playerTeam(player: Player, match: Match): TeamSide {
  return match.teamA.players.some((p) => p.id === player.id) ? 'A' : 'B';
}

function winnerSideFromAction(player: Player, pointType: PointType, match: Match): TeamSide {
  const side = playerTeam(player, match);
  if (pointType === 'error') return side === 'A' ? 'B' : 'A';
  return side;
}

export default function PointRegistration({ match, onPoint }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const isServer = (player: Player) => player.id === match.servingPlayerId;

  function handleSubtype(subtype: PointSubtype) {
    if (!selectedPlayer) return;
    const pointType = subtypeToPointType(subtype);
    const winnerSide = winnerSideFromAction(selectedPlayer, pointType, match);
    // Beach tennis: único saque por ponto
    onPoint({ winnerSide, playerId: selectedPlayer.id, pointType, pointSubtype: subtype, isFirstServe: true });
    setSelectedPlayer(null);
  }

  return (
    <div className={styles.root}>
      {!selectedPlayer ? (
        /* Passo 1 — escolher jogador */
        <div className={styles.playerGrid}>
          <div className={styles.teamSection}>
            <div className={styles.teamLabel} style={{ color: 'var(--color-a)' }}>Time A</div>
            {match.teamA.players.map((p) => (
              <button
                key={p.id}
                className={`${styles.playerBtn} ${styles.playerBtnA} ${isServer(p) ? styles.serving : ''}`}
                onClick={() => setSelectedPlayer(p)}
              >
                {p.name}
                {isServer(p) && <span className={styles.servingBadge}>saque</span>}
              </button>
            ))}
          </div>
          <div className={styles.teamSection}>
            <div className={styles.teamLabel} style={{ color: 'var(--color-b)' }}>Time B</div>
            {match.teamB.players.map((p) => (
              <button
                key={p.id}
                className={`${styles.playerBtn} ${styles.playerBtnB} ${isServer(p) ? styles.serving : ''}`}
                onClick={() => setSelectedPlayer(p)}
              >
                {p.name}
                {isServer(p) && <span className={styles.servingBadge}>saque</span>}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Passo 2 — escolher subtipo */
        <div className={styles.subtypePanel}>
          <div className={styles.selectedPlayer}>
            <span
              className={styles.selectedDot}
              style={{
                background:
                  playerTeam(selectedPlayer, match) === 'A'
                    ? 'var(--color-a)'
                    : 'var(--color-b)',
              }}
            />
            <strong>{selectedPlayer.name}</strong>
            {isServer(selectedPlayer) && (
              <span className={styles.serverTag}>sacando</span>
            )}
            <button className={styles.cancel} onClick={() => setSelectedPlayer(null)}>
              × voltar
            </button>
          </div>

          <div className={styles.group}>
            <div className={styles.groupLabel}>Winners</div>
            <div className={styles.btnGrid}>
              {WINNERS.map(({ subtype, label }) => {
                const isAce = subtype === 'ACE';
                const aceBlocked = isAce && !isServer(selectedPlayer);
                return (
                  <button
                    key={subtype}
                    className={`${styles.subBtn} ${styles.subBtnWin} ${aceBlocked ? styles.subBtnDisabled : ''}`}
                    onClick={() => !aceBlocked && handleSubtype(subtype)}
                    disabled={aceBlocked}
                    title={aceBlocked ? 'Ace só é possível para quem está sacando' : undefined}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.groupLabel}>Erros</div>
            <div className={styles.btnGrid}>
              {ERRORS.map(({ subtype, label }) => (
                <button
                  key={subtype}
                  className={`${styles.subBtn} ${styles.subBtnErr}`}
                  onClick={() => handleSubtype(subtype)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.btnGrid}>
              {FORCED.map(({ subtype, label }) => (
                <button
                  key={subtype}
                  className={`${styles.subBtn} ${styles.subBtnForced}`}
                  onClick={() => handleSubtype(subtype)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
