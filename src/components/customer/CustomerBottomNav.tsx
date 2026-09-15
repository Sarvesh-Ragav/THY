'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Home, Scissors, User, Users } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AUTH_PATHS } from '@/lib/customer-home-data';
import { isCustomerOnboardingComplete } from '@/lib/tailor-session';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import type { UiKey } from '@/lib/i18n';

const TABS = [
  { href: '/', labelKey: 'navHome', icon: Home, match: (path: string) => path === '/' },
  {
    href: '/explore',
    labelKey: 'navExplore',
    icon: Compass,
    match: (path: string) =>
      path.startsWith('/explore') || path.startsWith('/search') || path.startsWith('/categories'),
  },
  {
    href: '/stitch-your-outfit',
    labelKey: 'navStitch',
    icon: Scissors,
    featured: true,
    match: (path: string) => path.startsWith('/stitch-your-outfit'),
  },
  {
    href: '/tailors',
    labelKey: 'navTailors',
    icon: Users,
    match: (path: string) => path.startsWith('/tailors'),
  },
  {
    href: '/profile',
    labelKey: 'navYou',
    icon: User,
    match: (path: string) =>
      path.startsWith('/profile') ||
      path.startsWith('/my-orders') ||
      path.startsWith('/my-designs') ||
      path.startsWith('/wishlist') ||
      path.startsWith('/my-measurements') ||
      path.startsWith('/saved-addresses') ||
      path.startsWith('/payment-methods') ||
      path.startsWith('/settings') ||
      path.startsWith('/notifications'),
  },
] as const;

export function CustomerBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady } = useTailorSession();
  const { t } = useAppearance();
  const loggedIn = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);

  const go = (href: string) => {
    if (AUTH_PATHS.includes(href as (typeof AUTH_PATHS)[number]) && !loggedIn) {
      router.push('/login');
      return;
    }
    router.push(href);
  };

  return (
    <nav
      className="thy-silk-bar lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/20 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          const featured = 'featured' in tab && tab.featured;

          return (
            <button
              key={tab.href}
              type="button"
              onClick={() => go(tab.href)}
              className={`flex flex-col items-center justify-center gap-0.5 min-h-11 ${
                active ? 'text-white font-semibold' : 'text-white/80'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center ${
                  featured
                    ? `h-9 w-9 rounded-full ${active ? 'bg-white text-thy-burgundy' : 'bg-white/20 text-white'}`
                    : ''
                }`}
              >
                <Icon size={featured ? 18 : 20} strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] font-medium">{t(tab.labelKey as UiKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
