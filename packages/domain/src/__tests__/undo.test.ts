import { describe, it, expect } from 'vitest';
import { applyPoint } from '../scoring/applyPoint.js';
import { undoPoint } from '../scoring/undoPoint.js';
import type { Match } from '../entities/Match.js';
import { makeMatch, playerA, playerB } from './helpers.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scorePoint(match: Match, side: 'A' | 'B'): Match {
  const pid = side === 'A' ? playerA(match) : playerB(match);
  return applyPoint(match, {
    winnerSide: side,
    playerId: pid,
    pointType: 'winner',
    pointSubtype: 'WINNER_DIR',
    isFirstServe: true,
  }).match;
}

function scorePoints(match: Match, side: 'A' | 'B', count: number): Match {
  let current = match;
  for (let i = 0; i < count; i++) current = scorePoint(current, side);
  return current;
}

function activeGame(match: Match) {
  const set = match.sets[match.currentSetIndex]!;
  return set.games.findLast((g) => g.status === 'in_progress') ?? set.games.at(-1)!;
}

// ---------------------------------------------------------------------------
describe('undoPoint — casos básicos', () => {
  it('lança erro quando não há eventos', () => {
    const match = makeMatch();
    expect(() => undoPoint(match)).toThrow('Nenhum ponto para desfazer');
  });

  it('desfaz um ponto simples dentro do game', () => {
    const match = makeMatch();
    const after = scorePoint(match, 'A');
    const { match: undone, removedEvent } = undoPoint(after);

    expect(undone.pointEvents).toHaveLength(0);
    expect(activeGame(undone).pointsA).toBe(0);
    expect(activeGame(undone).pointsB).toBe(0);
    expect(removedEvent.winnerSide).toBe('A');
  });

  it('retorna o evento removido corretamente', () => {
    let match = makeMatch();
    match = scorePoint(match, 'A');
    match = scorePoint(match, 'B');
    const { removedEvent } = undoPoint(match);

    expect(removedEvent.sequenceNumber).toBe(2);
    expect(removedEvent.winnerSide).toBe('B');
  });

  it('desfaz múltiplos pontos em sequência', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3); // 30:0

    // Desfaz até voltar a 0:0
    let { match: m1 } = undoPoint(match);
    let { match: m2 } = undoPoint(m1);
    let { match: m3 } = undoPoint(m2);

    expect(activeGame(m3).pointsA).toBe(0);
    expect(m3.pointEvents).toHaveLength(0);
  });

  it('sequenceNumber é restaurado corretamente após undo + novo ponto', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 2); // seq 1, 2
    const { match: undone } = undoPoint(match); // remove seq 2
    const after = scorePoint(undone, 'B'); // novo seq 2

    expect(after.pointEvents).toHaveLength(2);
    expect(after.pointEvents.at(-1)!.sequenceNumber).toBe(2);
  });
});

// ---------------------------------------------------------------------------
describe('undoPoint — desfazer fechamento de game', () => {
  it('reabre o game quando o 4º ponto é desfeito', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3); // 3:0
    const before = match;
    match = scorePoint(match, 'A'); // fecha o game

    const set = match.sets[0]!;
    expect(set.gamesA).toBe(1); // game fechado

    const { match: undone } = undoPoint(match);

    const setAfter = undone.sets[0]!;
    expect(setAfter.gamesA).toBe(0);
    expect(activeGame(undone).status).toBe('in_progress');
    expect(activeGame(undone).pointsA).toBe(3);
    expect(activeGame(undone).winner).toBeNull();
  });

  it('remove o game seguinte que foi criado após o game ser vencido', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 4); // fecha game 1, cria game 2

    const set = match.sets[0]!;
    expect(set.games).toHaveLength(2);
    expect(set.games[1]!.status).toBe('in_progress');

    const { match: undone } = undoPoint(match);

    expect(undone.sets[0]!.games).toHaveLength(1);
    expect(undone.sets[0]!.games[0]!.status).toBe('in_progress');
    expect(undone.sets[0]!.games[0]!.pointsA).toBe(3);
  });

  it('restaura o saque ao valor anterior ao game', () => {
    const match = makeMatch({ servingTeam: 'A' });
    const afterGame = scorePoints(match, 'A', 4); // saque muda para B
    expect(afterGame.servingTeam).toBe('B');

    const { match: undone } = undoPoint(afterGame);
    expect(undone.servingTeam).toBe('A'); // saque restaurado
  });
});

