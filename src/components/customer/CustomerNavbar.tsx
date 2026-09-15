'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, MapPin, Menu, Search, User, X, LogOut } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AUTH_PATHS, CITIES, MAIN_NAV, PROFILE_MENU } from '@/lib/customer-home-data';

export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady, updateSession, logout } = useTailorSession();
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const desktopLocationRef = useRef<HTMLDivElement>(null);
  const mobileLocationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Directly evaluate session state managed by TailorSessionProvider
  const loggedIn = isReady && session.isAuthenticated;
  const displayName = session.identifier || 'Account';

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      const inDesktopLocation = desktopLocationRef.current?.contains(target);
      const inMobileLocation = mobileLocationRef.current?.contains(target);
      if (!inDesktopLocation && !inMobileLocation) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
    setLocationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  // Handle logout with global context state update & smooth SPA redirection
  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const goAuthPath = (href: string) => {
    if (href === '/notifications') {
      router.push('/notifications');
      return;
    }
    if (AUTH_PATHS.includes(href as (typeof AUTH_PATHS)[number]) && !loggedIn) {
      router.push('/login');
      return;
    }
    router.push(href);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setMenuOpen(false);
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const locationLabel = session.selectedLocation || 'Location';

  return (
    <header className="sticky top-0 z-50 border-b border-thy-ink/10 bg-thy-bg/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-[4.5rem] flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="text-xl sm:text-2xl tracking-[0.16em] text-thy-deep shrink-0 font-serif"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
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
          className="hidden lg:flex items-center ml-auto flex-1 max-w-sm border border-thy-ink/15 bg-thy-surface/80 px-3 py-2 rounded-lg"
          onSubmit={submitSearch}
        >
          <Search size={16} className="text-thy-subtle shrink-0 mr-2" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search designs, styles or tailors..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-thy-subtle"
          />
        </form>

        <div className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
          <div className="relative" ref={desktopLocationRef}>
            <button
              type="button"
              onClick={() => setLocationOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-thy-muted min-h-11 hover:text-thy-ink"
            >
              <MapPin size={14} />
              {locationLabel}
            </button>
            {locationOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-thy-surface border border-thy-ink/10 shadow-lg p-2 z-50 rounded-lg">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="block w-full text-left px-2 py-2 text-sm text-thy-ink hover:bg-thy-mist min-h-11 rounded"
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
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-thy-muted min-h-11 hover:text-thy-ink"
          >
            <Bell size={14} />
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
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-thy-muted min-h-11 hover:text-thy-ink"
            >
              <User size={14} />
              <span>{loggedIn ? displayName : 'Profile'}</span>
            </button>

            {profileOpen && loggedIn && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-thy-ink/10 shadow-xl py-2 z-50 rounded-xl">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                  <p className="text-[10px] text-gray-400 truncate">Customer Account</p>
                </div>
                {PROFILE_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 hover:text-[#00c9b7]"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 border-t border-gray-100 mt-1"
                  onClick={handleLogout}
                >
                  <LogOut size={12} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex lg:hidden items-center gap-0.5 ml-auto shrink-0">
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex items-center justify-center h-11 w-11 text-thy-muted"
            onClick={() => goAuthPath('/notifications')}
          >
            <Bell size={18} />
          </button>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center h-11 w-11 text-thy-ink"
            onClick={() => {
              setSearchOpen(false);
              setLocationOpen(false);
              setMenuOpen((open) => !open);
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}