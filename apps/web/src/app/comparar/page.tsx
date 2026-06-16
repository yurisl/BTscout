import { Suspense } from 'react';
import CompararContent from './CompararContent';

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="page"><p style={{ color: 'var(--text-muted)', marginTop: 32, textAlign: 'center' }}>Carregando…</p></div>}>
      <CompararContent />
    </Suspense>
  );
}
