'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChartColumnIncreasing, Pause, Undo2 } from 'lucide-react';
import { applyPoint, undoPoint, configureFirstServer, configureNextServer } from '@beach-tennis-scout/domain';
import type { Match, TransitionType, TeamSide } from '@beach-tennis-scout/domain';
import { loadMatch, saveMatch } from '@/lib/storage';
import Scoreboard from '@/components/Scoreboard';
import PointRegistration from '@/components/PointRegistration';
import StatsDrawer from '@/components/StatsDrawer';
import MatchStats from '@/components/MatchStats';
import InitialServeDialog, { type InitialServeResult } from '@/components/InitialServeDialog';
import NextServerDialog from '@/components/NextServerDialog';
import styles from './match.module.css';

const TRANSITION_LABELS: Record<TransitionType, string | null> = {
  point_scored: null,
  serve_changed: null,
  game_won: 'Game!',
  tiebreak_started: 'Tie-Break!',
  super_tiebreak_started: 'Super Tie-Break!',
  set_won: 'Set!',
  match_won: 'Partida encerrada!',
  side_change: 'Troca de Lado!',
};

/**
 * O set atual ainda não tem NENHUM sacador configurado (início de set — 1º
 * set, 2º set ou Super Tie-Break). Vale para simples e duplas: todo set
 * reinicia o fluxo de configuração do zero. Bloqueia o registro de pontos
 * até a resposta ser dada; ver `configureFirstServer` no domínio.
 */
function needsInitialServeSetup(match: Match): boolean {
  if (match.status !== 'in_progress') return false;
  const set = match.sets[match.currentSetIndex];
  return !!set && set.serverConfig === null;
}

/**
 * O 1º sacador do set já foi definido, mas a dupla adversária ainda não
 * (só ocorre em duplas — em simples `configureFirstServer` já preenche as
 * duas rotações de uma vez). Bloqueia o próximo ponto até a resposta ser
 * dada; ver `configureNextServer` no domínio.
 */
function needsNextServerSetup(match: Match): boolean {
  if (match.status !== 'in_progress') return false;
  const set = match.sets[match.currentSetIndex];
  return !!set && set.serverConfig !== null && match.servingPlayerId === null;
}

/** Dupla cuja rotação ainda não foi definida neste set — alvo do NextServerDialog. */
function teamAwaitingConfig(match: Match): TeamSide {
  const config = match.sets[match.currentSetIndex]!.serverConfig!;
  return config.teamARotation === null ? 'A' : 'B';
}

export default function MatchScreen({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);

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
        applyAndSave(result.match);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao registrar ponto');
      }
    },
    [match],
  );

  const handleUndo = useCallback(() => {
    if (!match) return;
    setError(null);
    try {
      const result = undoPoint(match);
      applyAndSave(result.match);
      setToast(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nada para desfazer');
    }
  }, [match]);

  const handleInitialServe = useCallback(
    (result: InitialServeResult) => {
      if (!match) return;
      setError(null);
      try {
        const updated = configureFirstServer(match, result);
        applyAndSave(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao configurar o sacador');
      }
    },
    [match],
  );

  const handleNextServer = useCallback(
    (serverId: string) => {
      if (!match) return;
      setError(null);
      try {
        const updated = configureNextServer(match, { serverId });
        applyAndSave(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao configurar o sacador');
      }
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

  const currentSet = match.sets[match.currentSetIndex];
  const isSuperTiebreak = currentSet?.type === 'super_tiebreak';
  const initialServeNeeded = needsInitialServeSetup(match);
  const nextServerNeeded = !initialServeNeeded && needsNextServerSetup(match);

  return (
    <div className={styles.screen}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.topBar}>
        <Link href="/" className={styles.back}>← Início</Link>
        <span className={styles.matchType}>
          {match.type === 'doubles' ? 'Duplas' : 'Simples'}
        </span>
        <div className={styles.topBarActions}>
          <button className={styles.statsBtn} onClick={() => setStatsOpen(true)}>
            <ChartColumnIncreasing size={18} strokeWidth={2} /> Estatísticas
          </button>
          {match.status === 'in_progress' && (
            <>
              <Link href="/" className={styles.pauseBtn}>
                <Pause size={18} strokeWidth={2} /> Pausar
              </Link>
              <button
                className={styles.undoBtn}
                onClick={handleUndo}
                disabled={match.pointEvents.length === 0}
              >
                <Undo2 size={18} strokeWidth={2} /> Desfazer
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.scoreSection}>
        <Scoreboard match={match} />
      </div>

      <StatsDrawer open={statsOpen} title="Estatísticas" onClose={() => setStatsOpen(false)}>
        <MatchStats match={match} />
      </StatsDrawer>

      {error && <p className={styles.error}>{error}</p>}

      {match.status === 'in_progress' ? (
        <div className={styles.registrationSection}>
          <PointRegistration match={match} onPoint={handlePoint} />
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

      {initialServeNeeded && (
        <InitialServeDialog match={match} isSuperTiebreak={isSuperTiebreak} onConfirm={handleInitialServe} />
      )}
      {nextServerNeeded && (
        <NextServerDialog
          match={match}
          team={teamAwaitingConfig(match)}
          isSuperTiebreak={isSuperTiebreak}
          onConfirm={handleNextServer}
        />
      )}
    </div>
  );
}
