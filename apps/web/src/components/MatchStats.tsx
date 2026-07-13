import { calculateStats } from '@beach-tennis-scout/domain';
import type { Match, PlayerStats, TeamStats } from '@beach-tennis-scout/domain';
import styles from './MatchStats.module.css';

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
    { label: 'Paralela', count: w.winnerPar },
    { label: 'Cruzada', count: w.winnerCru },
    { label: 'Lob', count: w.lob },
    { label: 'Smash', count: w.smash },
    { label: 'Drop', count: w.drop },
    { label: 'Ace', count: w.ace },
    { label: 'Rainbow', count: w.rainbow },
    { label: 'Gancho', count: w.gancho },
    // legado: exibir apenas se houver dados de partidas antigas
    ...(w.winnerDir > 0 ? [{ label: 'Dir (legado)', count: w.winnerDir }] : []),
    ...(w.winnerEsq > 0 ? [{ label: 'Esq (legado)', count: w.winnerEsq }] : []),
  ];

  const errorItems: BreakdownItem[] = [
    { label: 'Direita', count: e.erroDir },
    { label: 'Esquerda', count: e.erroEsq },
    { label: 'Lob', count: e.erroLob },
    { label: 'Smash', count: e.erroSmash },
    { label: 'Saque', count: e.erroSaque },
    { label: 'Rainbow', count: e.erroRainbow },
    { label: 'Gancho', count: e.erroGancho },
    { label: 'Forçado', count: e.erroForcado },
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

/** Comparativo por dupla/time — pontos disputados, winners, erros e percentuais. */
function TeamComparison({ match, sA, sB }: { match: Match; sA: TeamStats; sB: TeamStats }) {
  const pontosDisputados = sA.totalPoints + sB.totalPoints;
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
      <StatRow label={`Pontos (${pontosDisputados} disputados)`} valueA={String(sA.totalPoints)} valueB={String(sB.totalPoints)} />
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

/**
 * Estatísticas completas da partida: comparativo por dupla e detalhamento por jogador.
 * Componente puramente apresentacional — reutilizado tanto no painel/modal de
 * estatísticas exibido durante a partida quanto na tela de resumo pós-jogo.
 */
export default function MatchStats({ match }: { match: Match }) {
  const stats = calculateStats(match);

  return (
    <div>
      <TeamComparison match={match} sA={stats.teamA} sB={stats.teamB} />

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
    </div>
  );
}
