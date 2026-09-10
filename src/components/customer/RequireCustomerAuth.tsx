'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath, isCustomerOnboardingComplete } from '@/lib/tailor-session';

export function RequireCustomerAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isReady } = useTailorSession();
  const allowed = isReady && session.isAuthenticated && isCustomerOnboardingComplete(session);

  useEffect(() => {
    if (!isReady) return;
    if (session.role === 'tailor') {
      router.replace(getPostAuthPath(session));
      return;
    }
    if (!session.isAuthenticated || !isCustomerOnboardingComplete(session)) {
      router.replace('/login');
    }
  }, [isReady, session, router]);

  if (!allowed) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <p className="text-sm text-[#8A7D70]">Loading...</p>
      </main>
    );
  }

  return <>{children}</>;
}
