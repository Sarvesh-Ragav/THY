'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';

export default function SignUpPage() {
  const router = useRouter();
  const { session, isReady } = useTailorSession();

  useEffect(() => {
    if (!isReady) return;
    if (session.isAuthenticated) {
      router.replace(getPostAuthPath(session));
    }
  }, [isReady, session, router]);

  return (
    <main className="min-h-dvh bg-transparent flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <ThySignUpForm />
    </main>
  );
}
