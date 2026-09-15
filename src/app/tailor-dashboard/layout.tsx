'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/tailor-dashboard' },
  { label: 'New Requests', href: '/tailor-dashboard/new-requests' },
  { label: 'Active Orders', href: '/tailor-dashboard/active-orders' },
  { label: 'Portfolio & Profile', href: '/tailor-dashboard/portfolio' },
  { label: 'Earnings', href: '/tailor-dashboard/earnings' },
  { label: 'Availability', href: '/tailor-dashboard/availability' },
  { label: 'Settings', href: '/tailor-dashboard/settings' }, // 👈 Added Settings here
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
    return null;
  }

  const displayName = session.identifier || session.profile?.fullName || 'Tailor Account';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-extrabold text-xl tracking-wider text-slate-900">THY</span>
            <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full font-bold border border-teal-200/60">
              {displayName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Log out
          </button>
        </div>

        {/* Horizontal Navigation Bar */}
        <div className="border-t border-slate-100 bg-white px-6">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/tailor-dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#00c9b7] text-[#00c9b7] bg-teal-50/30'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}