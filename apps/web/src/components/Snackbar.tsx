'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import styles from './Snackbar.module.css';

interface Props {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  durationMs?: number;
}

/** Snackbar genérico e reutilizável — auto-fecha após `durationMs` (padrão 6s). */
export default function Snackbar({ open, message, actionLabel, onAction, onClose, durationMs = 6000 }: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className={styles.wrap} role="status">
      <CheckCircle2 size={17} strokeWidth={2} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      {actionLabel && onAction && (
        <button className={styles.action} onClick={onAction}>{actionLabel}</button>
      )}
      <button className={styles.close} onClick={onClose} aria-label="Fechar">
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  );
}
