import { describe, it, expect } from 'vitest';
import { applyPoint } from '../scoring/applyPoint.js';
import type { Match } from '../entities/Match.js';
import { makeMatch, playerA, playerB } from './helpers.js';

// Helpers para aplicar N pontos consecutivos para o mesmo lado
function scorePoints(match: Match, side: 'A' | 'B', count: number): Match {
  let current = match;
  const pid = side === 'A' ? playerA(current) : playerB(current);
  for (let i = 0; i < count; i++) {
    ({ match: current } = applyPoint(current, {
      winnerSide: side,
      playerId: pid,
      pointType: 'winner',
      pointSubtype: 'WINNER_DIR',
      isFirstServe: true,
    }));
  }
  return current;
}

function currentGame(match: Match) {
  const set = match.sets[match.currentSetIndex]!;
  return set.games.findLast((g) => g.status === 'in_progress') ?? set.games.at(-1)!;
}

// ---------------------------------------------------------------------------
describe('Progressão de pontos — game regular', () => {
  it('começa em 0:0', () => {
    const match = makeMatch();
    const game = currentGame(match);
    expect(game.pointsA).toBe(0);
    expect(game.pointsB).toBe(0);
  });

  it('incrementa 1 ponto para o lado correto', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 1);
    expect(currentGame(match).pointsA).toBe(1); // equivale a 15
  });

  it('progressão 0 → 15 → 30 → 40 (3 pontos brutos)', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3);
    expect(currentGame(match).pointsA).toBe(3);
    expect(currentGame(match).pointsB).toBe(0);
  });

  it('4 pontos sem deuce fecha o game', () => {
    let match = makeMatch();
    ({ match } = applyPoint(match, {
      winnerSide: 'A', playerId: playerA(match),
      pointType: 'winner', pointSubtype: 'WINNER_DIR', isFirstServe: true,
    }));
    ({ match } = applyPoint(match, {
      winnerSide: 'A', playerId: playerA(match),
      pointType: 'winner', pointSubtype: 'WINNER_DIR', isFirstServe: true,
    }));
    ({ match } = applyPoint(match, {
      winnerSide: 'A', playerId: playerA(match),
      pointType: 'winner', pointSubtype: 'WINNER_DIR', isFirstServe: true,
    }));
    const { match: final, transitions } = applyPoint(match, {
      winnerSide: 'A', playerId: playerA(match),
      pointType: 'winner', pointSubtype: 'WINNER_DIR', isFirstServe: true,
    });

    expect(transitions).toContain('game_won');
    const set = final.sets[0]!;
    expect(set.gamesA).toBe(1);
    expect(set.gamesB).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe('Deuce e Vantagem', () => {
  it('3x3 não encerra o game (deuce)', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3);
    match = scorePoints(match, 'B', 3);
    const game = currentGame(match);
    expect(game.pointsA).toBe(3);
    expect(game.pointsB).toBe(3);
    expect(game.status).toBe('in_progress');
    expect(game.winner).toBeNull();
  });

  it('4x3 após deuce = vantagem A (ainda in_progress)', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3);
    match = scorePoints(match, 'B', 3);
    match = scorePoints(match, 'A', 1); // vantagem A
    const game = currentGame(match);
    expect(game.pointsA).toBe(4);
    expect(game.pointsB).toBe(3);
    expect(game.status).toBe('in_progress');
  });

  it('4x3 → 4x4 = deuce novamente', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3);
    match = scorePoints(match, 'B', 3);
    match = scorePoints(match, 'A', 1); // vantagem A
    match = scorePoints(match, 'B', 1); // volta ao deuce
    const game = currentGame(match);
    expect(game.pointsA).toBe(4);
    expect(game.pointsB).toBe(4);
    expect(game.status).toBe('in_progress');
  });

  it('5x3 após deuce encerra o game para A', () => {
    let match = makeMatch();
    match = scorePoints(match, 'A', 3);
    match = scorePoints(match, 'B', 3);
    match = scorePoints(match, 'A', 1); // 4x3 vantagem A
    const { match: final, transitions } = applyPoint(match, {
      winnerSide: 'A', playerId: playerA(match),
      pointType: 'winner', pointSubtype: 'SMASH', isFirstServe: false,
    });
    expect(transitions).toContain('game_won');
    expect(final.sets[0]!.gamesA).toBe(1);
  });

  it('deuce múltiplo: 3 deuces antes de fechar', () => {
    let match = makeMatch();
    // Levar a 3x3
    match = scorePoints(match, 'A', 3);
    match = scorePoints(match, 'B', 3);
    // 1º deuce → vantagem A → deuce
    match = scorePoints(match, 'A', 1);
    match = scorePoints(match, 'B', 1);
    // 2º deuce → vantagem B → deuce
    match = scorePoints(match, 'B', 1);
    match = scorePoints(match, 'A', 1);
    // 3º deuce → vantagem A → game A
    match = scorePoints(match, 'A', 1);
    const { match: final, transitions } = applyPoint(match, {
      winnerSide: 'A', playerId: playerA(match),
      pointType: 'winner', pointSubtype: 'ACE', isFirstServe: true,
    });
    expect(transitions).toContain('game_won');
    expect(final.sets[0]!.gamesA).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('Game vencido e progressão de set', () => {
  it('vencer 6 games consecutivos fecha o set', () => {
    let match = makeMatch();
    for (let g = 0; g < 6; g++) {
      match = scorePoints(match, 'A', 4);
    }
    const set = match.sets[0]!;
    expect(set.status).toBe('finished');
    expect(set.winner).toBe('A');
    expect(set.gamesA).toBe(6);
    expect(set.gamesB).toBe(0);
  });

  it('5x5 → 7x5 fecha o set sem tie-break', () => {
    let match = makeMatch();
    // 5 games para cada
    for (let g = 0; g < 5; g++) match = scorePoints(match, 'A', 4);
    for (let g = 0; g < 5; g++) match = scorePoints(match, 'B', 4);
    // 6x5
    match = scorePoints(match, 'A', 4);
    // 7x5
    match = scorePoints(match, 'A', 4);
    const set = match.sets[0]!;
    expect(set.status).toBe('finished');
    expect(set.winner).toBe('A');
    expect(set.gamesA).toBe(7);
    expect(set.gamesB).toBe(5);
  });

  it('6x6 inicia tie-break', () => {
    let match = makeMatch();
    // Intercalar para chegar a 6x6 sem fechar o set antes
    for (let g = 0; g < 6; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }
    const set = match.sets[0]!;
    const tiebreakGame = set.games.at(-1)!;
    expect(tiebreakGame.type).toBe('tiebreak');
    expect(tiebreakGame.status).toBe('in_progress');
  });

  it('tie-break: vencer por 7 com 2 de diferença', () => {
    let match = makeMatch();
    for (let g = 0; g < 6; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }
    // A vence tie-break 7x0
    match = scorePoints(match, 'A', 7);
    const set = match.sets[0]!;
    expect(set.status).toBe('finished');
    expect(set.winner).toBe('A');
    expect(set.gamesA).toBe(7); // placar de set sempre 7x6
    expect(set.gamesB).toBe(6);
    expect(set.tiebreakScoreA).toBe(7);
  });

  it('tie-break: 6x6 no placar do tie-break exige 2 de diferença', () => {
    let match = makeMatch();
    for (let g = 0; g < 6; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }
    // Tie-break chega a 6x6 — sem winner ainda
    for (let i = 0; i < 6; i++) match = scorePoints(match, 'A', 1);
    for (let i = 0; i < 6; i++) match = scorePoints(match, 'B', 1);
    const set = match.sets[0]!;
    expect(set.status).toBe('in_progress');
    // 8x6 → A vence
    match = scorePoints(match, 'A', 1);
    match = scorePoints(match, 'A', 1);
    expect(match.sets[0]!.status).toBe('finished');
    expect(match.sets[0]!.winner).toBe('A');
  });
});

// ---------------------------------------------------------------------------
describe('Progressão da partida', () => {
  it('vencer 2 sets (melhor de 3) encerra a partida', () => {
    let match = makeMatch();

    // Set 1: A vence 6x0
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);

    // Set 2: A vence 6x0
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);

    expect(match.status).toBe('finished');
    expect(match.winner).toBe('A');
    expect(match.finishedAt).not.toBeNull();
  });

  it('2 sets cada cria super tie-break no set 3', () => {
    let match = makeMatch();

    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'B', 4);

    expect(match.sets.length).toBe(3);
    expect(match.sets[2]!.type).toBe('super_tiebreak');
  });

  it('super tie-break: vencer por 10 com 2 de diferença', () => {
    let match = makeMatch();

    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'B', 4);

    // A vence super TB 10x0
    match = scorePoints(match, 'A', 10);

    expect(match.status).toBe('finished');
    expect(match.winner).toBe('A');
    expect(match.sets[2]!.tiebreakScoreA).toBe(10);
  });

  it('rejeita ponto em partida encerrada', () => {
    let match = makeMatch();
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);
    for (let g = 0; g < 6; g++) match = scorePoints(match, 'A', 4);

    expect(() =>
      applyPoint(match, {
        winnerSide: 'A', playerId: playerA(match),
        pointType: 'winner', pointSubtype: 'ACE', isFirstServe: true,
      }),
    ).toThrow(/não está em andamento/);
  });

  it('rejeita winner com playerId que não pertence ao winnerSide', () => {
    const match = makeMatch();
    expect(() =>
      applyPoint(match, {
        winnerSide: 'A',
        playerId: playerB(match), // jogador do time B numa declaração de winner para A
        pointType: 'winner',
        pointSubtype: 'WINNER_DIR',
        isFirstServe: true,
      }),
    ).toThrow(/não pertence/);
  });

  it('rejeita erro com playerId que não pertence ao time perdedor', () => {
    const match = makeMatch();
    expect(() =>
      applyPoint(match, {
        winnerSide: 'A',
        playerId: playerA(match), // A ganhou e A errou? inválido
        pointType: 'error',
        pointSubtype: 'ERRO_DIR',
        isFirstServe: true,
      }),
    ).toThrow(/deve pertencer ao time que perdeu/);
  });
});

