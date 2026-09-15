'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { ThyLogo } from '@/components/auth/ThyLogo';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/tailor-dashboard' },
  { label: 'New Requests', href: '/tailor-dashboard/new-requests' },
  { label: 'Active Orders', href: '/tailor-dashboard/active-orders' },
  { label: 'Portfolio & Profile', href: '/tailor-dashboard/portfolio' },
  { label: 'Earnings', href: '/tailor-dashboard/earnings' },
  { label: 'Availability', href: '/tailor-dashboard/availability' },
  { label: 'Settings', href: '/tailor-dashboard/settings' },
];

export default function TailorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isReady, logout } = useTailorSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isReady && !session.isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, session.isAuthenticated, router]);

  if (!isReady || !session.isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-sm text-thy-muted">
        Loading...
      </div>
    );
  }

  const displayName = session.identifier || session.profile?.fullName || 'Tailor Account';

  return (
    <div className="thy-app-glow min-h-dvh flex flex-col text-thy-ink">
      <header className="thy-silk-bar sticky top-0 z-50 border-b border-white/20 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-[4.5rem] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/tailor-dashboard" className="shrink-0 inline-flex items-center text-white" aria-label="THY tailor home">
              <ThyLogo size={40} />
            </Link>
            <span
              className="hidden sm:inline text-white tracking-[0.18em] text-sm"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              THY
            </span>
            <span className="truncate bg-white/12 text-white text-[10px] uppercase tracking-[0.14em] px-3 py-1 rounded-full font-semibold border border-white/20">
              {displayName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="thy-nav-link text-[11px] uppercase tracking-[0.16em] shrink-0"
          >
            Log out
          </button>
        </div>

        <div className="border-t border-white/15 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto thy-scroll-x">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/tailor-dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`thy-nav-link thy-nav-link-tall px-4 py-3 text-[11px] uppercase tracking-[0.16em] whitespace-nowrap ${
                    isActive ? 'is-active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
