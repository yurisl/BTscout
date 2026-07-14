'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Play, ChartColumnIncreasing, Trash2 } from 'lucide-react';
import styles from './MatchMenu.module.css';

interface Props {
  status: 'pending' | 'in_progress' | 'finished';
  continueHref: string;
  statsHref: string;
  onDeleteRequest: () => void;
}

/**
 * Menu de contexto (⋮) de um cartão de partida. Item de continuar/ver
 * estatísticas depende do status; excluir aparece sempre. Fecha ao clicar
 * fora ou ao escolher uma opção.
 */
export default function MatchMenu({ status, continueHref, statsHref, onDeleteRequest }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        className={styles.trigger}
        onClick={(e) => { stop(e); setOpen((v) => !v); }}
        aria-label="Opções da partida"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={18} strokeWidth={2} />
      </button>

      {open && (
        <div className={styles.menu} role="menu" onClick={stop}>
          {status === 'in_progress' && (
            <button
              className={styles.item}
              role="menuitem"
              onClick={(e) => { stop(e); setOpen(false); router.push(continueHref); }}
            >
              <Play size={16} strokeWidth={2} />
              Continuar partida
            </button>
          )}
          {status === 'finished' && (
            <button
              className={styles.item}
              role="menuitem"
              onClick={(e) => { stop(e); setOpen(false); router.push(statsHref); }}
            >
              <ChartColumnIncreasing size={16} strokeWidth={2} />
              Ver estatísticas
            </button>
          )}
          <button
            className={`${styles.item} ${styles.danger}`}
            role="menuitem"
            onClick={(e) => { stop(e); setOpen(false); onDeleteRequest(); }}
          >
            <Trash2 size={16} strokeWidth={2} />
            Excluir partida
          </button>
        </div>
      )}
    </div>
  );
}
