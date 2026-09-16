'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Heart, Menu, Search, ShoppingBag, User, X, LogOut } from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getAccountDisplayName, getCustomerFirstName } from '@/lib/tailor-session';
import { AUTH_PATHS, MAIN_NAV, PROFILE_MENU } from '@/lib/customer-home-data';
import { NAV_I18N, PROFILE_I18N } from '@/lib/i18n';
import { ThyLogo } from '@/components/auth/ThyLogo';
import { CustomerLocationControl } from '@/components/customer/CustomerLocationControl';
import { AppearanceControls } from '@/components/customer/AppearanceControls';
import { favoritedDesigns } from '@/lib/wishlist';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import { unreadCount } from '@/lib/notifications';

const iconBtn = 'thy-nav-icon inline-flex items-center justify-center h-11 w-11';

export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady, logout } = useTailorSession();
  const { t } = useAppearance();
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const loggedIn = isReady && session.isAuthenticated;
  const wishlistCount = favoritedDesigns(session).length;
  const notificationCount = unreadCount(session.customerNotifications);
  const fullName = getAccountDisplayName(session);
  const displayName = session.customerProfile?.fullName
    ? getCustomerFirstName(session)
    : fullName === 'Account'
      ? 'Account'
      : fullName.split(/\s+/)[0];
  const accountEmail = session.customerProfile?.email || (session.identifier.includes('@') ? session.identifier : '');

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    if (pathname === '/search') {
      const next = new URLSearchParams(window.location.search).get('q') || '';
      setQuery(next);
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const goAuthPath = (href: string) => {
    setMenuOpen(false);
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
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const profileMenu = (
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
        className="thy-nav-link thy-nav-link-tall inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] min-h-11 px-2"
      >
        <User size={14} />
        <span className="hidden sm:inline" suppressHydrationWarning>
          {loggedIn ? displayName : t('navProfile')}
        </span>
      </button>

      {profileOpen && loggedIn && (
        <div className="absolute right-0 mt-2 w-52 bg-thy-surface border border-thy-ink/10 shadow-xl py-2 z-50 rounded-xl">
          <div className="px-4 py-2 border-b border-thy-burgundy/10">
            <p className="text-xs font-bold text-thy-ink truncate">{fullName}</p>
            <p className="text-[10px] text-thy-subtle truncate">{accountEmail || t('customerAccount')}</p>
          </div>
          {PROFILE_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setProfileOpen(false)}
              className="block px-4 py-2 text-xs font-medium text-thy-ink hover:bg-thy-mist hover:text-thy-burgundy"
            >
              {t(PROFILE_I18N[item.href])}
            </Link>
          ))}
          <button
            type="button"
            className="w-full text-left px-4 py-2 text-xs font-semibold text-thy-brand hover:bg-thy-mist flex items-center gap-1.5 border-t border-thy-burgundy/10 mt-1"
            onClick={handleLogout}
          >
            <LogOut size={12} />
            {t('navLogout')}
          </button>
        </div>
      )}
    </div>
  );

  const utilityIcons = (
    <div className="flex items-center gap-0.5 shrink-0">
      <AppearanceControls />
      <button type="button" aria-label={t('navNotifications')} className={`${iconBtn} relative`} onClick={() => goAuthPath('/notifications')}>
        <Bell size={18} />
        {notificationCount > 0 ? (
          <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-white text-thy-burgundy text-[9px] font-bold leading-4 text-center">
            {notificationCount}
          </span>
        ) : null}
      </button>
      <button type="button" aria-label={t('navWishlist')} className={`${iconBtn} relative`} onClick={() => goAuthPath('/wishlist')}>
        <Heart size={18} className={wishlistCount > 0 ? 'fill-current' : undefined} />
        {wishlistCount > 0 ? (
          <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-white text-thy-burgundy text-[9px] font-bold leading-4 text-center">
            {wishlistCount}
          </span>
        ) : null}
      </button>
      <button type="button" aria-label={t('navCart')} className={iconBtn} onClick={() => goAuthPath('/stitch-your-outfit/cart')}>
        <ShoppingBag size={18} />
      </button>
    </div>
  );

  return (
    <header className="thy-silk-bar sticky top-0 z-50 border-b border-white/20 pt-[env(safe-area-inset-top)]" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-2 sm:gap-4">
        <Link href="/" className="shrink-0 inline-flex items-center text-white" aria-label="THY home">
          <ThyLogo size={40} />
        </Link>

        <CustomerLocationControl />

        <nav className="hidden md:flex flex-1 items-center justify-center gap-5 lg:gap-7" aria-label="Primary">
          {MAIN_NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => goAuthPath(item.href)}
              className={`thy-nav-link text-[11px] uppercase tracking-[0.18em] pb-1 ${
                pathname === item.href ? 'is-active' : ''
              }`}
            >
              {t(NAV_I18N[item.href])}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          {profileMenu}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center h-11 w-11 text-white"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="thy-silk-subbar border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center gap-2 sm:gap-3">
          <form
            className="flex-1 min-w-0 flex items-center border border-white/35 bg-white/18 backdrop-blur-md px-3 h-10 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
            onSubmit={submitSearch}
          >
            <Search size={16} className="text-white/80 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('navSearchPlaceholder')}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/70"
            />
          </form>
          {utilityIcons}
        </div>
      </div>

      {menuOpen ? (
        <div className="md:hidden border-t border-white/15 bg-[rgba(92,26,36,0.96)] px-4 py-3 space-y-1">
          {MAIN_NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => goAuthPath(item.href)}
              className={`block w-full text-left px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] ${
                pathname === item.href ? 'text-white font-semibold' : 'text-white/80'
              }`}
            >
              {t(NAV_I18N[item.href])}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}
