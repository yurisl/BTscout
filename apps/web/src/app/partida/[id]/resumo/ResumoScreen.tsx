'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { calculateStats } from '@beach-tennis-scout/domain';
import type { Match, PlayerStats, TeamStats } from '@beach-tennis-scout/domain';
import { loadMatch } from '@/lib/storage';
import Scoreboard from '@/components/Scoreboard';
import styles from './resumo.module.css';

function pct(num: number, den: number): string {
  if (den === 0) return '—';
  return `${Math.round((num / den) * 100)}%`;
}

interface BreakdownItem {
  label: string;
  count: number;
}

function BreakdownSection({
  title,
  items,
  total,
  totalActions,
  colorClass,
}: {
  title: string;
  items: BreakdownItem[];
  total: number;
  totalActions: number;
  colorClass: string | undefined;
}) {
  if (total === 0) return null;
  return (
    <div className={styles.bSection}>
      <div className={`${styles.bTitle} ${colorClass}`}>
        {title} <span className={styles.bCount}>{total} ({pct(total, totalActions)})</span>
      </div>
      {items.filter((i) => i.count > 0).map((item) => (
        <div key={item.label} className={styles.bRow}>
          <span className={styles.bLabel}>{item.label}</span>
          <span className={styles.bNum}>{item.count}</span>
          <div className={styles.bBarWrap}>
            <div
              className={`${styles.bBar} ${colorClass}`}
              style={{ width: `${Math.round((item.count / total) * 100)}%` }}
            />
          </div>
          <span className={styles.bPct}>{pct(item.count, total)}</span>
        </div>
      ))}
    </div>
  );
}

function PlayerCard({
  name,
  stats,
  side,
}: {
  name: string;
  stats: PlayerStats;
  side: 'A' | 'B';
}) {
  const w = stats.winners;
  const e = stats.errors;
  const srv = stats.serveStats;
  const totalActions = w.total + e.total + stats.forcedErrors;

  const winnerItems: BreakdownItem[] = [
    { label: 'Dir', count: w.winnerDir },
    { label: 'Esq', count: w.winnerEsq },
    { label: 'Paralela', count: w.winnerPar },
    { label: 'Cruzada', count: w.winnerCru },
    { label: 'Lob', count: w.lob },
    { label: 'Smash', count: w.smash },
    { label: 'Drop', count: w.drop },
    { label: 'Ace', count: w.ace },
  ];

  const errorItems: BreakdownItem[] = [
    { label: 'Direita', count: e.erroDir },
    { label: 'Esquerda', count: e.erroEsq },
    { label: 'Lob', count: e.erroLob },
    { label: 'Smash', count: e.erroSmash },
    { label: 'Saque', count: e.erroSaque },
  ];

  return (
    <div className={`${styles.playerCard} ${side === 'A' ? styles.cardA : styles.cardB}`}>
      <div className={styles.playerHeader}>
        <span className={styles.playerName}>{name}</span>
        <span className={styles.playerTotal}>{totalActions} ações</span>
      </div>

      <BreakdownSection
        title="Winners"
        items={winnerItems}
        total={w.total}
        totalActions={totalActions}
        colorClass={styles.barWin}
      />

      <BreakdownSection
        title="Erros"
        items={errorItems}
        total={e.total}
        totalActions={totalActions}
        colorClass={styles.barErr}
      />

      {stats.forcedErrors > 0 && (
        <div className={styles.bSection}>
          <div className={`${styles.bTitle} ${styles.barForced}`}>
            Forçou Erro{' '}
            <span className={styles.bCount}>
              {stats.forcedErrors} ({pct(stats.forcedErrors, totalActions)})
            </span>
          </div>
        </div>
      )}

      {/* Saque */}
      {srv.totalServesFirst > 0 && (
        <div className={styles.bSection}>
          <div className={`${styles.bTitle} ${styles.barServe}`}>Saque</div>
          <div className={styles.serveGrid}>
            <div className={styles.serveItem}>
              <span className={styles.serveVal}>{srv.aces}</span>
              <span className={styles.serveLbl}>Aces</span>
            </div>
            <div className={styles.serveItem}>
              <span className={styles.serveVal}>{e.erroSaque}</span>
              <span className={styles.serveLbl}>Erros</span>
            </div>
            <div className={styles.serveItem}>
              <span className={styles.serveVal}>
                {pct(srv.totalServesFirstIn, srv.totalServesFirst)}
              </span>
              <span className={styles.serveLbl}>% Entrou</span>
            </div>
            <div className={styles.serveItem}>
              <span className={styles.serveVal}>
                {pct(srv.pointsWonOnFirstServe, srv.totalServesFirstIn)}
              </span>
              <span className={styles.serveLbl}>% Pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, valueA, valueB }: { label: string; valueA: string; valueB: string }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statA}>{valueA}</span>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statB}>{valueB}</span>
    </div>
  );
}

