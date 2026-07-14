import { describe, it, expect } from 'vitest';
import { applyPoint } from '../scoring/applyPoint.js';
import { configureFirstServer, configureNextServer } from '../scoring/configureServe.js';
import { remainingServes, nextSideChangeAt, isSideChangePoint } from '../scoring/serve.js';
import type { Match, MatchType, TeamSide } from '../entities/Match.js';
import { DEFAULT_FORMAT } from '../entities/Match.js';
import { makePlayer, makeMatch } from './helpers.js';

// ---------------------------------------------------------------------------
// Helper: monta uma partida cujo set atual já é o Super Tie-Break (set 3),
// para testar a mecânica do STB isoladamente, sem precisar jogar 2 sets
// inteiros antes.
// ---------------------------------------------------------------------------

function makeSuperTiebreakMatch(
  opts: {
    type?: MatchType;
    firstServingTeam?: TeamSide;
  } = {},
): { match: Match; a1: string; a2: string | null; b1: string; b2: string | null } {
  const matchId = 'm-stb';
  const teamAId = 't-a';
  const teamBId = 't-b';
  const type = opts.type ?? 'doubles';

  const playerA1 = makePlayer('A1', teamAId, matchId, 1);
  const playerA2 = type === 'doubles' ? makePlayer('A2', teamAId, matchId, 2) : null;
  const playerB1 = makePlayer('B1', teamBId, matchId, 1);
  const playerB2 = type === 'doubles' ? makePlayer('B2', teamBId, matchId, 2) : null;

  const teamAPlayers = playerA2 ? [playerA1, playerA2] : [playerA1];
  const teamBPlayers = playerB2 ? [playerB1, playerB2] : [playerB1];

  const skeleton: Match = {
    id: matchId,
    type,
    status: 'in_progress',
    format: DEFAULT_FORMAT,
    teamA: { id: teamAId, side: 'A', players: teamAPlayers, matchId },
    teamB: { id: teamBId, side: 'B', players: teamBPlayers, matchId },
    servingTeam: 'A',
    servingPlayerId: null,
    currentSetIndex: 0,
    sets: [
      {
        id: 's-3',
        matchId,
        setNumber: 3,
        type: 'super_tiebreak',
        gamesA: 0,
        gamesB: 0,
        tiebreakScoreA: 0,
        tiebreakScoreB: 0,
        status: 'in_progress',
        winner: null,
        serverConfig: null,
        games: [],
      },
    ],
    winner: null,
    pointEvents: [],
    startedAt: new Date(),
    finishedAt: null,
    createdAt: new Date(),
  };

  const firstServingTeam = opts.firstServingTeam ?? 'A';
  const firstServerId = firstServingTeam === 'A' ? playerA1.id : playerB1.id;
  let match = configureFirstServer(skeleton, { firstServingTeam, firstServerId });

  if (type === 'doubles') {
    const otherServerId = firstServingTeam === 'A' ? playerB1.id : playerA1.id;
    match = configureNextServer(match, { serverId: otherServerId });
  }

  return { match, a1: playerA1.id, a2: playerA2?.id ?? null, b1: playerB1.id, b2: playerB2?.id ?? null };
}

function scorePoint(match: Match, side: TeamSide, playerId: string) {
  return applyPoint(match, {
    winnerSide: side,
    playerId,
    pointType: 'winner',
    pointSubtype: 'WINNER_PAR',
    isFirstServe: true,
  });
}

