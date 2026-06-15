import type { Match, MatchSet, Game } from '@beach-tennis-scout/domain';
import { toDisplayScore } from '@beach-tennis-scout/domain';
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

export default function Scoreboard({ match }: { match: Match }) {
  const setsA = match.sets.filter((s) => s.winner === 'A').length;
  const setsB = match.sets.filter((s) => s.winner === 'B').length;
  const teamAName = match.teamA.players.map((p) => p.name).join(' / ');
  const teamBName = match.teamB.players.map((p) => p.name).join(' / ');

  return (
    <div className={styles.board}>
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
        <span className={styles.setsCount} style={{ color: 'var(--color-a)' }}>{setsA}</span>
        <span className={styles.setsLabel}>sets</span>
        <span className={styles.setsCount} style={{ color: 'var(--color-b)' }}>{setsB}</span>
      </div>

      {/* Individual set scores */}
      <div className={styles.setScores}>
        {match.sets.map((s) => (
          <div key={s.id} className={`${styles.setChip} ${s.status === 'in_progress' ? styles.setActive : ''}`}>
            <span style={{ color: 'var(--color-a)' }}>
              {s.type === 'super_tiebreak' ? s.tiebreakScoreA : s.gamesA}
            </span>
            <span className={styles.setDash}>-</span>
            <span style={{ color: 'var(--color-b)' }}>
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
