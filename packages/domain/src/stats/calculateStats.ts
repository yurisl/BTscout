import type { PointEvent } from '../entities/PointEvent.js';
import type { Match } from '../entities/Match.js';
import type { TeamSide } from '../entities/Team.js';

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------

export interface WinnerStats {
  winnerDir: number;
  winnerEsq: number;
  winnerPar: number;
  winnerCru: number;
  lob: number;
  smash: number;
  drop: number;
  ace: number;
  rainbow: number;
  gancho: number;
  total: number;
}

export interface ErrorStats {
  erroDir: number;
  erroEsq: number;
  erroLob: number;
  erroSmash: number;
  erroSaque: number;
  duplaFalta: number;
  erroRainbow: number;
  erroGancho: number;
  erroForcado: number;
  total: number;
}

export interface ServeStats {
  /** Total de primeiros saques realizados (inclui faltas) */
  totalServesFirst: number;
  /** Primeiros saques que entraram em jogo */
  totalServesFirstIn: number;
  firstServePercentage: number;
  /** Total de segundos saques realizados (inclui duplas faltas) */
  totalServesSecond: number;
  /** Segundos saques que entraram em jogo */
  totalServesSecondIn: number;
  secondServePercentage: number;
  aces: number;
  doubleFaults: number;
  /** Pontos vencidos pelo sacador quando o 1º saque entrou */
  pointsWonOnFirstServe: number;
  /** Pontos vencidos pelo sacador quando o 2º saque entrou */
  pointsWonOnSecondServe: number;
}

export interface PlayerStats {
  playerId: string;
  /** Pontos em que o jogador foi o executor da ação vencedora (winner + forced_error) */
  totalPoints: number;
  winners: WinnerStats;
  errors: ErrorStats;
  forcedErrors: number;
  serveStats: ServeStats;
}

export interface TeamStats {
  /** Total de pontos vencidos pelo time (winners + forced_errors + erros do adversário) */
  totalPoints: number;
  totalPointsPerSet: number[];
  gamesWon: number;
  setsWon: number;
  totalWinners: number;
  totalErrors: number;
  totalForcedErrors: number;
  winnersBySubtype: WinnerStats;
  errorsBySubtype: ErrorStats;
  serveStats: ServeStats;
  players: PlayerStats[];
}

export interface MatchStats {
  teamA: TeamStats;
  teamB: TeamStats;
}

// ---------------------------------------------------------------------------
// Builders de estruturas vazias
// ---------------------------------------------------------------------------

function emptyWinnerStats(): WinnerStats {
  return { winnerDir: 0, winnerEsq: 0, winnerPar: 0, winnerCru: 0, lob: 0, smash: 0, drop: 0, ace: 0, rainbow: 0, gancho: 0, total: 0 };
}

function emptyErrorStats(): ErrorStats {
  return { erroDir: 0, erroEsq: 0, erroLob: 0, erroSmash: 0, erroSaque: 0, duplaFalta: 0, erroRainbow: 0, erroGancho: 0, erroForcado: 0, total: 0 };
}

function emptyServeStats(): ServeStats {
  return {
    totalServesFirst: 0, totalServesFirstIn: 0, firstServePercentage: 0,
    totalServesSecond: 0, totalServesSecondIn: 0, secondServePercentage: 0,
    aces: 0, doubleFaults: 0, pointsWonOnFirstServe: 0, pointsWonOnSecondServe: 0,
  };
}

function emptyPlayerStats(playerId: string): PlayerStats {
  return { playerId, totalPoints: 0, winners: emptyWinnerStats(), errors: emptyErrorStats(), forcedErrors: 0, serveStats: emptyServeStats() };
}

function pct(num: number, denom: number): number {
  return denom === 0 ? 0 : Math.round((num / denom) * 100);
}

// ---------------------------------------------------------------------------
// Processamento por evento: ação vs. saque são responsabilidades separadas
// ---------------------------------------------------------------------------

/**
 * Atualiza os stats de winners/erros/forced_errors para o jogador que executou a ação.
 * Não toca em serveStats — serve stats são tratadas em applyServeStats.
 */
