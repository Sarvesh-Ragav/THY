'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { AuthMain } from '@/components/ui/AppScreen';

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
    <AuthMain>
      <ThySignUpForm />
    </AuthMain>
  );
}