// ---------------------------------------------------------------------------
describe('Troca de saque', () => {
  it('saque muda após cada game regular', () => {
    const match = makeMatch({ servingTeam: 'A' });
    expect(match.servingTeam).toBe('A');
    const after = scorePoints(match, 'A', 4);
    expect(after.servingTeam).toBe('B');
  });

  it('no tie-break o saque alterna a cada 2 pontos', () => {
    let match = makeMatch({ servingTeam: 'A' });
    // Chegar a 6x6 intercalando
    for (let g = 0; g < 6; g++) {
      match = scorePoints(match, 'A', 4);
      match = scorePoints(match, 'B', 4);
    }

    const servingAtTiebreak = match.servingTeam;
    // Após o 1º ponto do tie-break o saque deve mudar
    const afterPoint1 = scorePoints(match, 'A', 1);
    expect(afterPoint1.servingTeam).not.toBe(servingAtTiebreak);
    // Após o 2º ponto deve permanecer no mesmo time (serve 2 pontos seguidos)
    const afterPoint2 = scorePoints(afterPoint1, 'A', 1);
    expect(afterPoint2.servingTeam).toBe(afterPoint1.servingTeam);
    // Após o 3º ponto, volta a trocar
    const afterPoint3 = scorePoints(afterPoint2, 'A', 1);
    expect(afterPoint3.servingTeam).not.toBe(afterPoint2.servingTeam);
  });
});
