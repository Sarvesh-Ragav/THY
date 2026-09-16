'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import { ThyLogo } from '@/components/auth/ThyLogo';
import { AppearanceControls } from '@/components/customer/AppearanceControls';
import { TAILOR_NAV_I18N } from '@/lib/i18n';
import { ensureStudioWorkspace } from '@/lib/tailor-studio';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/tailor-dashboard' },
  { label: 'Requests', href: '/tailor-dashboard/new-requests' },
  { label: 'Orders', href: '/tailor-dashboard/active-orders' },
  { label: 'Chat', href: '/tailor-dashboard/chat' },
  { label: 'Portfolio', href: '/tailor-dashboard/portfolio' },
  { label: 'Earnings', href: '/tailor-dashboard/earnings' },
  { label: 'Availability', href: '/tailor-dashboard/availability' },
  { label: 'Settings', href: '/tailor-dashboard/settings' },
];

export default function TailorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isReady, logout, updateSession } = useTailorSession();
  const { t } = useAppearance();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady && !session.isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, session.isAuthenticated, router]);

  useEffect(() => {
    if (!isReady || !session.isAuthenticated || session.role !== 'tailor') return;
    const seeded = ensureStudioWorkspace(session);
    if (seeded) updateSession(seeded);
  }, [isReady, session, updateSession]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  if (!isReady || !session.isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-sm text-thy-muted font-sans">
        {t('loading')}
      </div>
    );
  }

  const displayName = session.profile?.fullName || 'Tailor Account';
  const displayEmail = session.identifier.includes('@') ? session.identifier : session.profile?.phone || '';
  const unreadCount = (session.notifications ?? []).filter((item) => !item.isRead).length;

  return (
    <div
      className="thy-app-glow min-h-dvh bg-transparent text-thy-ink flex flex-col"
      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
    >
      <header className="thy-silk-bar sticky top-0 z-50 border-b border-white/20 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-[4.5rem] flex items-center gap-3">
          <Link
            href="/tailor-dashboard"
            className="shrink-0 inline-flex items-center text-white"
            aria-label="THY tailor home"
          >
            <ThyLogo size={40} />
          </Link>

          <p className="hidden sm:block text-[11px] uppercase tracking-[0.18em] text-white/70">
            {t('tailorWorkspace')}
          </p>

          <div className="ml-auto flex items-center gap-1">
            <AppearanceControls />
            <Link
              href="/tailor-dashboard/notifications"
              aria-label="Notifications"
              className="thy-nav-icon relative inline-flex items-center justify-center h-11 w-11"
            >
              <Bell size={18} />
              {unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-white text-thy-burgundy text-[9px] font-bold leading-4 text-center">
                  {unreadCount}
                </span>
              ) : null}
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((open) => !open)}
                className="thy-nav-link thy-nav-link-tall inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] min-h-11 px-2"
              >
                <User size={14} />
                <span className="max-w-[10rem] truncate">{displayName}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-thy-surface border border-thy-ink/10 shadow-xl py-2 z-50 rounded-xl">
                  <div className="px-4 py-3 border-b border-thy-burgundy/10">
                    <p className="text-xs font-semibold text-thy-ink truncate">{displayName}</p>
                    <p className="text-[10px] text-thy-subtle uppercase tracking-[0.14em] mt-0.5">
                      {session.profile?.shopName || t('tailorPartner')}
                    </p>
                    {displayEmail ? (
                      <p className="text-[10px] text-thy-subtle truncate mt-0.5">{displayEmail}</p>
                    ) : null}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/tailor-dashboard/profile-preview"
                      className="block px-4 py-2.5 text-xs font-medium text-thy-ink hover:bg-thy-mist"
                    >
                      {t('tailorProfile')}
                    </Link>
                    <Link
                      href="/tailor-dashboard/portfolio"
                      className="block px-4 py-2.5 text-xs font-medium text-thy-ink hover:bg-thy-mist"
                    >
                      {t('tailorWork')}
                    </Link>
                    <Link
                      href="/tailor-dashboard/settings"
                      className="block px-4 py-2.5 text-xs font-medium text-thy-ink hover:bg-thy-mist"
                    >
                      {t('tailorSettings')}
                    </Link>
                  </div>
                  <div className="border-t border-thy-burgundy/10 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                        router.push('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-thy-brand hover:bg-thy-mist text-left"
                    >
                      <LogOut size={12} />
                      {t('navLogout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 px-4 sm:px-6">
          <nav className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto thy-scroll-x">
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
                  {t(TAILOR_NAV_I18N[link.href])}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
