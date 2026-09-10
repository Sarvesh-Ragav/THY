import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import "./globals.css";
import { TailorSessionProvider } from '@/components/providers/TailorSessionProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'THY — Bespoke Indian wear, tailored locally.',
  description: 'Find artisan tailors for sarees, salwars, sherwanis and lehengas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased bg-thy-bg text-thy-ink min-h-screen">
        <TailorSessionProvider>{children}</TailorSessionProvider>
      </body>
    </html>
  );
}
