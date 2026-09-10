'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AUTH_PATHS, CITIES, MAIN_NAV, PROFILE_MENU } from '@/lib/customer-home-data';
import { isCustomerOnboardingComplete } from '@/lib/tailor-session';

export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady, updateSession, logout } = useTailorSession();
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const loggedIn = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const goAuthPath = (href: string) => {
    if (AUTH_PATHS.includes(href as (typeof AUTH_PATHS)[number]) && !loggedIn) {
      router.push('/login');
      return;
    }
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-thy-ink/10 bg-thy-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[4.5rem] flex items-center gap-3">
        <Link href="/" className="text-2xl tracking-[0.16em] text-thy-deep shrink-0" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          THY
        </Link>

        <nav className="hidden lg:flex items-center gap-5 ml-4">
          {MAIN_NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => goAuthPath(item.href)}
              className={`text-[11px] uppercase tracking-[0.18em] ${
                pathname === item.href ? 'text-thy-brand font-semibold' : 'text-thy-muted hover:text-thy-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <form
          className="hidden md:flex items-center ml-auto flex-1 max-w-sm border border-thy-ink/15 bg-thy-surface/80 px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search designs, styles or tailors..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-thy-subtle"
          />
        </form>

        <div className="flex items-center gap-3 ml-auto md:ml-2 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocationOpen((open) => !open)}
              className="text-[11px] uppercase tracking-[0.14em] text-thy-muted"
            >
              {session.selectedLocation || 'Set location'}
            </button>
            {locationOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-thy-surface border border-thy-ink/10 shadow-lg p-2 z-50">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="block w-full text-left px-2 py-2 text-sm text-thy-ink hover:bg-thy-mist"
                    onClick={() => {
                      updateSession({ selectedLocation: city });
                      setLocationOpen(false);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => goAuthPath('/notifications')}
            className="text-[11px] uppercase tracking-[0.14em] text-thy-muted"
          >
            Notifications
          </button>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                if (!loggedIn) {
                  router.push('/login');
                  return;
                }
                setProfileOpen((open) => !open);
              }}
              className="text-[11px] uppercase tracking-[0.14em] text-thy-muted"
            >
              Profile
            </button>
            {profileOpen && loggedIn && (
              <div className="absolute right-0 mt-2 w-52 bg-thy-surface border border-thy-ink/10 shadow-lg py-2 z-50">
                {PROFILE_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-thy-muted hover:bg-thy-mist hover:text-thy-ink"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-thy-muted hover:bg-thy-mist hover:text-thy-ink"
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                    router.push('/');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button type="button" className="lg:hidden text-[11px] uppercase tracking-[0.16em] text-thy-ink" onClick={() => setMenuOpen((open) => !open)}>
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-thy-ink/10 px-4 py-3 space-y-2 bg-thy-bg">
          {MAIN_NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              className="block text-[11px] uppercase tracking-[0.18em] text-thy-muted"
              onClick={() => {
                setMenuOpen(false);
                goAuthPath(item.href);
              }}
            >
              {item.label}
            </button>
          ))}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search designs, styles or tailors..."
              className="w-full mt-2 border border-thy-ink/15 px-3 py-2 text-sm bg-thy-surface outline-none"
            />
          </form>
        </div>
      )}
    </header>
  );
}
