import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
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
            <body className={`${outfit.variable} ${playfair.variable} font-sans`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
