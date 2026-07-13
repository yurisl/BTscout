'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Match } from '@beach-tennis-scout/domain';
import { loadMatch } from '@/lib/storage';
import Scoreboard from '@/components/Scoreboard';
import MatchStats from '@/components/MatchStats';
import styles from './resumo.module.css';

export default function ResumoScreen({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    setMatch(loadMatch(matchId) ?? null);
  }, [matchId]);

  if (!match) {
    return (
      <div className="page">
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48 }}>
          Partida não encontrada.
        </p>
        <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={styles.header}>
        <Link href="/" className={styles.back}>← Início</Link>
        <h1>Estatísticas</h1>
        {match.status === 'in_progress' && (
          <Link href={`/partida/${match.id}`} className={styles.backToMatch}>
            Continuar Partida
          </Link>
        )}
      </div>

      <Scoreboard match={match} />

      <div style={{ marginTop: 16 }}>
        <MatchStats match={match} />
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {match.status === 'in_progress' && (
          <Link href={`/partida/${match.id}`} className="btn btn-primary">
            Continuar Partida
          </Link>
        )}
        <Link href="/" className="btn btn-outline">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