function applyActionStats(stats: PlayerStats, event: PointEvent): void {
  if (event.pointType === 'winner') {
    stats.totalPoints += 1;
    const w = stats.winners;
    w.total += 1;
    switch (event.pointSubtype) {
      case 'WINNER_DIR': w.winnerDir += 1; break;
      case 'WINNER_ESQ': w.winnerEsq += 1; break;
      case 'WINNER_PAR': w.winnerPar += 1; break;
      case 'WINNER_CRU': w.winnerCru += 1; break;
      case 'LOB':        w.lob       += 1; break;
      case 'SMASH':      w.smash     += 1; break;
      case 'DROP':       w.drop      += 1; break;
      case 'ACE':        w.ace       += 1; break;
      case 'RAINBOW':    w.rainbow   += 1; break;
      case 'GANCHO':     w.gancho    += 1; break;
    }
  } else if (event.pointType === 'error') {
    const e = stats.errors;
    e.total += 1;
    switch (event.pointSubtype) {
      case 'ERRO_DIR':     e.erroDir     += 1; break;
      case 'ERRO_ESQ':     e.erroEsq     += 1; break;
      case 'ERRO_LOB':     e.erroLob     += 1; break;
      case 'ERRO_SMASH':   e.erroSmash   += 1; break;
      case 'ERRO_SAQUE':   e.erroSaque   += 1; break;
      case 'DUPLA_FALTA':  e.duplaFalta  += 1; break;
      case 'ERRO_RAINBOW': e.erroRainbow += 1; break;
      case 'ERRO_GANCHO':  e.erroGancho  += 1; break;
      case 'ERRO_FORCADO': e.erroForcado += 1; break;
    }
  } else if (event.pointType === 'forced_error') {
    stats.totalPoints += 1;
    stats.forcedErrors += 1;
  }
}

/**
 * Atualiza os serveStats do jogador que estava sacando no ponto.
 * Sempre chamada para event.servingPlayerId, independentemente de quem foi event.playerId.
 */
function applyServeStats(stats: PlayerStats, event: PointEvent, serverSide: TeamSide): void {
  const srv = stats.serveStats;
  const serverWon = event.winnerSide === serverSide;

  if (event.isFirstServe) {
    srv.totalServesFirst += 1;
    if (event.pointSubtype === 'ERRO_SAQUE') return; // falta no 1º saque: não entrou
    srv.totalServesFirstIn += 1;
    if (event.pointSubtype === 'ACE') srv.aces += 1;
    if (serverWon) srv.pointsWonOnFirstServe += 1;
  } else {
    srv.totalServesSecond += 1;
    if (event.pointSubtype === 'DUPLA_FALTA') {
      srv.doubleFaults += 1;
      return; // dupla falta: 2º saque não entrou
    }
    srv.totalServesSecondIn += 1;
    if (event.pointSubtype === 'ACE') srv.aces += 1;
    if (serverWon) srv.pointsWonOnSecondServe += 1;
  }
}

function finalizeServePercentages(srv: ServeStats): void {
  srv.firstServePercentage  = pct(srv.totalServesFirstIn,  srv.totalServesFirst);
  srv.secondServePercentage = pct(srv.totalServesSecondIn, srv.totalServesSecond);
}

// ---------------------------------------------------------------------------
// calculateStats
// ---------------------------------------------------------------------------

