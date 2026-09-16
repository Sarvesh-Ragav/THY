'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';

export function RequireCustomerAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isReady } = useTailorSession();
  const allowed = isReady && session.isAuthenticated;

  useEffect(() => {
    if (!isReady) return;

    if (session.role === 'tailor') {
      router.replace(getPostAuthPath(session));
      return;
    }

    if (!session.isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, session, router]);

  if (!allowed) {
    return (
      <div className="p-8 text-sm text-thy-subtle" suppressHydrationWarning>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}