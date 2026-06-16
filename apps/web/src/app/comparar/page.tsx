'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { calculateStats } from '@beach-tennis-scout/domain';
import type { Match, TeamStats } from '@beach-tennis-scout/domain';
import { loadMatch } from '@/lib/storage';
import styles from './comparar.module.css';

function pct(num: number, den: number): string {
  if (den === 0) return '—';
  return `${Math.round((num / den) * 100)}%`;
}

function matchTitle(m: Match): string {
  const a = m.teamA.players.map((p) => p.name).join(' / ');
  const b = m.teamB.players.map((p) => p.name).join(' / ');
  return `${a} vs ${b}`;
}

function setsScore(m: Match): string {
  const wA = m.sets.filter((s) => s.winner === 'A').length;
  const wB = m.sets.filter((s) => s.winner === 'B').length;
  return `${wA} × ${wB}`;
}

function matchDate(m: Match): string {
  return m.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

interface TeamRow {
  label: string;
  fn: (s: TeamStats) => string;
}

const TEAM_ROWS: TeamRow[] = [
  { label: 'Pontos', fn: (s) => String(s.totalPoints) },
  { label: 'Winners', fn: (s) => String(s.totalWinners) },
  { label: 'Erros', fn: (s) => String(s.totalErrors) },
  { label: 'Forçou Erro', fn: (s) => String(s.totalForcedErrors) },
  { label: 'Aces', fn: (s) => String(s.serveStats.aces) },
  { label: 'Erros Saque', fn: (s) => String(s.errorsBySubtype.erroSaque) },
  { label: '% Saque In', fn: (s) => pct(s.serveStats.totalServesFirstIn, s.serveStats.totalServesFirst) },
  { label: '% Pts no Saque', fn: (s) => pct(s.serveStats.pointsWonOnFirstServe, s.serveStats.totalServesFirstIn) },
];

function MatchColumn({ match, teamSide }: { match: Match; teamSide: 'A' | 'B' }) {
  const stats = calculateStats(match);
  const ts = teamSide === 'A' ? stats.teamA : stats.teamB;
  const color = teamSide === 'A' ? 'var(--color-a)' : 'var(--color-b)';
  const players = teamSide === 'A' ? match.teamA.players : match.teamB.players;

  return (
    <div className={styles.col}>
      <div className={styles.colTeam} style={{ color }}>
        {players.map((p) => p.name).join(' / ')}
      </div>
      {TEAM_ROWS.map((row) => (
        <div key={row.label} className={styles.colCell}>
          {row.fn(ts)}
        </div>
      ))}
    </div>
  );
}

function MatchBlock({ match, index }: { match: Match; index: number }) {
  return (
    <div className={styles.matchBlock}>
      <div className={styles.matchBlockHeader}>
        <span className={styles.matchIndex}>Partida {index + 1}</span>
        <span className={styles.matchScore}>{setsScore(match)}</span>
        <span className={styles.matchDate}>{matchDate(match)}</span>
      </div>
      <p className={styles.matchTitle}>{matchTitle(match)}</p>
      {match.context?.tournamentName && (
        <p className={styles.matchTournament}>{match.context.tournamentName}</p>
      )}

      {/* Stats table */}
      <div className={styles.table}>
        {/* Labels column */}
        <div className={`${styles.col} ${styles.colLabels}`}>
          <div className={styles.colTeam}> </div>
          {TEAM_ROWS.map((row) => (
            <div key={row.label} className={`${styles.colCell} ${styles.labelCell}`}>
              {row.label}
            </div>
          ))}
        </div>
        <MatchColumn match={match} teamSide="A" />
        <MatchColumn match={match} teamSide="B" />
      </div>
    </div>
  );
}

function CompararContent() {
  const params = useSearchParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = params.get('ids')?.split(',').filter(Boolean) ?? [];
    const loaded = ids.map((id) => loadMatch(id)).filter((m): m is Match => m !== undefined);
    setMatches(loaded);
    setLoading(false);
  }, [params]);

  if (loading) return <div className="page"><p style={{ color: 'var(--text-muted)', marginTop: 32, textAlign: 'center' }}>Carregando…</p></div>;

  if (matches.length < 2) {
    return (
      <div className="page">
        <Link href="/" className={styles.back}>← Início</Link>
        <p style={{ color: 'var(--text-muted)', marginTop: 32, textAlign: 'center' }}>
          Selecione pelo menos 2 partidas para comparar.
        </p>
        <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>Voltar</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={styles.header}>
        <Link href="/" className={styles.back}>← Início</Link>
        <h1>Comparação</h1>
      </div>

      <div className={styles.blocks}>
        {matches.map((m, i) => (
          <MatchBlock key={m.id} match={m} index={i} />
        ))}
      </div>

      <PlayerCrossover matches={matches} />

      <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>
        Voltar ao Início
      </Link>
    </div>
  );
}

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="page"><p style={{ color: 'var(--text-muted)', marginTop: 32, textAlign: 'center' }}>Carregando…</p></div>}>
      <CompararContent />
    </Suspense>
  );
}

/* ─── Comparação por jogador (aparece em ≥2 partidas) ─────────────────── */

function PlayerCrossover({ matches }: { matches: Match[] }) {
  // Build name → array of PlayerStats per match
  const byName = new Map<string, { matchIndex: number; stats: ReturnType<typeof calculateStats>['teamA']['players'][0] }[]>();

  matches.forEach((m, mi) => {
    const stats = calculateStats(m);
    const allPlayerStats = [...stats.teamA.players, ...stats.teamB.players];
    const allPlayers = [...m.teamA.players, ...m.teamB.players];

    for (const p of allPlayers) {
      const ps = allPlayerStats.find((s) => s.playerId === p.id);
      if (!ps) continue;
      const name = p.name.trim().toLowerCase();
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name)!.push({ matchIndex: mi, stats: ps });
    }
  });

  const shared = [...byName.entries()].filter(([, entries]) => entries.length >= 2);
  if (shared.length === 0) return null;

  return (
    <div className={styles.crossover}>
      <h2 className={styles.crossoverTitle}>Evolução por Jogador</h2>
      {shared.map(([name, entries]) => (
        <div key={name} className={styles.crossoverCard}>
          <div className={styles.crossoverName}>{entries[0]?.stats && capitalise(name)}</div>
          <div className={styles.crossoverGrid}>
            <div className={styles.crossoverHeader}> </div>
            {entries.map((e) => (
              <div key={e.matchIndex} className={styles.crossoverHeader}>
                Partida {e.matchIndex + 1}
              </div>
            ))}

            {[
              { label: 'Points', fn: (s: typeof entries[0]['stats']) => String(s.totalPoints) },
              { label: 'Winners', fn: (s: typeof entries[0]['stats']) => String(s.winners.total) },
              { label: 'Erros', fn: (s: typeof entries[0]['stats']) => String(s.errors.total) },
              { label: 'Forçou', fn: (s: typeof entries[0]['stats']) => String(s.forcedErrors) },
              { label: 'Aces', fn: (s: typeof entries[0]['stats']) => String(s.serveStats.aces) },
              { label: '% Saque', fn: (s: typeof entries[0]['stats']) => pct(s.serveStats.totalServesFirstIn, s.serveStats.totalServesFirst) },
            ].map((row) => (
              <>
                <div key={`lbl-${row.label}`} className={styles.crossoverLabel}>{row.label}</div>
                {entries.map((e) => (
                  <div key={`val-${row.label}-${e.matchIndex}`} className={styles.crossoverValue}>
                    {row.fn(e.stats)}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function capitalise(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
