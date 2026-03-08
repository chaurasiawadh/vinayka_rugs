import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2S2V45SXJC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2S2V45SXJC');
          `}
        </Script>

        <Providers>
          {children}
          <SupportChatWidget />
        </Providers>
      </body>
    </html>
  );
}