// ---------------------------------------------------------------------------
describe('undoPoint — desfazer fechamento de set', () => {
  it('reabre o set e remove o set seguinte quando o ponto de set é desfeito', () => {
    let match = makeMatch();
    // 5 games para A e 5 para B (intercalados)
    for (let g = 0; g < 5; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }
    match = scorePoints(match, 'A', 4); // gamesA=6, gamesB=5
    // Próximo game fecha o set: gamesA=7, gamesB=5 → set 1 encerrado, set 2 criado
    match = scorePoints(match, 'A', 3); // 3 pontos no game 12 do set 1
    const before7x5 = match;
    match = scorePoint(match, 'A'); // fecha set 1, abre set 2

    expect(match.sets).toHaveLength(2);
    expect(match.sets[0]!.status).toBe('finished');
    expect(match.currentSetIndex).toBe(1);

    const { match: undone } = undoPoint(match);

    expect(undone.sets).toHaveLength(1);
    expect(undone.sets[0]!.status).toBe('in_progress');
    expect(undone.currentSetIndex).toBe(0);
    expect(undone.sets[0]!.winner).toBeNull();
    expect(undone.sets[0]!.gamesA).toBe(6);
    expect(undone.sets[0]!.gamesB).toBe(5);
  });

  it('desfaz abertura do tie-break', () => {
    let match = makeMatch();
    for (let g = 0; g < 6; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }
    // Último ponto criou o tie-break
    const tiebreakGame = match.sets[0]!.games.at(-1)!;
    expect(tiebreakGame.type).toBe('tiebreak');

    const { match: undone } = undoPoint(match);

    const lastGame = undone.sets[0]!.games.at(-1)!;
    expect(lastGame.type).toBe('regular');
    expect(lastGame.status).toBe('in_progress');
    expect(undone.sets[0]!.gamesA).toBe(6);
    expect(undone.sets[0]!.gamesB).toBe(5); // B ainda tinha 5 antes do 6º game
  });
});

// ---------------------------------------------------------------------------
describe('undoPoint — desfazer encerramento de partida', () => {
  it('reabre a partida quando o último ponto do match é desfeito', () => {
    let match = makeMatch();
    // Set 1: A vence 6x0
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);
    // Set 2: A faz 5 games e chega a 40:0 no 6º
    for (let g = 0; g < 5; g++) match = scorePoints(match, 'A', 4);
    match = scorePoints(match, 'A', 3);
    const beforeMatchWon = match;
    // Ponto que fecha o match
    match = scorePoint(match, 'A');

    expect(match.status).toBe('finished');
    expect(match.winner).toBe('A');

    const { match: undone } = undoPoint(match);

    expect(undone.status).toBe('in_progress');
    expect(undone.winner).toBeNull();
    expect(undone.finishedAt).toBeNull();
    expect(undone.sets[1]!.status).toBe('in_progress');
    expect(undone.sets[1]!.gamesA).toBe(5);
    // Deve ser possível continuar registrando pontos
    const continued = scorePoint(undone, 'B');
    expect(continued.status).toBe('in_progress');
  });

  it('desfaz e refaz o mesmo ponto produz o mesmo estado', () => {
    let match = makeMatch();
    for (let g = 0; g < 3; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }

    const snapshot = match;
    const after = scorePoint(match, 'A');
    const { match: undone } = undoPoint(after);

    // Campos derivados do placar devem ser idênticos ao estado anterior
    expect(undone.sets[0]!.gamesA).toBe(snapshot.sets[0]!.gamesA);
    expect(undone.sets[0]!.gamesB).toBe(snapshot.sets[0]!.gamesB);
    expect(undone.currentSetIndex).toBe(snapshot.currentSetIndex);
    expect(undone.servingTeam).toBe(snapshot.servingTeam);
    expect(undone.pointEvents).toHaveLength(snapshot.pointEvents.length);
  });
});

// ---------------------------------------------------------------------------
describe('undoPoint — super tie-break', () => {
  it('desfaz ponto dentro do super tie-break', () => {
    let match = makeMatch();
    // Set 1: A vence 6-0; Set 2: B vence 0-6; Set 3: super TB
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'B', 4);

    // sets[0]=A won, sets[1]=B won, sets[2]=super TB in progress
    expect(match.sets).toHaveLength(3);
    expect(match.sets[2]!.type).toBe('super_tiebreak');
    expect(match.currentSetIndex).toBe(2);

    match = scorePoints(match, 'A', 5); // 5x0 no super TB
    const { match: undone } = undoPoint(match);

    expect(undone.sets[2]!.tiebreakScoreA).toBe(4);
    expect(undone.sets[2]!.tiebreakScoreB).toBe(0);
    expect(undone.sets[2]!.status).toBe('in_progress');
  });
});
