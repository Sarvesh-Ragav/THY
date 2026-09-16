import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import "./globals.css";
import { TailorSessionProvider } from '@/components/providers/TailorSessionProvider';
import { AppearanceProvider } from '@/components/providers/AppearanceProvider';
import { GlobalCustomerHeader } from '@/components/layout/GlobalCustomerHeader';

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
  applicationName: 'THY',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'THY',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#5C1A24',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="antialiased bg-thy-cream text-thy-ink min-h-dvh font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var a=JSON.parse(localStorage.getItem('thy-appearance')||'{}');if(a.darkMode)document.documentElement.classList.add('dark');if(a.language)document.documentElement.lang=a.language;document.documentElement.style.colorScheme=a.darkMode?'dark':'light';}catch(e){}`,
          }}
        />
        <AppearanceProvider>
          <TailorSessionProvider>
            <GlobalCustomerHeader />
            {children}
          </TailorSessionProvider>
        </AppearanceProvider>
      </body>
    </html>
  );
}
