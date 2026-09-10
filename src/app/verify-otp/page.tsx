'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ThyOtpVerificationForm } from '@/components/auth/ThyOtpVerificationForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { session, completeAuthentication } = useTailorSession();

  return (
    <main className="min-h-dvh bg-thy-bg flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <ThyOtpVerificationForm
        identifier={session.identifier}
        onVerifyOtp={async () => {
          const next = completeAuthentication();
          router.push(getPostAuthPath(next));
        }}
        onNavigateBack={() => router.push('/')}
      />
    </main>
  );
}
