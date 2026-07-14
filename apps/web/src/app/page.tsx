'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import type { Match } from '@beach-tennis-scout/domain';
import { loadMatches, saveMatch, deleteMatch } from '@/lib/storage';
import MatchMenu from '@/components/MatchMenu';
import DeleteMatchModal from '@/components/DeleteMatchModal';
import Snackbar from '@/components/Snackbar';
import styles from './home.module.css';

function teamLabel(match: Match, side: 'A' | 'B'): string {
  const team = side === 'A' ? match.teamA : match.teamB;
  return team.players.map((p) => p.name).join(' / ');
}

function matchLabel(match: Match): string {
  return `${teamLabel(match, 'A')} vs ${teamLabel(match, 'B')}`;
}

function setsScore(match: Match): string {
  const wins = { A: 0, B: 0 };
  for (const s of match.sets) {
    if (s.winner) wins[s.winner]++;
  }
  return `${wins.A} × ${wins.B}`;
}

function matchDate(match: Match): string {
  return match.createdAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

const RESUME_ASKED_KEY = 'bts:resume-asked';

export default function HomePage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Match | null>(null);
  const [deletedMatch, setDeletedMatch] = useState<Match | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [resumePrompt, setResumePrompt] = useState<Match | null>(null);

  useEffect(() => {
    const all = loadMatches().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setMatches(all);

    // Ao reabrir o navegador (nova sessão), pergunta uma única vez se o usuário
    // quer continuar a partida em andamento mais recente.
    const alreadyAsked = typeof window !== 'undefined' && sessionStorage.getItem(RESUME_ASKED_KEY);
    if (!alreadyAsked) {
      const live = all.find((m) => m.status === 'in_progress');
      if (live) setResumePrompt(live);
      sessionStorage.setItem(RESUME_ASKED_KEY, '1');
    }
  }, []);

  function refresh() {
    setMatches(loadMatches().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }

  function handleDeleteConfirm() {
    if (!pendingDelete) return;
    deleteMatch(pendingDelete.id);
    setSelected((prev) => { const s = new Set(prev); s.delete(pendingDelete.id); return s; });
    setDeletedMatch(pendingDelete);
    setPendingDelete(null);
    setSnackbarOpen(true);
    refresh();
  }

  function handleUndoDelete() {
    if (!deletedMatch) return;
    saveMatch(deletedMatch);
    setDeletedMatch(null);
    setSnackbarOpen(false);
    refresh();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }

  function handleCompare() {
    const ids = Array.from(selected).join(',');
    router.push(`/comparar?ids=${ids}`);
  }

  const live = matches.filter((m) => m.status === 'in_progress');
  const finished = matches.filter((m) => m.status === 'finished');

  return (
    <div className="page">
      <header className={styles.header}>
        <div>
          <h1>Beach Tennis Scout</h1>
          <p className={styles.subtitle}>Registro ponto a ponto</p>
        </div>
        <Link href="/partida/nova" className={`btn btn-primary ${styles.newBtn}`}>
          <Plus size={18} strokeWidth={2.5} /> Nova Partida
        </Link>
      </header>

      {matches.length === 0 && (
        <div className={styles.empty}>
          <p>Nenhuma partida registrada.</p>
          <Link href="/partida/nova" className={`btn btn-primary ${styles.emptyBtn}`}>
            Iniciar primeira partida
          </Link>
        </div>
      )}

      {/* Banner de partida pausada/em andamento */}
      {live.length > 0 && (
        <div className={styles.resumeBanner}>
          <div>
            <p className={styles.resumeBannerTitle}>Existe uma partida em andamento</p>
            <p className={styles.resumeBannerSubtitle}>
              {teamLabel(live[0]!, 'A')} vs {teamLabel(live[0]!, 'B')}
            </p>
          </div>
          <Link href={`/partida/${live[0]!.id}`} className={`btn btn-primary ${styles.resumeBannerBtn}`}>
            Continuar partida
          </Link>
        </div>
      )}

      {/* Em andamento */}
      {live.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Em andamento</h2>
          <div className="stack">
            {live.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                href={`/partida/${m.id}`}
                comparing={false}
                selected={false}
                onDeleteRequest={() => setPendingDelete(m)}
                onToggle={() => {}}
              />
            ))}
          </div>
        </section>
      )}

      {/* Histórico */}
      {finished.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Histórico</h2>
            <button
              className={`${styles.compareToggle} ${comparing ? styles.compareToggleActive : ''}`}
              onClick={() => { setComparing((v) => !v); setSelected(new Set()); }}
            >
              {comparing ? '× Cancelar' : 'Comparar'}
            </button>
          </div>

          <div className="stack" style={{ marginTop: 10 }}>
            {finished.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                href={`/partida/${m.id}/resumo`}
                comparing={comparing}
                selected={selected.has(m.id)}
                onDeleteRequest={() => setPendingDelete(m)}
                onToggle={() => toggleSelect(m.id)}
              />
            ))}
          </div>

          {comparing && (
            <div className={styles.compareBar}>
              <span className={styles.compareCount}>
                {selected.size} partida{selected.size !== 1 ? 's' : ''} selecionada{selected.size !== 1 ? 's' : ''}
              </span>
              <button
                className={`btn btn-primary ${styles.compareBtn}`}
                disabled={selected.size < 2}
                onClick={handleCompare}
              >
                Comparar {selected.size >= 2 ? `(${selected.size})` : ''}
              </button>
            </div>
          )}
        </section>
      )}

      {resumePrompt && (
        <div className={styles.resumeDialogBackdrop}>
          <div className={styles.resumeDialog}>
            <p className={styles.resumeDialogText}>Deseja continuar a partida em andamento?</p>
            <p className={styles.resumeDialogSubtitle}>
              {teamLabel(resumePrompt, 'A')} vs {teamLabel(resumePrompt, 'B')}
            </p>
            <div className={styles.resumeDialogActions}>
              <button
                className="btn btn-outline"
                onClick={() => setResumePrompt(null)}
              >
                Agora não
              </button>
              <button
                className="btn btn-primary"
                onClick={() => router.push(`/partida/${resumePrompt.id}`)}
              >
                Continuar partida
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteMatchModal
        open={!!pendingDelete}
        matchLabel={pendingDelete ? matchLabel(pendingDelete) : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />

      <Snackbar
        open={snackbarOpen}
        message="Partida excluída."
        actionLabel="DESFAZER"
        onAction={handleUndoDelete}
        onClose={() => { setSnackbarOpen(false); setDeletedMatch(null); }}
      />
    </div>
  );
}

/* ─── MatchCard ─────────────────────────────────────────────────────────── */

function MatchCard({
  match,
  href,
  comparing,
  selected,
  onDeleteRequest,
  onToggle,
}: {
  match: Match;
  href: string;
  comparing: boolean;
  selected: boolean;
  onDeleteRequest: () => void;
  onToggle: () => void;
}) {
  const inner = (
    <div className={`${styles.matchCard} ${selected ? styles.matchCardSelected : ''}`}>
      {/* Checkbox (compare mode) */}
      {comparing && (
        <div className={`${styles.checkbox} ${selected ? styles.checkboxChecked : ''}`}>
          {selected && '✓'}
        </div>
      )}

      <div className={styles.matchBody}>
        <div className={styles.matchTeams}>
          <span className={styles.teamA}>{teamLabel(match, 'A')}</span>
          <span className={styles.vs}>vs</span>
          <span className={styles.teamB}>{teamLabel(match, 'B')}</span>
        </div>
        <div className={styles.matchMeta}>
          <span className={styles.score}>{setsScore(match)}</span>
          <span className={styles.matchDate}>{matchDate(match)}</span>
        </div>
        {match.context?.tournamentName && (
          <p className={styles.tournament}>{match.context.tournamentName}</p>
        )}
      </div>

      {!comparing && (
        <MatchMenu
          status={match.status}
          continueHref={`/partida/${match.id}`}
          statsHref={`/partida/${match.id}/resumo`}
          onDeleteRequest={onDeleteRequest}
        />
      )}
    </div>
  );

  if (comparing) {
    return (
      <div onClick={onToggle} style={{ cursor: 'pointer' }}>
        {inner}
      </div>
    );
  }

  return <Link href={href}>{inner}</Link>;
}
