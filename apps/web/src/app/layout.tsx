import type { Metadata, Viewport } from 'next';
import { Roboto_Flex } from 'next/font/google';
import './globals.css';

// Fonte variável, self-hosted pelo Next (sem request externo em runtime —
// mantém a garantia de PWA offline). Eixo 'wdth' liberado até 125 para
// permitir o tratamento "descolado" (mais largo/expressivo) do placar e
// dos títulos, sem precisar de uma segunda família. Ver
// Beach Tennis Scout/12-Design-System/02-Typography.md
const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Beach Tennis Scout',
  description: 'Registro ponto a ponto para beach tennis',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E88E5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={robotoFlex.variable}>
      <body>{children}</body>
    </html>
  );
}