// ---------------------------------------------------------------------------
describe('Super Tie-Break — regras oficiais', () => {
  it('rejeita pontos antes do sacador do set ser configurado', () => {
    const { match } = makeSuperTiebreakMatch();
    const unconfigured: Match = { ...match, sets: [{ ...match.sets[0]!, serverConfig: null }] };
    expect(() => scorePoint(unconfigured, 'A', 'x')).toThrow(/Configure o sacador/);
  });

  it('não cria nenhum Game — pontuação vai direto para o Set', () => {
    const { match, a1 } = makeSuperTiebreakMatch();
    const { match: final } = scorePoint(match, 'A', a1);
    expect(final.sets[0]!.games).toHaveLength(0);
    expect(final.sets[0]!.type).toBe('super_tiebreak');
  });

  it('contagem direta: 1, 2, 3... sem 15/30/40', () => {
    const { match, a1 } = makeSuperTiebreakMatch();
    let m = match;
    for (let i = 1; i <= 5; i++) {
      ({ match: m } = scorePoint(m, 'A', a1));
      expect(m.sets[0]!.tiebreakScoreA).toBe(i);
    }
    expect(m.sets[0]!.tiebreakScoreB).toBe(0);
  });

  it('não vence em 10x9 (falta 1 ponto de vantagem)', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch();
    let m = match;
    // Intercala até 9x9 para não fechar prematuramente com 10x0
    for (let i = 0; i < 9; i++) {
      ({ match: m } = scorePoint(m, 'A', a1));
      ({ match: m } = scorePoint(m, 'B', b1));
    }
    ({ match: m } = scorePoint(m, 'A', a1)); // 10x9
    expect(m.sets[0]!.tiebreakScoreA).toBe(10);
    expect(m.sets[0]!.tiebreakScoreB).toBe(9);
    expect(m.sets[0]!.status).toBe('in_progress');
    expect(m.status).toBe('in_progress');
  });

  it('vence em 11x9 (2 de vantagem após 10x9)', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch();
    let m = match;
    for (let i = 0; i < 9; i++) {
      ({ match: m } = scorePoint(m, 'A', a1));
      ({ match: m } = scorePoint(m, 'B', b1));
    }
    ({ match: m } = scorePoint(m, 'A', a1)); // 10x9 — ainda em andamento
    const { match: final, transitions } = scorePoint(m, 'A', a1); // 11x9
    expect(final.sets[0]!.tiebreakScoreA).toBe(11);
    expect(final.sets[0]!.status).toBe('finished');
    expect(final.sets[0]!.winner).toBe('A');
    expect(final.status).toBe('finished');
    expect(final.winner).toBe('A');
    expect(transitions).toContain('set_won');
    expect(transitions).toContain('match_won');
  });

  it('empate em 9x9 continua — não é ponto decisivo isolado como no game regular', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch();
    let m = match;
    for (let i = 0; i < 9; i++) {
      ({ match: m } = scorePoint(m, 'A', a1));
      ({ match: m } = scorePoint(m, 'B', b1));
    }
    expect(m.sets[0]!.tiebreakScoreA).toBe(9);
    expect(m.sets[0]!.tiebreakScoreB).toBe(9);
    expect(m.sets[0]!.status).toBe('in_progress');

    // 10x9 — ainda não decide
    ({ match: m } = scorePoint(m, 'A', a1));
    expect(m.sets[0]!.status).toBe('in_progress');

    // 10x10 — segue empatado
    ({ match: m } = scorePoint(m, 'B', b1));
    expect(m.sets[0]!.tiebreakScoreA).toBe(10);
    expect(m.sets[0]!.tiebreakScoreB).toBe(10);
    expect(m.sets[0]!.status).toBe('in_progress');

    // 12x10 — abre 2 de vantagem, vence
    ({ match: m } = scorePoint(m, 'A', a1));
    const { match: final } = scorePoint(m, 'A', a1);
    expect(final.sets[0]!.tiebreakScoreA).toBe(12);
    expect(final.sets[0]!.status).toBe('finished');
    expect(final.sets[0]!.winner).toBe('A');
  });

  it('placar de exibição é sempre o número bruto de pontos (ex: 7 x 6), nunca 15/30/40/Vantagem/Deuce', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch();
    let m = match;
    for (let i = 0; i < 7; i++) ({ match: m } = scorePoint(m, 'A', a1));
    for (let i = 0; i < 6; i++) ({ match: m } = scorePoint(m, 'B', b1));
    // O "placar" do STB é diretamente tiebreakScoreA/B — não existe nenhuma
    // camada de conversão para 15/30/40 (essa conversão só existe para
    // games regulares, via toDisplayScore, nunca aplicada ao STB pela UI).
    expect(m.sets[0]!.tiebreakScoreA).toBe(7);
    expect(m.sets[0]!.tiebreakScoreB).toBe(6);
  });
});

