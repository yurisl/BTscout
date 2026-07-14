import type { Match } from '../entities/Match.js';
import type { MatchSet } from '../entities/MatchSet.js';
import type { Game } from '../entities/Game.js';
import type { PointEvent, PointType, PointSubtype, ScoreSnapshot } from '../entities/PointEvent.js';
import type { TeamSide } from '../entities/Team.js';
import type { SetServerConfig } from '../entities/ServeConfig.js';
import { resolveGame } from './resolveGame.js';
import { resolveSet, resolveSuperTiebreak } from './resolveSet.js';
import { oppositeTeam, pointBasedServer, isSideChangePoint } from './serve.js';

export interface PointInput {
  winnerSide: TeamSide;
  /** Jogador que executou a ação (winner, erro cometido ou forçou erro) */
  playerId: string;
  pointType: PointType;
  pointSubtype: PointSubtype;
  isFirstServe: boolean;
}

export type TransitionType =
  | 'point_scored'
  | 'game_won'
  | 'set_won'
  | 'tiebreak_started'
  | 'super_tiebreak_started'
  | 'match_won'
  | 'serve_changed'
  | 'side_change';

export interface ApplyPointResult {
  match: Match;
  transitions: TransitionType[];
}

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------

function validate(match: Match, input: PointInput): void {
  if (match.status !== 'in_progress') {
    throw new Error(`Partida não está em andamento (status: ${match.status})`);
  }

  const set = match.sets[match.currentSetIndex];
  if (!set) throw new Error('Nenhum set em andamento');
  if (set.status !== 'in_progress') throw new Error('Set atual já encerrado');

  if (!set.serverConfig) {
    throw new Error('Configure o sacador inicial deste set antes de registrar pontos');
  }

  if (set.type === 'regular') {
    const game = activeGame(set);
    if (!game) throw new Error('Nenhum game em andamento');
    if (game.status !== 'in_progress') throw new Error('Game atual já encerrado');
  }

  // Para erros: playerId é quem errou — pertence ao time que PERDEU o ponto.
  // Para winner/forced_error: playerId é quem executou — pertence ao time vencedor.
  if (input.pointType === 'error') {
    const loserTeam = input.winnerSide === 'A' ? match.teamB : match.teamA;
    if (!loserTeam.players.some((p) => p.id === input.playerId)) {
      throw new Error(`Para erro: jogador ${input.playerId} deve pertencer ao time que perdeu o ponto`);
    }
  } else {
    const winnerTeam = input.winnerSide === 'A' ? match.teamA : match.teamB;
    if (!winnerTeam.players.some((p) => p.id === input.playerId)) {
      throw new Error(`Jogador ${input.playerId} não pertence ao time ${input.winnerSide}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function activeGame(set: MatchSet): Game | undefined {
  return set.games.findLast((g) => g.status === 'in_progress');
}

function captureSnapshot(match: Match): ScoreSnapshot {
  return {
    sets: match.sets.map((s) => ({
      id: s.id,
      setNumber: s.setNumber,
      type: s.type,
      gamesA: s.gamesA,
      gamesB: s.gamesB,
      tiebreakScoreA: s.tiebreakScoreA,
      tiebreakScoreB: s.tiebreakScoreB,
      status: s.status,
      winner: s.winner,
      serverConfig: s.serverConfig,
      games: s.games.map((g) => ({
        id: g.id,
        gameNumber: g.gameNumber,
        type: g.type,
        pointsA: g.pointsA,
        pointsB: g.pointsB,
        status: g.status,
        winner: g.winner,
        servingTeam: g.servingTeam,
        servingPlayerId: g.servingPlayerId,
        serverConfig: g.serverConfig,
      })),
    })),
    currentSetIndex: match.currentSetIndex,
    servingTeam: match.servingTeam,
    servingPlayerId: match.servingPlayerId,
    matchStatus: match.status,
    matchWinner: match.winner,
    finishedAt: match.finishedAt,
  };
}

function newId(): string {
  return crypto.randomUUID();
}

function nextSequenceNumber(match: Match): number {
  return match.pointEvents.length + 1;
}

function countSetsWon(match: Match, side: TeamSide): number {
  return match.sets.filter((s) => s.winner === side).length;
}

function resolveMatchWinner(match: Match): TeamSide | null {
  const setsA = countSetsWon(match, 'A');
  const setsB = countSetsWon(match, 'B');
  if (setsA >= match.format.setsToWin) return 'A';
  if (setsB >= match.format.setsToWin) return 'B';
  return null;
}

/**
 * Sacador designado para a próxima vez que `team` sacar um game regular
 * neste set. Alterna entre os dois jogadores da dupla a cada nova vez que o
 * time serve, começando pelo jogador designado em `serverConfig`.
 */
function pickServerForTeamGame(set: MatchSet, team: TeamSide): string {
  const config = set.serverConfig!;
  const rotation = team === 'A' ? config.teamARotation : config.teamBRotation;
  const priorTurns = set.games.filter((g) => g.type === 'regular' && g.servingTeam === team).length;
  return priorTurns % 2 === 0 ? rotation[0] : rotation[1];
}

/**
 * Monta a config de rotação ponto a ponto local a um tie-break (6x6) recém
 * criado, a partir de quem naturalmente sacaria o próximo game para cada
 * dupla (continuação da rotação normal do set).
 */
function buildTiebreakLocalConfig(
  set: MatchSet,
  firstServingTeam: TeamSide,
  firstServerId: string,
): SetServerConfig {
  const config = set.serverConfig!;
  const otherTeam = oppositeTeam(firstServingTeam);
  const otherTeamServerId = pickServerForTeamGame(set, otherTeam);

  const firstRotationSrc = firstServingTeam === 'A' ? config.teamARotation : config.teamBRotation;
  const firstOther = firstServerId === firstRotationSrc[0] ? firstRotationSrc[1] : firstRotationSrc[0];

  const otherRotationSrc = otherTeam === 'A' ? config.teamARotation : config.teamBRotation;
  const otherOther = otherTeamServerId === otherRotationSrc[0] ? otherRotationSrc[1] : otherRotationSrc[0];

  const teamARotation: [string, string] =
    firstServingTeam === 'A' ? [firstServerId, firstOther] : [otherTeamServerId, otherOther];
  const teamBRotation: [string, string] =
    firstServingTeam === 'B' ? [firstServerId, firstOther] : [otherTeamServerId, otherOther];

  return { teamARotation, teamBRotation, firstServingTeam };
}

// ---------------------------------------------------------------------------
// Criação de game / set
// ---------------------------------------------------------------------------

function createGame(
  matchId: string,
  setId: string,
  gameNumber: number,
  type: Game['type'],
  servingTeam: TeamSide,
  servingPlayerId: string | null,
): Game {
  return {
    id: newId(),
    setId,
    matchId,
    gameNumber,
    type,
    pointsA: 0,
    pointsB: 0,
    status: 'in_progress',
    winner: null,
    servingTeam,
    servingPlayerId,
    serverConfig: null,
  };
}

function createSet(
  matchId: string,
  setNumber: number,
  type: MatchSet['type'],
  servingTeam: TeamSide,
  servingPlayerId: string | null,
): MatchSet {
  const set: MatchSet = {
    id: newId(),
    matchId,
    setNumber,
    type,
    gamesA: 0,
    gamesB: 0,
    tiebreakScoreA: 0,
    tiebreakScoreB: 0,
    status: 'in_progress',
    winner: null,
    games: [],
    serverConfig: null,
  };

  if (type === 'regular') {
    set.games.push(createGame(matchId, set.id, 1, 'regular', servingTeam, servingPlayerId));
  }

  return set;
}

function finishMatch(next: Match, winner: TeamSide, transitions: TransitionType[]): void {
  next.winner = winner;
  next.status = 'finished';
  next.finishedAt = new Date();
  transitions.push('match_won');
}

function openNextSet(next: Match, transitions: TransitionType[]): void {
  const nextSetNumber = next.sets.length + 1;
  const totalPossibleSets = next.format.setsToWin * 2 - 1;
  const isDecisiveSet =
    nextSetNumber === totalPossibleSets && next.format.lastSetIsSuperTiebreak;

  const newSet = createSet(
    next.id,
    nextSetNumber,
    isDecisiveSet ? 'super_tiebreak' : 'regular',
    next.servingTeam,
    next.servingPlayerId,
  );

  next.sets.push(newSet);
  next.currentSetIndex += 1;

  // Simples: não há ambiguidade de jogador (1 por time) — configura
  // automaticamente, continuando a rotação natural de saque. Duplas: o
  // set fica com serverConfig=null até a interface perguntar quem saca
  // pela Dupla A, quem saca pela Dupla B e qual dupla saca primeiro.
  if (next.type === 'singles') {
    const playerA = next.teamA.players[0]!;
    const playerB = next.teamB.players[0]!;
    const config: SetServerConfig = {
      teamARotation: [playerA.id, playerA.id],
      teamBRotation: [playerB.id, playerB.id],
      firstServingTeam: next.servingTeam,
    };
    newSet.serverConfig = config;
    next.servingPlayerId = next.servingTeam === 'A' ? playerA.id : playerB.id;
    if (newSet.type === 'regular') {
      const game = newSet.games[0]!;
      game.servingTeam = next.servingTeam;
      game.servingPlayerId = next.servingPlayerId;
    }
  }

  if (isDecisiveSet) transitions.push('super_tiebreak_started');
}

// ---------------------------------------------------------------------------
// applyPoint
// ---------------------------------------------------------------------------

export function applyPoint(match: Match, input: PointInput): ApplyPointResult {
  validate(match, input);

  const transitions: TransitionType[] = [];
  const next: Match = structuredClone(match);
  const snapshot = captureSnapshot(match);
  const set = next.sets[next.currentSetIndex]!;

  transitions.push('point_scored');

  // ─── Super Tie-Break: pontos vão direto no set ───────────────────────────
  if (set.type === 'super_tiebreak') {
    if (input.winnerSide === 'A') set.tiebreakScoreA += 1;
    else set.tiebreakScoreB += 1;

    // totalPlayed = pontos disputados INCLUINDO este; é o cursor para o próximo saque
    const totalPlayed = set.tiebreakScoreA + set.tiebreakScoreB;
    const { servingTeam: newServingTeam, servingPlayerId: newServingPlayerId } =
      pointBasedServer(set.serverConfig!, totalPlayed);
    if (newServingTeam !== next.servingTeam || newServingPlayerId !== next.servingPlayerId) {
      next.servingTeam = newServingTeam;
      next.servingPlayerId = newServingPlayerId;
      transitions.push('serve_changed');
    }

    const winner = resolveSuperTiebreak(set, next.format);

    if (isSideChangePoint(totalPlayed) && !winner) {
      transitions.push('side_change');
    }

    if (winner) {
      set.status = 'finished';
      set.winner = winner;
      transitions.push('set_won');
      finishMatch(next, winner, transitions);
    }
  } else {
    // ─── Set regular: ponto vai para o game ──────────────────────────────
    const game = activeGame(set)!;

    if (input.winnerSide === 'A') game.pointsA += 1;
    else game.pointsB += 1;

    // Atualiza saque dentro do tie-break (ordem oficial ponto a ponto)
    if (game.type === 'tiebreak') {
      const totalPlayed = game.pointsA + game.pointsB;
      const { servingTeam: newServingTeam, servingPlayerId: newServingPlayerId } =
        pointBasedServer(game.serverConfig!, totalPlayed);
      if (newServingTeam !== next.servingTeam || newServingPlayerId !== next.servingPlayerId) {
        next.servingTeam = newServingTeam;
        next.servingPlayerId = newServingPlayerId;
        transitions.push('serve_changed');
      }
    }

    const gameWinner = resolveGame(game, next.format);

    if (gameWinner) {
      game.status = 'finished';
      game.winner = gameWinner;
      transitions.push('game_won');

      if (gameWinner === 'A') set.gamesA += 1;
      else set.gamesB += 1;

      if (game.type === 'tiebreak') {
        // O vencedor do tie-break vence o set imediatamente (placar 7x6)
        set.tiebreakScoreA = game.pointsA;
        set.tiebreakScoreB = game.pointsB;
        set.status = 'finished';
        set.winner = gameWinner;
        transitions.push('set_won');

        const matchWinner = resolveMatchWinner(next);
        if (matchWinner) {
          finishMatch(next, matchWinner, transitions);
        } else {
          openNextSet(next, transitions);
        }
      } else {
        // Game regular: troca saque (time + jogador, seguindo a rotação
        // configurada no início do set) e verifica o set
        next.servingTeam = oppositeTeam(next.servingTeam);
        next.servingPlayerId = pickServerForTeamGame(set, next.servingTeam);
        transitions.push('serve_changed');

        const setResolution = resolveSet(set, next.format);

        if (setResolution.kind === 'winner') {
          set.status = 'finished';
          set.winner = setResolution.side;
          transitions.push('set_won');

          const matchWinner = resolveMatchWinner(next);
          if (matchWinner) {
            finishMatch(next, matchWinner, transitions);
          } else {
            openNextSet(next, transitions);
          }
        } else if (setResolution.kind === 'tiebreak') {
          // Saque no tie-break começa com quem NÃO sacou o último game
          // (a troca já foi feita acima, então next.servingTeam/servingPlayerId já são corretos)
          const tiebreakGame = createGame(
            next.id,
            set.id,
            set.games.length + 1,
            'tiebreak',
            next.servingTeam,
            next.servingPlayerId,
          );
          tiebreakGame.serverConfig = buildTiebreakLocalConfig(
            set,
            next.servingTeam,
            next.servingPlayerId!,
          );
          set.games.push(tiebreakGame);
          transitions.push('tiebreak_started');
        } else {
          const nextGame = createGame(
            next.id,
            set.id,
            set.games.length + 1,
            'regular',
            next.servingTeam,
            next.servingPlayerId,
          );
          set.games.push(nextGame);
        }
      }
    }
  }

  // ─── Registrar PointEvent ────────────────────────────────────────────────
  const event: PointEvent = {
    id: newId(),
    matchId: next.id,
    setId: set.id,
    gameId: set.type === 'super_tiebreak' ? null : (activeGame(set)?.id ?? null),
    sequenceNumber: nextSequenceNumber(match),
    winnerSide: input.winnerSide,
    playerId: input.playerId,
    pointType: input.pointType,
    pointSubtype: input.pointSubtype,
    servingTeam: match.servingTeam,
    servingPlayerId: match.servingPlayerId ?? '',
    isFirstServe: input.isFirstServe,
    scoreSnapshotBefore: snapshot,
    createdAt: new Date(),
  };

  next.pointEvents.push(event);

  return { match: next, transitions };
}
