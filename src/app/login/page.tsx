'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThyLoginForm } from '@/components/auth/ThyLoginForm';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { ThyOtpVerificationForm } from '@/components/auth/ThyOtpVerificationForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { LoginFormData } from '@/types/auth';
import { requestOtp, resendOtp, verifyOtp } from '@/lib/auth-api';

export default function LoginPage() {
  const router = useRouter();
  const { session, isReady, updateSession, completeAuthentication } = useTailorSession();
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [userIdentifier, setUserIdentifier] = useState<string>('');
  const [challengeId, setChallengeId] = useState<string>('');

  useEffect(() => {
    if (!isReady) return;
    if (session.isAuthenticated) {
      router.replace(getPostAuthPath(session));
    }
  }, [isReady, session, router]);

  const handleLoginContinue = async (formData: LoginFormData) => {
    const result = await requestOtp(formData.identifier);
    setUserIdentifier(formData.identifier);
    setChallengeId(result.challengeId);
    updateSession({ identifier: formData.identifier });
    setView('otp');
    return { success: true, message: 'Verification code sent.', data: result };
  };

  const handleAuthenticated = (accessToken: string) => {
    const next = completeAuthentication(accessToken);
    router.push(getPostAuthPath(next));
  };

  if (!isReady || session.isAuthenticated) {
    return (
      <main className="min-h-dvh bg-thy-bg flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="text-sm text-thy-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-thy-bg flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      {view === 'login' && (
        <ThyLoginForm
          initialIdentifier={session.identifier}
          onSubmit={handleLoginContinue}
          onNavigateSignUp={() => setView('signup')}
        />
      )}

      {view === 'otp' && (
        <ThyOtpVerificationForm
          identifier={userIdentifier || session.identifier}
          onVerifyOtp={async (otp) => {
            const result = await verifyOtp(userIdentifier || session.identifier, challengeId, otp);
            handleAuthenticated(result.accessToken);
            return true;
          }}
          onResendOtp={async () => {
            const result = await resendOtp(userIdentifier || session.identifier);
            setChallengeId(result.challengeId);
            return true;
          }}
          onNavigateBack={() => setView('login')}
        />
      )}

      {view === 'signup' && (
        <ThySignUpForm
          onNavigateLogin={() => setView('login')}
        />
      )}
    </main>
  );
}
