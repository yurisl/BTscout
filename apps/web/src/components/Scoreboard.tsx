import type { Match, MatchSet, Game } from '@beach-tennis-scout/domain';
import { toDisplayScore, remainingServes, nextSideChangeAt } from '@beach-tennis-scout/domain';
import styles from './Scoreboard.module.css';

function activeGame(set: MatchSet): Game | undefined {
  return set.games.findLast((g) => g.status === 'in_progress');
}

function currentPointScore(match: Match): string {
  const set = match.sets[match.currentSetIndex];
  if (!set || set.status !== 'in_progress') return '';

  if (set.type === 'super_tiebreak') {
    return `${set.tiebreakScoreA} — ${set.tiebreakScoreB}`;
  }

  const game = activeGame(set);
  if (!game) return '';

  if (game.type === 'tiebreak') {
    return `${game.pointsA} — ${game.pointsB}`;
  }

  return toDisplayScore(game.pointsA, game.pointsB);
}

function currentGameLabel(match: Match): string {
  const set = match.sets[match.currentSetIndex];
  if (!set) return '';
  if (set.type === 'super_tiebreak') return 'Super Tie-Break';
  const game = activeGame(set);
  if (!game) return '';
  if (game.type === 'tiebreak') return 'Tie-Break';
  return `Game ${game.gameNumber}`;
}

function serverName(match: Match): string {
  if (!match.servingPlayerId) return '';
  const all = [...match.teamA.players, ...match.teamB.players];
  return all.find((p) => p.id === match.servingPlayerId)?.name ?? '';
}

const POINT_LABELS = ['0', '15', '30', '40'];
function pointLabel(points: number): string {
  return POINT_LABELS[Math.min(points, 3)] ?? '40';
}

/**
 * Placar do game ativo, separado por lado, para a coluna final do placar
 * compacto (broadcast). `null` quando não há um "game" com pontos a
 * mostrar à parte — no Super Tie-Break o placar já é ponto a ponto e vive
 * na própria coluna de set, então não existe coluna extra.
 */
function compactPointCells(match: Match): { a: string; b: string } | null {
  if (match.status !== 'in_progress') return null;
  const set = match.sets[match.currentSetIndex];
  if (!set || set.type === 'super_tiebreak') return null;
  const game = activeGame(set);
  if (!game) return null;
  if (game.type === 'tiebreak') return { a: String(game.pointsA), b: String(game.pointsB) };
  return { a: pointLabel(game.pointsA), b: pointLabel(game.pointsB) };
}

interface SuperTiebreakHeaderInfo {
  /** Quantos saques (incluindo o próximo) restam para o sacador atual */
  remaining: number;
  /** Quantos pontos faltam para a próxima troca de lado */
  pointsUntilSideChange: number;
}

/** Só retorna dados quando o set atual é o Super Tie-Break, em andamento e já configurado. */
function superTiebreakHeaderInfo(match: Match): SuperTiebreakHeaderInfo | null {
  const set = match.sets[match.currentSetIndex];
  if (!set || set.type !== 'super_tiebreak' || set.status !== 'in_progress' || !set.serverConfig) {
    return null;
  }
  const totalPlayed = set.tiebreakScoreA + set.tiebreakScoreB;
  return {
    remaining: remainingServes(totalPlayed),
    pointsUntilSideChange: nextSideChangeAt(totalPlayed) - totalPlayed,
  };
}

interface Props {
  match: Match;
  /** 'hero' (padrão): card grande, usado no Resumo pós-partida.
   *  'compact': tabela densa estilo transmissão esportiva, ancorada no
   *  canto superior esquerdo da tela de Scout — ver MatchScreen. */
  variant?: 'hero' | 'compact';
}