function TeamComparison({ match, sA, sB }: { match: Match; sA: TeamStats; sB: TeamStats }) {
  return (
    <div className={`card ${styles.cmpSection}`}>
      <div className={styles.teamHeaders}>
        <span style={{ color: 'var(--color-a)', fontWeight: 700 }}>
          {match.teamA.players.map((p) => p.name).join(' / ')}
        </span>
        <span style={{ color: 'var(--color-b)', fontWeight: 700 }}>
          {match.teamB.players.map((p) => p.name).join(' / ')}
        </span>
      </div>
      <StatRow label="Pontos" valueA={String(sA.totalPoints)} valueB={String(sB.totalPoints)} />
      <StatRow label="Winners" valueA={String(sA.totalWinners)} valueB={String(sB.totalWinners)} />
      <StatRow label="Erros" valueA={String(sA.totalErrors)} valueB={String(sB.totalErrors)} />
      <StatRow label="Forçou Erro" valueA={String(sA.totalForcedErrors)} valueB={String(sB.totalForcedErrors)} />
      <StatRow label="Aces" valueA={String(sA.serveStats.aces)} valueB={String(sB.serveStats.aces)} />
      <StatRow
        label="Erros Saque"
        valueA={String(sA.errorsBySubtype.erroSaque)}
        valueB={String(sB.errorsBySubtype.erroSaque)}
      />
      <StatRow
        label="% Saque"
        valueA={pct(sA.serveStats.totalServesFirstIn, sA.serveStats.totalServesFirst)}
        valueB={pct(sB.serveStats.totalServesFirstIn, sB.serveStats.totalServesFirst)}
      />
    </div>
  );
}

export default function ResumoScreen({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    setMatch(loadMatch(matchId) ?? null);
  }, [matchId]);

  if (!match) {
    return (
      <div className="page">
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48 }}>
          Partida não encontrada.
        </p>
        <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          Voltar
        </Link>
      </div>
    );
  }

  const stats = calculateStats(match);

  return (
    <div className="page">
      <div className={styles.header}>
        <Link href="/" className={styles.back}>← Início</Link>
        <h1>Estatísticas</h1>
        {match.status === 'in_progress' && (
          <Link href={`/partida/${match.id}`} className={styles.backToMatch}>
            Continuar Partida
          </Link>
        )}
      </div>

      <Scoreboard match={match} />

      <div style={{ marginTop: 16 }}>
        <TeamComparison match={match} sA={stats.teamA} sB={stats.teamB} />
      </div>

      <h2 className={styles.sectionTitle}>Por Jogador</h2>

      <div className={styles.playersList}>
        {match.teamA.players.map((p) => {
          const ps = stats.teamA.players.find((s) => s.playerId === p.id);
          return ps ? <PlayerCard key={p.id} name={p.name} stats={ps} side="A" /> : null;
        })}
        {match.teamB.players.map((p) => {
          const ps = stats.teamB.players.find((s) => s.playerId === p.id);
          return ps ? <PlayerCard key={p.id} name={p.name} stats={ps} side="B" /> : null;
        })}
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {match.status === 'in_progress' && (
          <Link href={`/partida/${match.id}`} className="btn btn-primary">
            Continuar Partida
          </Link>
        )}
        <Link href="/" className="btn btn-outline">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
