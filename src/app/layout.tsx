import type { Metadata } from 'next';
import "./globals.css";
import { TailorSessionProvider } from '@/components/providers/TailorSessionProvider';

export const metadata: Metadata = {
  title: 'THY - Tailoring, connected.',
  description: 'Log in to your THY account to access tailoring services and smart management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-100 min-h-screen">
        <TailorSessionProvider>{children}</TailorSessionProvider>
      </body>
    </html>
  );
}
