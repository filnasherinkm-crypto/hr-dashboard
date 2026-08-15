import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { LayoutShell } from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'Filna — Modern HR Management Portal',
  description: 'Production-ready HR Management Portal for Acme Corp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#050505] antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
