import { describe, it, expect } from 'vitest';
import { applyPoint } from '../scoring/applyPoint.js';
import { undoPoint } from '../scoring/undoPoint.js';
import { calculateStats } from '../stats/calculateStats.js';
import type { Match } from '../entities/Match.js';
import type { PointInput } from '../scoring/applyPoint.js';
import { makeMatch, playerA, playerB } from './helpers.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function score(match: Match, side: 'A' | 'B', overrides: Partial<PointInput> = {}): Match {
  const defaultPlayerId = side === 'A' ? playerA(match) : playerB(match);
  return applyPoint(match, {
    winnerSide: side,
    playerId: defaultPlayerId,
    pointType: 'winner',
    pointSubtype: 'WINNER_DIR',
    isFirstServe: true,
    ...overrides,
  }).match;
}

function scoreN(match: Match, side: 'A' | 'B', n: number): Match {
  let m = match;
  for (let i = 0; i < n; i++) m = score(m, side);
  return m;
}

// ---------------------------------------------------------------------------
describe('calculateStats — partida vazia', () => {
  it('retorna zeros para partida sem eventos', () => {
    const match = makeMatch();
    const stats = calculateStats(match);
    expect(stats.teamA.totalPoints).toBe(0);
    expect(stats.teamB.totalPoints).toBe(0);
    expect(stats.teamA.totalWinners).toBe(0);
    expect(stats.teamA.totalErrors).toBe(0);
    expect(stats.teamA.players[0]!.totalPoints).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — totalPoints', () => {
  it('invariante: totalPoints(A) + totalPoints(B) === total de eventos', () => {
    let match = makeMatch();
    match = score(match, 'A');
    match = score(match, 'B');
    match = score(match, 'A');

    const stats = calculateStats(match);
    expect(stats.teamA.totalPoints + stats.teamB.totalPoints).toBe(match.pointEvents.length);
  });

  it('erro adversário conta no totalPoints do time vencedor', () => {
    let match = makeMatch();
    // B comete um erro → A ganha o ponto
    match = applyPoint(match, {
      winnerSide: 'A',
      playerId: playerB(match), // quem errou
      pointType: 'error',
      pointSubtype: 'ERRO_DIR',
      isFirstServe: true,
    }).match;

    const stats = calculateStats(match);
    expect(stats.teamA.totalPoints).toBe(1); // A ganhou o ponto
    expect(stats.teamB.totalPoints).toBe(0);
    // O erro é do jogador B, mas totalPoints individual de B é 0
    expect(stats.teamB.players[0]!.totalPoints).toBe(0);
  });

  it('forced_error conta no totalPoints do executor e do time', () => {
    let match = makeMatch();
    match = applyPoint(match, {
      winnerSide: 'A',
      playerId: playerA(match),
      pointType: 'forced_error',
      pointSubtype: 'FORCOU_ERRO',
      isFirstServe: true,
    }).match;

    const stats = calculateStats(match);
    expect(stats.teamA.totalPoints).toBe(1);
    expect(stats.teamA.players[0]!.totalPoints).toBe(1);
    expect(stats.teamA.players[0]!.forcedErrors).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — winners por subtipo', () => {
  it('contabiliza cada subtipo corretamente', () => {
    let match = makeMatch();

    const subtypes: PointInput['pointSubtype'][] = ['WINNER_DIR', 'WINNER_ESQ', 'WINNER_PAR', 'WINNER_CRU', 'LOB', 'SMASH', 'DROP'];
    for (const sub of subtypes) {
      match = score(match, 'A', { pointSubtype: sub });
    }
    // Forçar alguns de B para não fechar o match
    for (let i = 0; i < subtypes.length; i++) match = score(match, 'B');

    const stats = calculateStats(match);
    const w = stats.teamA.winnersBySubtype;
    expect(w.winnerDir).toBe(1);
    expect(w.winnerEsq).toBe(1);
    expect(w.winnerPar).toBe(1);
    expect(w.winnerCru).toBe(1);
    expect(w.lob).toBe(1);
    expect(w.smash).toBe(1);
    expect(w.drop).toBe(1);
    expect(w.total).toBe(7);
  });

  it('ACE é contado em winners.ace', () => {
    let match = makeMatch();
    match = score(match, 'A', { pointSubtype: 'ACE', isFirstServe: true });

    const stats = calculateStats(match);
    expect(stats.teamA.winnersBySubtype.ace).toBe(1);
    expect(stats.teamA.winnersBySubtype.total).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — erros por subtipo', () => {
  it('erro é atribuído ao jogador que errou', () => {
    let match = makeMatch();
    match = applyPoint(match, {
      winnerSide: 'A',
      playerId: playerB(match),
      pointType: 'error',
      pointSubtype: 'ERRO_ESQ',
      isFirstServe: true,
    }).match;

    const stats = calculateStats(match);
    expect(stats.teamB.errorsBySubtype.erroEsq).toBe(1);
    expect(stats.teamB.totalErrors).toBe(1);
    expect(stats.teamA.totalErrors).toBe(0);
    // O time A ganhou o ponto, mas nenhum jogador de A tem totalPoints individual por isso
    expect(stats.teamA.players[0]!.totalPoints).toBe(0);
  });

  it('DUPLA_FALTA contada em errors.duplaFalta', () => {
    let match = makeMatch();
    match = applyPoint(match, {
      winnerSide: 'A',
      playerId: playerB(match),
      pointType: 'error',
      pointSubtype: 'DUPLA_FALTA',
      isFirstServe: false,
    }).match;

    const stats = calculateStats(match);
    expect(stats.teamB.errorsBySubtype.duplaFalta).toBe(1);
    expect(stats.teamB.totalErrors).toBe(1);
  });

  it('todos os subtipos de erro são contabilizados corretamente', () => {
    let match = makeMatch();
    const errSubs: PointInput['pointSubtype'][] = ['ERRO_DIR', 'ERRO_LOB', 'ERRO_SMASH', 'ERRO_SAQUE'];
    for (const sub of errSubs) {
      match = applyPoint(match, {
        winnerSide: 'A',
        playerId: playerB(match),
        pointType: 'error',
        pointSubtype: sub,
        isFirstServe: sub === 'ERRO_SAQUE',
      }).match;
      // Dar ponto a B para não fechar o match
      match = score(match, 'B');
    }

    const stats = calculateStats(match);
    const e = stats.teamB.errorsBySubtype;
    expect(e.erroDir).toBe(1);
    expect(e.erroLob).toBe(1);
    expect(e.erroSmash).toBe(1);
    expect(e.erroSaque).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — saque: primeiro saque', () => {
  it('1º saque que entra e ganha o ponto', () => {
    const match = makeMatch({ servingTeam: 'A' });
    const m = score(match, 'A', { isFirstServe: true });

    const stats = calculateStats(m);
    const srv = stats.teamA.players[0]!.serveStats;
    expect(srv.totalServesFirst).toBe(1);
    expect(srv.totalServesFirstIn).toBe(1);
    expect(srv.pointsWonOnFirstServe).toBe(1);
    expect(srv.firstServePercentage).toBe(100);
  });

  it('ERRO_SAQUE não conta como saque que entrou', () => {
    let match = makeMatch({ servingTeam: 'A' });
    match = applyPoint(match, {
      winnerSide: 'B', // B ganha porque A errou o saque
      playerId: playerA(match),
      pointType: 'error',
      pointSubtype: 'ERRO_SAQUE',
      isFirstServe: true,
    }).match;

    const stats = calculateStats(match);
    const srv = stats.teamA.players[0]!.serveStats;
    expect(srv.totalServesFirst).toBe(1);
    expect(srv.totalServesFirstIn).toBe(0);
    expect(srv.erroSaque).toBeUndefined(); // não existe em ServeStats
    expect(stats.teamA.errorsBySubtype.erroSaque).toBe(1);
    expect(srv.firstServePercentage).toBe(0);
  });

  it('ACE no 1º saque incrementa aces e winners.ace', () => {
    const match = makeMatch({ servingTeam: 'A' });
    const m = score(match, 'A', { pointSubtype: 'ACE', isFirstServe: true });

    const stats = calculateStats(m);
    const p = stats.teamA.players[0]!;
    expect(p.serveStats.aces).toBe(1);
    expect(p.winners.ace).toBe(1);
    expect(p.serveStats.totalServesFirst).toBe(1);
    expect(p.serveStats.totalServesFirstIn).toBe(1);
    expect(p.serveStats.pointsWonOnFirstServe).toBe(1);
  });

  it('% de primeiro saque: 2 de 3', () => {
    // Em singles, o servidor saca em todos os pontos do game.
    // Sequência: ERRO_SAQUE + 2 primeiros saques que entram = 3 primeiros saques totais.
    let match = makeMatch({ servingTeam: 'A' });
    match = applyPoint(match, {
      winnerSide: 'B',
      playerId: playerA(match),
      pointType: 'error',
      pointSubtype: 'ERRO_SAQUE',
      isFirstServe: true,
    }).match;
    match = score(match, 'A', { isFirstServe: true });
    match = score(match, 'A', { isFirstServe: true });

    const stats = calculateStats(match);
    const srv = stats.teamA.players[0]!.serveStats;
    expect(srv.totalServesFirst).toBe(3);
    expect(srv.totalServesFirstIn).toBe(2);
    expect(srv.firstServePercentage).toBe(67); // round(2/3*100)
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — saque: segundo saque', () => {
  it('2º saque que entra e ganha o ponto', () => {
    const match = makeMatch({ servingTeam: 'A' });
    const m = score(match, 'A', { isFirstServe: false });

    const stats = calculateStats(m);
    const srv = stats.teamA.players[0]!.serveStats;
    expect(srv.totalServesSecond).toBe(1);
    expect(srv.totalServesSecondIn).toBe(1);
    expect(srv.pointsWonOnSecondServe).toBe(1);
    expect(srv.secondServePercentage).toBe(100);
  });

  it('DUPLA_FALTA incrementa doubleFaults e totalServesSecond apenas uma vez', () => {
    let match = makeMatch({ servingTeam: 'A' });
    match = applyPoint(match, {
      winnerSide: 'B',
      playerId: playerA(match),
      pointType: 'error',
      pointSubtype: 'DUPLA_FALTA',
      isFirstServe: false,
    }).match;

    const stats = calculateStats(match);
    const srv = stats.teamA.players[0]!.serveStats;
    expect(srv.doubleFaults).toBe(1);
    expect(srv.totalServesSecond).toBe(1); // não duplicado
    expect(srv.totalServesSecondIn).toBe(0);
    expect(srv.secondServePercentage).toBe(0);
  });

  it('ACE no 2º saque incrementa aces', () => {
    const match = makeMatch({ servingTeam: 'A' });
    const m = score(match, 'A', { pointSubtype: 'ACE', isFirstServe: false });

    const stats = calculateStats(m);
    const srv = stats.teamA.players[0]!.serveStats;
    expect(srv.aces).toBe(1);
    expect(srv.totalServesSecond).toBe(1);
    expect(srv.totalServesSecondIn).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — saque: serve stats do sacador quando o executor é diferente', () => {
  // Cenário: A saca, B comete um erro não-forçado → A ganha o ponto.
  // event.servingPlayerId = A, event.playerId = B.
  // As serve stats de A DEVEM ser atualizadas mesmo assim.
  it('sacador recebe serve stats quando o adversário erra', () => {
    let match = makeMatch({ servingTeam: 'A' });
    match = applyPoint(match, {
      winnerSide: 'A',
      playerId: playerB(match),   // B errou
      pointType: 'error',
      pointSubtype: 'ERRO_DIR',
      isFirstServe: true,
    }).match;

    const stats = calculateStats(match);
    const srvA = stats.teamA.players[0]!.serveStats;
    // A estava sacando → deve ter totalServesFirst = 1
    expect(srvA.totalServesFirst).toBe(1);
    expect(srvA.totalServesFirstIn).toBe(1);
    expect(srvA.pointsWonOnFirstServe).toBe(1);
    // B não estava sacando → sem serve stats
    const srvB = stats.teamB.players[0]!.serveStats;
    expect(srvB.totalServesFirst).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — pontos por set', () => {
  it('distribui pontos nos sets corretos', () => {
    let match = makeMatch();
    // Set 1: A faz 2 pontos, B faz 1
    match = score(match, 'A');
    match = score(match, 'A');
    match = score(match, 'B');

    // Fechar set 1 para A (vence 6 games)
    // Primeiro vamos dar mais pontos para fechar o game e depois sets
    // Para simplificar: vencer 4 pontos por game × 6 games
    // Recomeça com partida limpa onde vencemos set 1 facilmente
    let m = makeMatch();
    m = score(m, 'A');
    m = score(m, 'A');
    m = score(m, 'B');
    // Salva o placar parcial antes de fechar o set
    const set1PointsA = m.pointEvents.filter((e) => e.winnerSide === 'A').length;
    const set1PointsB = m.pointEvents.filter((e) => e.winnerSide === 'B').length;
    // Fecha o game atual e o set inteiro para A (4 pontos total por game × 6 games)
    // ... mas vamos usar uma partida mais simples para isolar o teste por set
    const stats = calculateStats(m);
    expect(stats.teamA.totalPointsPerSet[0]).toBe(2);
    expect(stats.teamB.totalPointsPerSet[0]).toBe(1);
  });

  it('pontos em sets diferentes ficam em índices diferentes', () => {
    // Vencer set 1 para A (6-0) e depois dar pontos no set 2
    let match = makeMatch();
    for (let g = 0; g < 6; g++) {
      for (let p = 0; p < 4; p++) match = score(match, 'A'); // 4 pontos por game, A vence
    }
    // Agora estamos no set 2
    match = score(match, 'B');
    match = score(match, 'A');

    const stats = calculateStats(match);
    // Set 1: A fez 6×4=24 pontos, B fez 0
    expect(stats.teamA.totalPointsPerSet[0]).toBe(24);
    expect(stats.teamB.totalPointsPerSet[0]).toBe(0);
    // Set 2: A fez 1, B fez 1
    expect(stats.teamA.totalPointsPerSet[1]).toBe(1);
    expect(stats.teamB.totalPointsPerSet[1]).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — games e sets vencidos', () => {
  it('conta games vencidos por cada time', () => {
    let match = makeMatch();
    // A vence 3 games, B vence 2 games (intercalados)
    for (let g = 0; g < 3; g++) {
      for (let p = 0; p < 4; p++) match = score(match, 'A');
    }
    for (let g = 0; g < 2; g++) {
      for (let p = 0; p < 4; p++) match = score(match, 'B');
    }

    const stats = calculateStats(match);
    expect(stats.teamA.gamesWon).toBe(3);
    expect(stats.teamB.gamesWon).toBe(2);
  });

  it('conta sets vencidos por cada time', () => {
    let match = makeMatch();
    // A vence set 1 (6-0), B vence set 2 (0-6)
    for (let g = 0; g < 6; g++) for (let p = 0; p < 4; p++) match = score(match, 'A');
    for (let g = 0; g < 6; g++) for (let p = 0; p < 4; p++) match = score(match, 'B');

    const stats = calculateStats(match);
    expect(stats.teamA.setsWon).toBe(1);
    expect(stats.teamB.setsWon).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — totais de time agregam de jogadores', () => {
  it('totalWinners do time = soma dos winners individuais', () => {
    let match = makeMatch();
    match = score(match, 'A', { pointSubtype: 'SMASH' });
    match = score(match, 'A', { pointSubtype: 'LOB' });
    match = score(match, 'B'); // para não fechar

    const stats = calculateStats(match);
    expect(stats.teamA.totalWinners).toBe(2);
    expect(stats.teamA.winnersBySubtype.smash).toBe(1);
    expect(stats.teamA.winnersBySubtype.lob).toBe(1);
  });

  it('totalErrors do time = soma dos erros individuais', () => {
    let match = makeMatch();
    match = applyPoint(match, {
      winnerSide: 'A', playerId: playerB(match),
      pointType: 'error', pointSubtype: 'ERRO_DIR', isFirstServe: true,
    }).match;
    match = applyPoint(match, {
      winnerSide: 'A', playerId: playerB(match),
      pointType: 'error', pointSubtype: 'ERRO_LOB', isFirstServe: true,
    }).match;

    const stats = calculateStats(match);
    expect(stats.teamB.totalErrors).toBe(2);
    expect(stats.teamA.totalErrors).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — duplas', () => {
  it('em duplas, cada jogador recebe seus próprios stats', () => {
    let match = makeMatch({ type: 'doubles' });
    const p1A = match.teamA.players[0]!.id;
    const p2A = match.teamA.players[1]!.id;

    // Jogador 1 de A faz um smash
    match = applyPoint(match, {
      winnerSide: 'A', playerId: p1A,
      pointType: 'winner', pointSubtype: 'SMASH', isFirstServe: true,
    }).match;
    // Jogador 2 de A faz um lob
    match = applyPoint(match, {
      winnerSide: 'A', playerId: p2A,
      pointType: 'winner', pointSubtype: 'LOB', isFirstServe: true,
    }).match;
    match = score(match, 'B'); // B ganha um ponto
    match = score(match, 'B');

    const stats = calculateStats(match);
    const pStats1 = stats.teamA.players.find((p) => p.playerId === p1A)!;
    const pStats2 = stats.teamA.players.find((p) => p.playerId === p2A)!;

    expect(pStats1.winners.smash).toBe(1);
    expect(pStats1.winners.lob).toBe(0);
    expect(pStats2.winners.lob).toBe(1);
    expect(pStats2.winners.smash).toBe(0);
    expect(stats.teamA.totalWinners).toBe(2);
  });
});

// ---------------------------------------------------------------------------
describe('calculateStats — consistência com undo', () => {
  it('recalcular após undo remove a contribuição do ponto desfeito', () => {
    let match = makeMatch();
    match = score(match, 'A', { pointSubtype: 'SMASH' });
    match = score(match, 'A', { pointSubtype: 'LOB' }); // este é o último evento

    const statsBefore = calculateStats(match);
    expect(statsBefore.teamA.totalPoints).toBe(2);
    expect(statsBefore.teamA.winnersBySubtype.lob).toBe(1);

    // Desfaz o lob (último evento)
    const { match: undone } = undoPoint(match);
    const statsAfter = calculateStats(undone);

    expect(statsAfter.teamA.totalPoints).toBe(1);
    expect(statsAfter.teamA.winnersBySubtype.lob).toBe(0);
    expect(statsAfter.teamA.winnersBySubtype.smash).toBe(1);
    expect(statsAfter.teamA.totalWinners).toBe(1);
  });

  it('undo de DUPLA_FALTA remove da contagem sem duplicar', () => {
    let match = makeMatch({ servingTeam: 'A' });
    match = applyPoint(match, {
      winnerSide: 'B',
      playerId: playerA(match),
      pointType: 'error',
      pointSubtype: 'DUPLA_FALTA',
      isFirstServe: false,
    }).match;

    const statsWith = calculateStats(match);
    expect(statsWith.teamA.errorsBySubtype.duplaFalta).toBe(1);
    expect(statsWith.teamA.serveStats.doubleFaults).toBe(1);
    expect(statsWith.teamA.serveStats.totalServesSecond).toBe(1);

    const { match: undone } = undoPoint(match);
    const statsWithout = calculateStats(undone);
    expect(statsWithout.teamA.errorsBySubtype.duplaFalta).toBe(0);
    expect(statsWithout.teamA.serveStats.doubleFaults).toBe(0);
    expect(statsWithout.teamA.serveStats.totalServesSecond).toBe(0);
  });

  it('invariante totalPoints se mantém após múltiplos undos', () => {
    let match = makeMatch();
    for (let i = 0; i < 5; i++) match = score(match, i % 2 === 0 ? 'A' : 'B');

    let { match: m } = undoPoint(match);
    ({ match: m } = undoPoint(m));

    const stats = calculateStats(m);
    expect(stats.teamA.totalPoints + stats.teamB.totalPoints).toBe(m.pointEvents.length);
  });
});
