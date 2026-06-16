'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Match } from '@beach-tennis-scout/domain';
import { loadMatches, deleteMatch } from '@/lib/storage';
import AdBanner from '@/components/AdBanner';
import styles from './home.module.css';

function teamLabel(match: Match, side: 'A' | 'B'): string {
  const team = side === 'A' ? match.teamA : match.teamB;
  return team.players.map((p) => p.name).join(' / ');
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

export default function HomePage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [comparing, setComparing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMatches(loadMatches().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }, []);

  function refresh() {
    setMatches(loadMatches().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }

  function handleDelete(id: string) {
    deleteMatch(id);
    setConfirmDelete(null);
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
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
          + Nova Partida
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
                confirmDelete={confirmDelete}
                onDeleteRequest={() => setConfirmDelete(m.id)}
                onDeleteConfirm={() => handleDelete(m.id)}
                onDeleteCancel={() => setConfirmDelete(null)}
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
            {finished.flatMap((m, i) => {
              const card = (
                <MatchCard
                  key={m.id}
                  match={m}
                  href={`/partida/${m.id}/resumo`}
                  comparing={comparing}
                  selected={selected.has(m.id)}
                  confirmDelete={confirmDelete}
                  onDeleteRequest={() => setConfirmDelete(m.id)}
                  onDeleteConfirm={() => handleDelete(m.id)}
                  onDeleteCancel={() => setConfirmDelete(null)}
                  onToggle={() => toggleSelect(m.id)}
                />
              );
              const showAd = (i + 1) % 5 === 0 && i < finished.length - 1;
              return showAd
                ? [card, <AdBanner key={`ad04-${i}`} slotId="AD-04" size="banner" />]
                : [card];
            })}
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

      {/* AD-01 — Home rodapé, sempre visível */}
      <div className={styles.adFooter}>
        <AdBanner slotId="AD-01" size="banner" />
      </div>
    </div>
  );
}

/* ─── MatchCard ─────────────────────────────────────────────────────────── */

function MatchCard({
  match,
  href,
  comparing,
  selected,
  confirmDelete,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  onToggle,
}: {
  match: Match;
  href: string;
  comparing: boolean;
  selected: boolean;
  confirmDelete: string | null;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onToggle: () => void;
}) {
  const isConfirming = confirmDelete === match.id;
  const isFinished = match.status === 'finished';

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

      {/* Delete controls (finished matches only, not in compare mode) */}
      {isFinished && !comparing && (
        <div className={styles.deleteArea}>
          {isConfirming ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmLabel}>Excluir?</span>
              <button className={styles.confirmYes} onClick={(e) => { e.preventDefault(); onDeleteConfirm(); }}>Sim</button>
              <button className={styles.confirmNo} onClick={(e) => { e.preventDefault(); onDeleteCancel(); }}>Não</button>
            </div>
          ) : (
            <button
              className={styles.deleteBtn}
              onClick={(e) => { e.preventDefault(); onDeleteRequest(); }}
              title="Excluir partida"
            >
              🗑
            </button>
          )}
        </div>
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
