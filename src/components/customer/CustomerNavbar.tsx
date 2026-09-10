'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getCustomerFirstName, getPostAuthPath, isCustomerOnboardingComplete } from '@/lib/tailor-session';
import { CUSTOMER_NAV_LINKS } from '@/lib/customer-home-data';

export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady, logout } = useTailorSession();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const loggedIn = isReady && session.isAuthenticated;
  const isCustomer = loggedIn && session.role === 'customer' && isCustomerOnboardingComplete(session);
  const isTailor = loggedIn && session.role === 'tailor';

  return (
    <header className="sticky top-0 z-50 border-b border-[#2C2418]/10 bg-[#F3EEE4]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center gap-4">
        <Link
          href="/"
          className="text-2xl tracking-[0.18em] text-[#2C2418] shrink-0"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          THY
        </Link>

        <nav className="hidden lg:flex items-center gap-7 mx-auto">
          {CUSTOMER_NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#5C5146] hover:text-[#2C2418] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          className="hidden md:flex items-center ml-auto lg:ml-0 flex-1 max-w-xs border border-[#2C2418]/15 bg-white/50 px-3 py-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tailors, sarees, cities"
            className="w-full bg-transparent text-sm text-[#2C2418] placeholder:text-[#8A7D70] outline-none"
          />
        </form>

        <div className="ml-auto lg:ml-0 flex items-center gap-3 shrink-0">
          {isCustomer && (
            <Link
              href="/customer-account"
              className={`hidden sm:inline text-[11px] uppercase tracking-[0.2em] ${
                pathname === '/customer-account' ? 'text-[#2C2418] font-semibold' : 'text-[#5C5146] hover:text-[#2C2418]'
              }`}
            >
              {getCustomerFirstName(session)}
            </Link>
          )}

          {isTailor && (
            <Link
              href={getPostAuthPath(session)}
              className="hidden sm:inline text-[11px] uppercase tracking-[0.2em] text-[#5C5146] hover:text-[#2C2418]"
            >
              Studio
            </Link>
          )}

          {loggedIn ? (
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="text-[11px] uppercase tracking-[0.2em] text-[#5C5146] hover:text-[#2C2418]"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="hero-leather-btn px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2C2418]"
            >
              Log In
            </Link>
          )}

          <button
            type="button"
            className="lg:hidden text-[#2C2418] text-sm tracking-[0.16em] uppercase"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#2C2418]/10 px-4 py-4 space-y-3 bg-[#F3EEE4]">
          {CUSTOMER_NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              onClick={() => setMenuOpen(false)}
              className="block text-[11px] uppercase tracking-[0.22em] text-[#5C5146]"
            >
              {item.label}
            </Link>
          ))}
          {!loggedIn && (
            <Link href="/signup" className="block text-[11px] uppercase tracking-[0.22em] text-[#2C2418]">
              Create account
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
