'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { applyPoint, undoPoint } from '@beach-tennis-scout/domain';
import type { Match, TransitionType } from '@beach-tennis-scout/domain';
import { loadMatch, saveMatch } from '@/lib/storage';
import Scoreboard from '@/components/Scoreboard';
import PointRegistration from '@/components/PointRegistration';
import AdBanner from '@/components/AdBanner';
import styles from './match.module.css';

const TRANSITION_LABELS: Record<TransitionType, string | null> = {
  point_scored: null,
  serve_changed: null,
  game_won: 'Game!',
  tiebreak_started: 'Tie-Break!',
  super_tiebreak_started: 'Super Tie-Break!',
  set_won: 'Set!',
  match_won: 'Partida encerrada!',
};

function needsServerPick(match: Match, transitions: TransitionType[]): boolean {
  // Duplas: após game regular (não entra em tiebreak/supertiebreak), partida em aberto
  return (
    match.type === 'doubles' &&
    match.status === 'in_progress' &&
    transitions.includes('game_won') &&
    !transitions.includes('tiebreak_started') &&
    !transitions.includes('super_tiebreak_started') &&
    !transitions.includes('match_won')
  );
}

function autoSetServer(match: Match): Match {
  // Singles: após game, o sacador é o único jogador do novo time
  const nextTeam = match.servingTeam === 'A' ? match.teamA : match.teamB;
  const nextPlayer = nextTeam.players[0];
  if (!nextPlayer || match.servingPlayerId === nextPlayer.id) return match;
  return { ...match, servingPlayerId: nextPlayer.id };
}

export default function MatchScreen({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [choosingServer, setChoosingServer] = useState(false);
  const [showIntervalAd, setShowIntervalAd] = useState(false);

  useEffect(() => {
    setMatch(loadMatch(matchId) ?? null);
  }, [matchId]);

  function showToast(transitions: TransitionType[]) {
    const label = transitions
      .map((t) => TRANSITION_LABELS[t])
      .filter(Boolean)
      .at(-1);
    if (!label) return;
    setToast(label);
    setTimeout(() => setToast(null), 1800);
  }

  function applyAndSave(updated: Match) {
    saveMatch(updated);
    setMatch(updated);
  }

  const handlePoint = useCallback(
    (input: Parameters<typeof applyPoint>[1]) => {
      if (!match) return;
      setError(null);
      try {
        const result = applyPoint(match, input);
        showToast(result.transitions);

        const isSetInterval =
          result.transitions.includes('set_won') &&
          !result.transitions.includes('match_won');

        if (result.match.type === 'singles' && result.transitions.includes('game_won')) {
          // Singles: auto-deduz sacador do próximo game
          applyAndSave(autoSetServer(result.match));
        } else if (needsServerPick(result.match, result.transitions)) {
          // Duplas: perguntar quem saca
          applyAndSave(result.match);
          setChoosingServer(true);
        } else {
          applyAndSave(result.match);
        }

        if (isSetInterval) setShowIntervalAd(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao registrar ponto');
      }
    },
    [match],
  );

  const handleUndo = useCallback(() => {
    if (!match) return;
    setError(null);
    setChoosingServer(false);
    setShowIntervalAd(false);
    try {
      const result = undoPoint(match);
      applyAndSave(result.match);
      setToast(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nada para desfazer');
    }
  }, [match]);

  const handleServerPick = useCallback(
    (playerId: string) => {
      if (!match) return;
      const updated = { ...match, servingPlayerId: playerId };
      applyAndSave(updated);
      setChoosingServer(false);
    },
    [match],
  );

  if (!match) {
    return (
      <div className="page">
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 48 }}>
          Partida não encontrada.
        </p>
        <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          Voltar ao início
        </Link>
      </div>
    );
  }

  const servingTeam = match.servingTeam === 'A' ? match.teamA : match.teamB;
  const servingTeamColor = match.servingTeam === 'A' ? 'var(--color-a)' : 'var(--color-b)';
  const servingTeamName = `Time ${match.servingTeam}`;

  return (
    <div className={styles.screen}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.topBar}>
        <Link href="/" className={styles.back}>← Início</Link>
        <span className={styles.matchType}>
          {match.type === 'doubles' ? 'Duplas' : 'Simples'}
        </span>
        {match.status === 'in_progress' && (
          <button
            className={styles.undoBtn}
            onClick={handleUndo}
            disabled={match.pointEvents.length === 0 && !choosingServer}
          >
            ↩ Desfazer
          </button>
        )}
      </div>

      <div className={styles.scoreSection}>
        <Scoreboard match={match} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {match.status === 'in_progress' ? (
        <div className={styles.registrationSection}>
          {showIntervalAd ? (
            /* AD-02 — Intervalo entre sets (único momento aceitável dentro da partida) */
            <div className={styles.intervalPanel}>
              <p className={styles.intervalTitle}>Intervalo entre Sets</p>
              <AdBanner slotId="AD-02" size="rectangle" />
              <button
                className={styles.intervalContinueBtn}
                onClick={() => setShowIntervalAd(false)}
              >
                Iniciar Próximo Set
              </button>
            </div>
          ) : choosingServer ? (
            /* Overlay: escolher sacador do próximo game */
            <div className={styles.serverPicker}>
              <p className={styles.serverPickerTitle}>
                Quem saca pelo{' '}
                <strong style={{ color: servingTeamColor }}>{servingTeamName}</strong>?
              </p>
              {servingTeam.players.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.serverPickerBtn} ${
                    match.servingTeam === 'A' ? styles.serverPickerBtnA : styles.serverPickerBtnB
                  }`}
                  onClick={() => handleServerPick(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          ) : (
            <PointRegistration match={match} onPoint={handlePoint} />
          )}
        </div>
      ) : (
        <div className={styles.finishedPanel}>
          <p className={styles.finishedText}>
            {match.winner === 'A'
              ? match.teamA.players.map((p) => p.name).join(' / ')
              : match.teamB.players.map((p) => p.name).join(' / ')}{' '}
            venceu a partida!
          </p>
          <Link href={`/partida/${match.id}/resumo`} className="btn btn-primary">
            Ver Estatísticas
          </Link>
          <Link href="/" className="btn btn-outline">
            Voltar ao Início
          </Link>
        </div>
      )}
    </div>
  );
}
