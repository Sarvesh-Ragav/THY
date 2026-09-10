'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Home, Scissors, User, Users } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AUTH_PATHS } from '@/lib/customer-home-data';
import { isCustomerOnboardingComplete } from '@/lib/tailor-session';

const TABS = [
  { href: '/', label: 'Home', icon: Home, match: (path: string) => path === '/' },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
    match: (path: string) =>
      path.startsWith('/explore') || path.startsWith('/search') || path.startsWith('/categories'),
  },
  {
    href: '/stitch-your-outfit',
    label: 'Stitch',
    icon: Scissors,
    featured: true,
    match: (path: string) => path.startsWith('/stitch-your-outfit'),
  },
  {
    href: '/tailors',
    label: 'Tailors',
    icon: Users,
    match: (path: string) => path.startsWith('/tailors'),
  },
  {
    href: '/profile',
    label: 'You',
    icon: User,
    match: (path: string) =>
      path.startsWith('/profile') ||
      path.startsWith('/my-orders') ||
      path.startsWith('/my-designs') ||
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
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-thy-ink/10 bg-thy-bg/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
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
                active ? 'text-thy-brand' : 'text-thy-muted'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center ${
                  featured
                    ? `h-9 w-9 rounded-full ${active ? 'bg-thy-brand text-thy-canvas' : 'bg-thy-mist text-thy-deep'}`
                    : ''
                }`}
              >
                <Icon size={featured ? 18 : 20} strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
