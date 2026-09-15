'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function TailorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isReady, logout } = useTailorSession();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !session.isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, session.isAuthenticated, router]);

  if (!isReady || !session.isAuthenticated) {
    return null;
  }

  const displayName = session.identifier || 'Tailor Account';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-lg tracking-wider text-slate-900">THY</span>
          <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full font-medium">
            {displayName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          Log out
        </button>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}