export default function Scoreboard({ match, variant = 'hero' }: Props) {
  const setsA = match.sets.filter((s) => s.winner === 'A').length;
  const setsB = match.sets.filter((s) => s.winner === 'B').length;
  const teamAName = match.teamA.players.map((p) => p.name).join(' / ');
  const teamBName = match.teamB.players.map((p) => p.name).join(' / ');
  const stbInfo = superTiebreakHeaderInfo(match);
  const isSuperTiebreak = match.sets[match.currentSetIndex]?.type === 'super_tiebreak'
    && match.status === 'in_progress';

  if (variant === 'compact') {
    const pointCells = compactPointCells(match);
    const servingA = match.status === 'in_progress' && match.servingTeam === 'A';
    const servingB = match.status === 'in_progress' && match.servingTeam === 'B';
    return (
      <div className={styles.compact}>
        <div className={`${styles.compactRow} ${styles.compactRowA}`}>
          {servingA && <span className={styles.compactDot} />}
          <span className={styles.compactName}>{teamAName}</span>
          {match.sets.map((s) => (
            <span key={s.id} className={`${styles.compactCell} ${s.status === 'in_progress' ? styles.compactCellActive : ''}`}>
              {s.type === 'super_tiebreak' ? s.tiebreakScoreA : s.gamesA}
            </span>
          ))}
          {pointCells && <span className={`${styles.compactCell} ${styles.compactCellPoint}`}>{pointCells.a}</span>}
        </div>
        <div className={`${styles.compactRow} ${styles.compactRowB}`}>
          {servingB && <span className={styles.compactDot} />}
          <span className={styles.compactName}>{teamBName}</span>
          {match.sets.map((s) => (
            <span key={s.id} className={`${styles.compactCell} ${s.status === 'in_progress' ? styles.compactCellActive : ''}`}>
              {s.type === 'super_tiebreak' ? s.tiebreakScoreB : s.gamesB}
            </span>
          ))}
          {pointCells && <span className={`${styles.compactCell} ${styles.compactCellPoint}`}>{pointCells.b}</span>}
        </div>
        {(match.context?.tournamentName || match.status === 'finished') && (
          <div className={styles.compactFooter}>
            {match.status === 'finished' && match.winner
              ? `${match.winner === 'A' ? teamAName : teamBName} venceu`
              : match.context?.tournamentName}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.board} ${isSuperTiebreak ? styles.boardStb : ''}`}>
      {/* Header row */}
      <div className={styles.header}>
        <span className={styles.teamNameA}>{teamAName}</span>
        {match.context?.tournamentName && (
          <span className={styles.tournament}>{match.context.tournamentName}</span>
        )}
        <span className={styles.teamNameB}>{teamBName}</span>
      </div>

      {/* Sets won */}
      <div className={styles.setsWon}>
        <span className={`${styles.setsCount} ${styles.setsCountA}`}>{setsA}</span>
        <span className={styles.setsLabel}>sets</span>
        <span className={`${styles.setsCount} ${styles.setsCountB}`}>{setsB}</span>
      </div>

      {/* Individual set scores */}
      <div className={styles.setScores}>
        {match.sets.map((s) => (
          <div key={s.id} className={`${styles.setChip} ${s.status === 'in_progress' ? styles.setActive : ''}`}>
            <span className={styles.setChipA}>
              {s.type === 'super_tiebreak' ? s.tiebreakScoreA : s.gamesA}
            </span>
            <span className={styles.setDash}>-</span>
            <span className={styles.setChipB}>
              {s.type === 'super_tiebreak' ? s.tiebreakScoreB : s.gamesB}
            </span>
          </div>
        ))}
      </div>

      {/* Current point score */}
      {match.status === 'in_progress' && (
        <div className={styles.pointScore}>
          <div className={styles.gameLabel}>{currentGameLabel(match)}</div>
          <div className={styles.pointDisplay}>{currentPointScore(match)}</div>
          <div className={styles.server}>
            Saque: <strong>{serverName(match)}</strong>
            {' '}
            <span className={match.servingTeam === 'A' ? styles.dotA : styles.dotB} />
          </div>
          {stbInfo && (
            <div className={styles.stbInfo}>
              <span>
                {stbInfo.remaining === 1 ? '1 saque restante' : `${stbInfo.remaining} saques restantes`}
              </span>
              <span className={styles.stbDivider}>·</span>
              <span>
                Troca de lado em {stbInfo.pointsUntilSideChange === 1
                  ? '1 ponto'
                  : `${stbInfo.pointsUntilSideChange} pontos`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Finished */}
      {match.status === 'finished' && match.winner && (
        <div className={styles.winner}>
          {match.winner === 'A' ? teamAName : teamBName} venceu!
        </div>
      )}
    </div>
  );
}
