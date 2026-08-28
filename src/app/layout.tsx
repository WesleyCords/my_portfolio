import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Space_Grotesk } from 'next/font/google';
import './globals.css';

const heading = Archivo_Black({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: '400',
});
const body = Space_Grotesk({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wesley Cordeiro | Dev',
  description:
    'Portfólio dedicado a mostrar meus projetos e habilidades para ser um novo Desenvolvedor',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111214',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${heading.variable} ${body.variable} font-sans antialiased`}>
        {children}
        {<Analytics />}
      </body>
    </html>
  );
}
