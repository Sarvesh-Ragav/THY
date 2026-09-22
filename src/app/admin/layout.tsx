'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { ThyLogo } from '@/components/auth/ThyLogo';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/tailors', label: 'Tailors' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady, logout, accessToken } = useTailorSession();

  useEffect(() => {
    if (!isReady) return;
    if (!session.isAuthenticated || !accessToken) {
      router.replace('/login');
      return;
    }
    if (session.role !== 'admin') {
      router.replace(getPostAuthPath(session));
    }
  }, [accessToken, isReady, router, session]);

  if (!isReady || !session.isAuthenticated || session.role !== 'admin') {
    return (
      <div className="min-h-dvh flex items-center justify-center text-sm text-thy-muted" suppressHydrationWarning>
        Loading admin...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-thy-cream text-thy-ink" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
      <header className="thy-silk-bar sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/admin" className="inline-flex items-center text-white shrink-0" aria-label="Admin home">
            <ThyLogo size={36} />
          </Link>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 hidden sm:block">Admin</p>
          <nav className="flex-1 flex items-center gap-1 overflow-x-auto thy-scroll-x">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`thy-nav-link px-3 py-2 text-[11px] uppercase tracking-[0.14em] whitespace-nowrap ${
                    active ? 'is-active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.14em] text-white/85 hover:text-white"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">{children}</main>
    </div>
  );
}