export function calculateStats(match: Match): MatchStats {
  const allPlayers = [...match.teamA.players, ...match.teamB.players];
  const playerMap = new Map(allPlayers.map((p) => [p.id, emptyPlayerStats(p.id)]));

  const teamAIds = new Set(match.teamA.players.map((p) => p.id));
  const sideOf = (playerId: string): TeamSide => (teamAIds.has(playerId) ? 'A' : 'B');

  const setIndexById = new Map(match.sets.map((s, i) => [s.id, i]));
  const totalSets = match.sets.length;
  const pointsPerSetA = new Array<number>(totalSets).fill(0);
  const pointsPerSetB = new Array<number>(totalSets).fill(0);

  for (const event of match.pointEvents) {
    // Ação: winner / erro / forçou erro — para o jogador executor
    const actorStats = playerMap.get(event.playerId);
    if (actorStats) applyActionStats(actorStats, event);

    // Saque — para o sacador, que pode ser diferente do executor
    const serverStats = playerMap.get(event.servingPlayerId);
    if (serverStats) applyServeStats(serverStats, event, sideOf(event.servingPlayerId));

    // Pontos por set
    const setIdx = setIndexById.get(event.setId);
    if (setIdx !== undefined) {
      if (event.winnerSide === 'A') pointsPerSetA[setIdx] = (pointsPerSetA[setIdx] ?? 0) + 1;
      else                          pointsPerSetB[setIdx] = (pointsPerSetB[setIdx] ?? 0) + 1;
    }
  }

  // Games e sets: lidos direto do estado final dos sets
  const gamesWonA = match.sets.reduce((s, set) => s + set.gamesA, 0);
  const gamesWonB = match.sets.reduce((s, set) => s + set.gamesB, 0);
  const setsWonA  = match.sets.filter((s) => s.winner === 'A').length;
  const setsWonB  = match.sets.filter((s) => s.winner === 'B').length;

  // Total de pontos por time = todos os eventos em que o time venceu
  // (inclui pontos via erro adversário que não têm executor individual no time)
  const totalPointsA = match.pointEvents.filter((e) => e.winnerSide === 'A').length;
  const totalPointsB = match.pointEvents.filter((e) => e.winnerSide === 'B').length;

  function buildTeamStats(side: TeamSide): TeamStats {
    const playerIds = side === 'A'
      ? match.teamA.players.map((p) => p.id)
      : match.teamB.players.map((p) => p.id);

    const teamPlayers = playerIds.map((id) => playerMap.get(id)!);

    const teamWinners = emptyWinnerStats();
    const teamErrors  = emptyErrorStats();
    const teamServe   = emptyServeStats();
    let totalForcedErrors = 0;

    for (const ps of teamPlayers) {
      totalForcedErrors += ps.forcedErrors;

      for (const k of Object.keys(teamWinners) as (keyof WinnerStats)[]) {
        (teamWinners[k] as number) += ps.winners[k] as number;
      }
      for (const k of Object.keys(teamErrors) as (keyof ErrorStats)[]) {
        (teamErrors[k] as number) += ps.errors[k] as number;
      }

      teamServe.totalServesFirst       += ps.serveStats.totalServesFirst;
      teamServe.totalServesFirstIn     += ps.serveStats.totalServesFirstIn;
      teamServe.totalServesSecond      += ps.serveStats.totalServesSecond;
      teamServe.totalServesSecondIn    += ps.serveStats.totalServesSecondIn;
      teamServe.aces                   += ps.serveStats.aces;
      teamServe.doubleFaults           += ps.serveStats.doubleFaults;
      teamServe.pointsWonOnFirstServe  += ps.serveStats.pointsWonOnFirstServe;
      teamServe.pointsWonOnSecondServe += ps.serveStats.pointsWonOnSecondServe;
    }

    finalizeServePercentages(teamServe);
    for (const ps of teamPlayers) finalizeServePercentages(ps.serveStats);

    return {
      totalPoints: side === 'A' ? totalPointsA : totalPointsB,
      totalPointsPerSet: side === 'A' ? pointsPerSetA : pointsPerSetB,
      gamesWon: side === 'A' ? gamesWonA : gamesWonB,
      setsWon:  side === 'A' ? setsWonA  : setsWonB,
      totalWinners:      teamWinners.total,
      totalErrors:       teamErrors.total,
      totalForcedErrors,
      winnersBySubtype:  teamWinners,
      errorsBySubtype:   teamErrors,
      serveStats:        teamServe,
      players:           teamPlayers,
    };
  }

  return { teamA: buildTeamStats('A'), teamB: buildTeamStats('B') };
}
