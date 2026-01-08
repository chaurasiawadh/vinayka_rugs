import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

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
            <body className={`${inter.variable} ${playfair.variable} font-sans`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
