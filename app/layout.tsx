import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import SupportChatWidget from '@/components/SupportChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Vinayka Rugs | Luxury Hand-Knotted Carpets',
  description: 'Vinayka Rugs offers premium hand-knotted carpets.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-primary`}
      >
        <Providers>
          {children}
          <SupportChatWidget />
        </Providers>
      </body>
    </html>
  );
}
