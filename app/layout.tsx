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
  metadataBase: new URL('https://www.vinaykarugs.com'),
  title: {
    default: 'Vinayka Rugs | Luxury Hand-Knotted Carpets',
    template: '%s | Vinayka Rugs',
  },
  description:
    'Vinayka Rugs offers premium hand-knotted carpets crafted by master artisans from Varanasi. Bespoke designs, free shipping pan India.',
  alternates: {
    canonical: 'https://www.vinaykarugs.com',
  },
  openGraph: {
    siteName: 'Vinayka Rugs',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
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
