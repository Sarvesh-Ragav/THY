'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  getPostAuthPath,
  hasSubmittedVerification,
  hasTailorProfile,
} from '@/lib/tailor-session';

const NAV_LINKS = [
  { href: '/tailor-dashboard', label: 'Dashboard' },
  { href: '/tailor-dashboard/new-requests', label: 'New Requests' },
  { href: '/tailor-dashboard/active-orders', label: 'Active Orders' },
  { href: '/tailor-dashboard/availability', label: 'Availability' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady, logout } = useTailorSession();

  useEffect(() => {
    if (!isReady) return;

    if (!session.isAuthenticated) {
      router.replace('/');
      return;
    }

    if (session.role === 'customer') {
      router.replace(getPostAuthPath(session));
      return;
    }

    if (!hasTailorProfile(session)) {
      router.replace('/tailor-registration');
      return;
    }

    if (!hasSubmittedVerification(session)) {
      router.replace('/tailor-verification');
    }
  }, [isReady, session, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/tailor-dashboard') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!isReady || !session.isAuthenticated || !hasTailorProfile(session) || !hasSubmittedVerification(session)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/tailor-dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#00c9b7]">THY</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                {session.profile?.shopName || 'Tailor Studio'}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? 'text-[#00c9b7] font-semibold' : 'hover:text-gray-900'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 text-gray-600">
              <span className="hidden sm:inline text-sm font-medium text-gray-800">
                {session.profile?.fullName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-semibold text-gray-600 hover:text-[#00c9b7]"
              >
                Log out
              </button>
            </div>
          </div>

          <nav className="md:hidden flex items-center gap-4 overflow-x-auto pb-3 text-sm font-medium text-gray-600">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap ${isActive(link.href) ? 'text-[#00c9b7] font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