// ---------------------------------------------------------------------------
describe('Super Tie-Break — ordem oficial de saque (duplas)', () => {
  it('1º sacador serve 1 ponto, depois cada jogador serve 2: A1→B1→A2→B2→A1...', () => {
    const { match, a1, a2, b1, b2 } = makeSuperTiebreakMatch({ firstServingTeam: 'A' });
    expect(match.servingPlayerId).toBe(a1); // sacador do 1º ponto

    const servers: string[] = [];
    let m = match;
    for (let i = 0; i < 8; i++) {
      servers.push(m.servingPlayerId!);
      ({ match: m } = scorePoint(m, i % 2 === 0 ? 'A' : 'B', i % 2 === 0 ? a1 : b1));
    }
    expect(servers).toEqual([a1, b1, b1, a2, a2, b2, b2, a1]);
  });

  it('quando a Dupla B saca primeiro, a ordem começa por B1', () => {
    const { match, a1, a2, b1, b2 } = makeSuperTiebreakMatch({ firstServingTeam: 'B' });
    expect(match.servingPlayerId).toBe(b1);

    const servers: string[] = [];
    let m = match;
    for (let i = 0; i < 8; i++) {
      servers.push(m.servingPlayerId!);
      ({ match: m } = scorePoint(m, 'A', a1));
    }
    expect(servers).toEqual([b1, a1, a1, b2, b2, a2, a2, b1]);
  });

  it('em simples, apenas o time alterna 1-2-2-2 — o jogador nunca muda', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch({ type: 'singles', firstServingTeam: 'A' });
    const servers: { team: TeamSide; player: string }[] = [];
    let m = match;
    for (let i = 0; i < 8; i++) {
      servers.push({ team: m.servingTeam, player: m.servingPlayerId! });
      ({ match: m } = scorePoint(m, 'A', a1));
    }
    expect(servers.map((s) => s.team)).toEqual(['A', 'B', 'B', 'A', 'A', 'B', 'B', 'A']);
    expect(servers.every((s) => s.player === (s.team === 'A' ? a1 : b1))).toBe(true);
  });

  it('configureFirstServer rejeita jogador que não pertence à dupla escolhida', () => {
    const { match, b1 } = makeSuperTiebreakMatch();
    const unconfigured: Match = { ...match, sets: [{ ...match.sets[0]!, serverConfig: null }] };
    expect(() =>
      configureFirstServer(unconfigured, { firstServingTeam: 'A', firstServerId: b1 }),
    ).toThrow(/não pertence à Dupla A/);
  });

  it('configureFirstServer rejeita ser chamada duas vezes no mesmo set', () => {
    const { match, a1 } = makeSuperTiebreakMatch();
    // makeSuperTiebreakMatch já configura o set inteiro — chamar de novo deve rejeitar
    expect(() =>
      configureFirstServer(match, { firstServingTeam: 'A', firstServerId: a1 }),
    ).toThrow(/já foi configurado/);
  });

  it('configureNextServer rejeita jogador que não pertence a nenhuma dupla da partida', () => {
    const { match } = makeSuperTiebreakMatch();
    const unconfiguredB: Match = {
      ...match,
      sets: [{ ...match.sets[0]!, serverConfig: { ...match.sets[0]!.serverConfig!, teamBRotation: null } }],
    };
    expect(() =>
      configureNextServer(unconfiguredB, { serverId: 'jogador-inexistente' }),
    ).toThrow(/não pertence a nenhuma das duplas/);
  });

  it('configureNextServer rejeita reconfigurar uma dupla que já tem rotação definida', () => {
    const { match, b1 } = makeSuperTiebreakMatch();
    // makeSuperTiebreakMatch já configurou as duas duplas — configureNextServer deve rejeitar
    expect(() =>
      configureNextServer(match, { serverId: b1 }),
    ).toThrow(/já foi configurado/);
  });

  it('bloqueia o 2º ponto do Super Tie-Break até a dupla adversária ser configurada, depois libera automaticamente', () => {
    const { match, a1, a2, b1 } = makeSuperTiebreakMatch({ firstServingTeam: 'A' });
    // Zera a rotação da Dupla B para simular o estado real logo após configureFirstServer
    // (antes de qualquer configureNextServer) — só a Dupla A tem rotação neste ponto.
    const onlyA: Match = {
      ...match,
      servingPlayerId: a1,
      sets: [{ ...match.sets[0]!, serverConfig: { ...match.sets[0]!.serverConfig!, teamBRotation: null } }],
    };

    // 1º ponto: sacado pela Dupla A (já configurada) — passa normalmente
    const { match: afterPoint1 } = scorePoint(onlyA, 'A', a1);
    expect(afterPoint1.sets[0]!.tiebreakScoreA).toBe(1);
    // Agora é a vez da Dupla B sacar, mas ela ainda não tem rotação — servingPlayerId fica null
    expect(afterPoint1.servingTeam).toBe('B');
    expect(afterPoint1.servingPlayerId).toBeNull();

    // 2º ponto bloqueado até configurar quem saca pela Dupla B
    expect(() => scorePoint(afterPoint1, 'B', b1)).toThrow(/Configure o sacador/);

    // Configura o sacador da Dupla B (pergunta feita exatamente agora, após o 1º ponto)
    const configured = configureNextServer(afterPoint1, { serverId: b1 });
    expect(configured.servingPlayerId).toBe(b1);

    // A partir daqui, a rotação segue automática sem nenhuma pergunta nova
    const { match: afterPoint2 } = scorePoint(configured, 'B', b1);
    expect(afterPoint2.servingPlayerId).toBe(b1); // B1 ainda saca o 3º ponto (2 saques)
    const { match: afterPoint3 } = scorePoint(afterPoint2, 'B', b1);
    expect(afterPoint3.servingPlayerId).toBe(a2); // volta para a Dupla A, com o outro jogador (A2)
  });
});

