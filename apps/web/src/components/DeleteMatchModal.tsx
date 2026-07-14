'use client';

import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './DeleteMatchModal.module.css';

interface Props {
  open: boolean;
  matchLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmação de exclusão de partida — modal centrado, placar/lista visível ao fundo. */
export default function DeleteMatchModal({ open, matchLabel, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-label="Excluir partida?"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.icon}>
          <Trash2 size={20} strokeWidth={2} />
        </div>
        <p className={styles.title}>Excluir partida?</p>
        <p className={styles.subtitle}>{matchLabel}</p>
        <p className={styles.desc}>
          Esta ação remove permanentemente todos os dados desta partida. Você poderá desfazer logo em seguida, mas não depois de fechar o aviso de confirmação.
        </p>
        <div className={styles.actions}>
          <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
          <button className={`btn ${styles.confirmBtn}`} onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}
