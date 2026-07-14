'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TeamSide } from '@beach-tennis-scout/domain';
import { createMatch } from '@/lib/matchFactory';
import { saveMatch } from '@/lib/storage';
import styles from './nova.module.css';

export default function NovaPartidaPage() {
  const router = useRouter();
  const [type, setType] = useState<'singles' | 'doubles'>('doubles');
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [firstServingTeam, setFirstServingTeam] = useState<TeamSide>('A');
  const [teamAServerIdx, setTeamAServerIdx] = useState(0);
  const [teamBServerIdx, setTeamBServerIdx] = useState(0);
  const [tournament, setTournament] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  function validate(): string | null {
    if (!a1.trim()) return 'Informe o nome do Jogador A1';
    if (!b1.trim()) return 'Informe o nome do Jogador B1';
    if (type === 'doubles') {
      if (!a2.trim()) return 'Informe o nome do Jogador A2';
      if (!b2.trim()) return 'Informe o nome do Jogador B2';
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    const teamAPlayers = type === 'doubles' ? [a1.trim(), a2.trim()] : [a1.trim()];
    const teamBPlayers = type === 'doubles' ? [b1.trim(), b2.trim()] : [b1.trim()];

    const match = createMatch({
      type,
      teamAPlayers,
      teamBPlayers,
      teamAFirstServerIndex: type === 'doubles' ? teamAServerIdx : 0,
      teamBFirstServerIndex: type === 'doubles' ? teamBServerIdx : 0,
      firstServingTeam,
      context: {
        ...(tournament ? { tournamentName: tournament.trim() } : {}),
        ...(location ? { location: location.trim() } : {}),
        ...(category ? { category: category.trim() } : {}),
      },
    });

    saveMatch(match);
    router.push(`/partida/${match.id}`);
  }

  return (
    <div className="page">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.back}>← Voltar</button>
        <h1>Nova Partida</h1>
      </header>

      <form onSubmit={handleSubmit} className="stack">
        {/* Tipo */}
        <div className="card">
          <label>Tipo de partida</label>
          <div className={styles.segmented}>
            <button
              type="button"
              className={type === 'singles' ? styles.segActive : styles.segItem}
              onClick={() => { setType('singles'); setTeamAServerIdx(0); setTeamBServerIdx(0); }}
            >
              Simples
            </button>
            <button
              type="button"
              className={type === 'doubles' ? styles.segActive : styles.segItem}
              onClick={() => setType('doubles')}
            >
              Duplas
            </button>
          </div>
        </div>

        {/* Times */}
        <div className="card stack">
          <div className={styles.teamHeader} style={{ color: 'var(--color-a)' }}>Time A</div>
          <div>
            <label>Jogador 1</label>
            <input value={a1} onChange={(e) => setA1(e.target.value)} placeholder="Nome" />
          </div>
          {type === 'doubles' && (
            <div>
              <label>Jogador 2</label>
              <input value={a2} onChange={(e) => setA2(e.target.value)} placeholder="Nome" />
            </div>
          )}
        </div>

        <div className="card stack">
          <div className={styles.teamHeader} style={{ color: 'var(--color-b)' }}>Time B</div>
          <div>
            <label>Jogador 1</label>
            <input value={b1} onChange={(e) => setB1(e.target.value)} placeholder="Nome" />
          </div>
          {type === 'doubles' && (
            <div>
              <label>Jogador 2</label>
              <input value={b2} onChange={(e) => setB2(e.target.value)} placeholder="Nome" />
            </div>
          )}
        </div>

        {/* Saque inicial do 1º set */}
        <div className="card stack">
          {type === 'doubles' ? (
            <>
              <div>
                <label style={{ color: 'var(--color-a)' }}>Quem saca primeiro pela Dupla A?</label>
                <div className={styles.segmented}>
                  <button
                    type="button"
                    className={teamAServerIdx === 0 ? styles.segActive : styles.segItem}
                    onClick={() => setTeamAServerIdx(0)}
                  >
                    {a1 || 'Jogador A1'}
                  </button>
                  <button
                    type="button"
                    className={teamAServerIdx === 1 ? styles.segActive : styles.segItem}
                    onClick={() => setTeamAServerIdx(1)}
                  >
                    {a2 || 'Jogador A2'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--color-b)' }}>Quem saca primeiro pela Dupla B?</label>
                <div className={styles.segmented}>
                  <button
                    type="button"
                    className={teamBServerIdx === 0 ? styles.segActive : styles.segItem}
                    onClick={() => setTeamBServerIdx(0)}
                  >
                    {b1 || 'Jogador B1'}
                  </button>
                  <button
                    type="button"
                    className={teamBServerIdx === 1 ? styles.segActive : styles.segItem}
                    onClick={() => setTeamBServerIdx(1)}
                  >
                    {b2 || 'Jogador B2'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ marginTop: 4 }}>Qual dupla fará o primeiro saque do set?</label>
                <div className={styles.segmented}>
                  <button
                    type="button"
                    className={firstServingTeam === 'A' ? styles.segActive : styles.segItem}
                    onClick={() => setFirstServingTeam('A')}
                    style={firstServingTeam === 'A' ? { background: 'var(--color-a)' } : {}}
                  >
                    Dupla A
                  </button>
                  <button
                    type="button"
                    className={firstServingTeam === 'B' ? styles.segActive : styles.segItem}
                    onClick={() => setFirstServingTeam('B')}
                    style={firstServingTeam === 'B' ? { background: 'var(--color-b)' } : {}}
                  >
                    Dupla B
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Essa configuração vale só para o 1º set. No início do 2º set e do Super
                Tie-Break, o app pergunta novamente.
              </p>
            </>
          ) : (
            <div>
              <label>Quem saca primeiro?</label>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={firstServingTeam === 'A' ? styles.segActive : styles.segItem}
                  onClick={() => setFirstServingTeam('A')}
                  style={firstServingTeam === 'A' ? { background: 'var(--color-a)' } : {}}
                >
                  Time A
                </button>
                <button
                  type="button"
                  className={firstServingTeam === 'B' ? styles.segActive : styles.segItem}
                  onClick={() => setFirstServingTeam('B')}
                  style={firstServingTeam === 'B' ? { background: 'var(--color-b)' } : {}}
                >
                  Time B
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contexto (opcional) */}
        <details className="card">
          <summary className={styles.detailsSummary}>Informações opcionais</summary>
          <div className="stack" style={{ marginTop: 12 }}>
            <div>
              <label>Torneio</label>
              <input value={tournament} onChange={(e) => setTournament(e.target.value)} placeholder="Nome do torneio" />
            </div>
            <div>
              <label>Local</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local" />
            </div>
            <div>
              <label>Categoria</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Misto B" />
            </div>
          </div>
        </details>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className="btn btn-primary">
          Iniciar Partida
        </button>
      </form>
    </div>
  );
}