// ---------------------------------------------------------------------------
describe('Super Tie-Break — mudança de lado (aviso informativo)', () => {
  it('emite side_change quando o total de pontos atinge 1, 5, 9, 13...', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch();
    const totalsWithSideChange: number[] = [];
    let m = match;
    for (let i = 1; i <= 16; i++) {
      const { match: next, transitions } = scorePoint(m, i % 2 === 0 ? 'B' : 'A', i % 2 === 0 ? b1 : a1);
      if (transitions.includes('side_change')) totalsWithSideChange.push(i);
      m = next;
    }
    expect(totalsWithSideChange).toEqual([1, 5, 9, 13]);
  });

  it('não emite side_change em totais que não são marco de troca', () => {
    const { match, a1 } = makeSuperTiebreakMatch();
    const { transitions } = scorePoint(match, 'A', a1);
    // total=1 é marco — pega o 2º ponto, que não é (total=2)
    const { match: afterFirst } = scorePoint(match, 'A', a1);
    const { transitions: secondTransitions } = scorePoint(afterFirst, 'A', a1);
    expect(transitions).toContain('side_change');
    expect(secondTransitions).not.toContain('side_change');
  });

  it('suprime o aviso de troca de lado quando o ponto também encerra o set/partida', () => {
    const { match, a1, b1 } = makeSuperTiebreakMatch();
    let m = match;
    // Chega a 9x7 (16 pontos) sem nenhum vencedor prematuro
    for (let i = 0; i < 9; i++) ({ match: m } = scorePoint(m, 'A', a1));
    for (let i = 0; i < 7; i++) ({ match: m } = scorePoint(m, 'B', b1));
    expect(m.sets[0]!.tiebreakScoreA).toBe(9);
    expect(m.sets[0]!.tiebreakScoreB).toBe(7);
    expect(m.status).toBe('in_progress');

    // 17º ponto: 10x7 — vence a partida, e o total (17) seria marco de troca
    const { match: final, transitions } = scorePoint(m, 'A', a1);
    expect(final.sets[0]!.tiebreakScoreA).toBe(10);
    expect(final.status).toBe('finished');
    expect(transitions).toContain('match_won');
    expect(transitions).not.toContain('side_change');
  });
});

