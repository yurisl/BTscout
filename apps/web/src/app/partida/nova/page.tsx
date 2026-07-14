'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
              onClick={() => setType('singles')}
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
