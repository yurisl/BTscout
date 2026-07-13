'use client';

import { useEffect } from 'react';
import styles from './StatsDrawer.module.css';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Painel de estatísticas sobreposto à tela atual — nunca navega nem altera o
 * estado da partida. Em telas largas (desktop) aparece como painel lateral;
 * em telas estreitas (mobile) aparece como modal/bottom-sheet. Fechar o painel
 * simplesmente desmonta o overlay: o usuário retorna exatamente ao ponto da
 * partida onde estava, pois nada na tela de trás foi alterado.
 */
export default function StatsDrawer({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.handle} />
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </>
  );
}