// ---------------------------------------------------------------------------
describe('Super Tie-Break — helpers de exibição (cabeçalho)', () => {
  it('remainingServes: 1º sacador tem 1 saque; os demais têm 2', () => {
    expect(remainingServes(0)).toBe(1); // prestes a cobrar o ponto 1
    expect(remainingServes(1)).toBe(2); // prestes a cobrar o ponto 2 (1º de um bloco de 2)
    expect(remainingServes(2)).toBe(1); // prestes a cobrar o ponto 3 (último do bloco)
    expect(remainingServes(3)).toBe(2); // prestes a cobrar o ponto 4 (1º de novo bloco)
    expect(remainingServes(4)).toBe(1);
  });

  it('nextSideChangeAt: sempre aponta o próximo marco (1, 5, 9, 13...)', () => {
    expect(nextSideChangeAt(0)).toBe(1);
    expect(nextSideChangeAt(1)).toBe(5);
    expect(nextSideChangeAt(4)).toBe(5);
    expect(nextSideChangeAt(5)).toBe(9);
    expect(nextSideChangeAt(12)).toBe(13);
  });

  it('isSideChangePoint: true exatamente em 1, 5, 9, 13, 17, 21', () => {
    const marks = [1, 5, 9, 13, 17, 21];
    for (let total = 0; total <= 22; total++) {
      expect(isSideChangePoint(total)).toBe(marks.includes(total));
    }
  });
});

