import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import SupportChatWidget from '@/components/SupportChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vinaykarugs.com'),
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
        className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable} font-primary`}
      >
        <Providers>
          {children}
          <SupportChatWidget />
        </Providers>
      </body>
    </html>
  );
}