// ---------------------------------------------------------------------------
describe('Super Tie-Break — integração via progressão real da partida (duplas)', () => {
  function scoreGamesFor(match: Match, side: TeamSide, playerId: string, games: number): Match {
    let m = match;
    for (let g = 0; g < games; g++) {
      for (let p = 0; p < 4; p++) {
        ({ match: m } = scorePoint(m, side, playerId));
      }
    }
    return m;
  }

  it('cada set (1º, 2º e Super Tie-Break) reinicia o fluxo de duas etapas: sacador inicial antes do 1º ponto, sacador adversário após o 1º game/ponto', () => {
    let m = makeMatch({ type: 'doubles' });
    const a1 = m.teamA.players[0]!.id;
    const a2 = m.teamA.players[1]!.id;
    const b1 = m.teamB.players[0]!.id;
    const b2 = m.teamB.players[1]!.id;

    // ─── Set 1 já vem configurado pelo makeMatch (helper de teste) ─────────
    m = scoreGamesFor(m, 'A', a1, 6);
    expect(m.sets[0]!.status).toBe('finished');
    expect(m.sets[0]!.winner).toBe('A');
    expect(m.currentSetIndex).toBe(1);
    expect(m.sets[1]!.serverConfig).toBeNull();
    expect(m.servingPlayerId).toBeNull(); // set 2 reinicia — nada é herdado do set 1

    // Duplas: não é possível registrar ponto no set 2 sem configurar o sacador inicial
    expect(() => scorePoint(m, 'A', a1)).toThrow(/Configure o sacador/);

    // Etapa 1 do set 2: "Quem iniciará o saque neste set?" (Dupla B) → "Qual jogador?" (B1)
    m = configureFirstServer(m, { firstServingTeam: 'B', firstServerId: b1 });
    expect(m.servingTeam).toBe('B');
    expect(m.servingPlayerId).toBe(b1);

    // O 1º game do set 2 já pode ser jogado — só a Dupla B tem rotação
    m = scoreGamesFor(m, 'B', b1, 1);
    expect(m.sets[1]!.gamesB).toBe(1);
    // Agora é a vez da Dupla A sacar o 2º game, mas ela ainda não tem rotação
    expect(m.servingTeam).toBe('A');
    expect(m.servingPlayerId).toBeNull();
    expect(() => scorePoint(m, 'A', a1)).toThrow(/Configure o sacador/);

    // Etapa 2 do set 2: "Quem sacará neste game?" — só os jogadores da Dupla A
    m = configureNextServer(m, { serverId: a1 });
    expect(m.servingPlayerId).toBe(a1);

    // A partir daqui a rotação é 100% automática pelo resto do set 2
    m = scoreGamesFor(m, 'B', b1, 5); // Dupla B fecha 6x0 no set 2 (1 já feito acima)
    expect(m.sets[1]!.status).toBe('finished');
    expect(m.sets[1]!.winner).toBe('B');
    expect(m.currentSetIndex).toBe(2);

    // ─── Set 3 (decisivo) — Super Tie-Break — reinicia tudo de novo ───────
    expect(m.sets[2]!.type).toBe('super_tiebreak');
    expect(m.sets[2]!.serverConfig).toBeNull();
    expect(m.servingPlayerId).toBeNull();
    expect(() => scorePoint(m, 'A', a2)).toThrow(/Configure o sacador/);

    // Etapa 1 do STB: "Quem fará o primeiro saque?" (Dupla A) → "Qual jogador?" (A2)
    m = configureFirstServer(m, { firstServingTeam: 'A', firstServerId: a2 });
    expect(m.servingTeam).toBe('A');
    expect(m.servingPlayerId).toBe(a2);

    // 1º ponto do STB: sacado por A2 (dupla já configurada)
    m = (() => { const r = scorePoint(m, 'A', a2); return r.match; })();
    expect(m.sets[2]!.tiebreakScoreA).toBe(1);
    // Agora é a vez da Dupla B sacar (2 pontos), mas ainda não tem rotação
    expect(m.servingTeam).toBe('B');
    expect(m.servingPlayerId).toBeNull();
    expect(() => scorePoint(m, 'B', b1)).toThrow(/Configure o sacador/);

    // Etapa 2 do STB: "Qual jogador da dupla adversária fará os próximos dois saques?"
    m = configureNextServer(m, { serverId: b1 });
    expect(m.servingPlayerId).toBe(b1);

    // Resto do Super Tie-Break 100% automático, vence a partida
    m = (() => {
      let cur = m;
      for (let i = 0; i < 9; i++) ({ match: cur } = scorePoint(cur, 'A', a2));
      return cur;
    })();
    expect(m.sets[2]!.tiebreakScoreA).toBe(10);
    expect(m.status).toBe('finished');
    expect(m.winner).toBe('A');
  });

  it('simples: configureFirstServer sozinha resolve o set inteiro — configureNextServer nunca é necessária', () => {
    let m = makeMatch({ type: 'singles' });
    const a1 = m.teamA.players[0]!.id;
    const b1 = m.teamB.players[0]!.id;

    m = scoreGamesFor(m, 'A', a1, 6);
    expect(m.currentSetIndex).toBe(1);
    expect(m.sets[1]!.serverConfig).toBeNull();

    // Uma única pergunta ("quem inicia sacando?" com nomes dos jogadores) resolve tudo
    m = configureFirstServer(m, { firstServingTeam: 'B', firstServerId: b1 });
    expect(m.sets[1]!.serverConfig!.teamARotation).toEqual([a1, a1]);
    expect(m.sets[1]!.serverConfig!.teamBRotation).toEqual([b1, b1]);

    // O 1º game já sacado pela Dupla B — e o 2º game (Dupla A) NÃO fica bloqueado,
    // pois simples nunca precisa da segunda etapa.
    m = scoreGamesFor(m, 'B', b1, 1);
    expect(m.servingTeam).toBe('A');
    expect(m.servingPlayerId).toBe(a1); // já resolvido, sem pergunta adicional
    m = scoreGamesFor(m, 'A', a1, 1);
    expect(m.sets[1]!.gamesA).toBe(1);
  });
});
