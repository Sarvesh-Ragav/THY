'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThyLoginForm } from '@/components/auth/ThyLoginForm';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { ThyOtpVerificationForm } from '@/components/auth/ThyOtpVerificationForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { LoginFormData } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const { session, isReady, updateSession, completeAuthentication } = useTailorSession();
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [userIdentifier, setUserIdentifier] = useState<string>('');

  useEffect(() => {
    if (!isReady) return;
    if (session.isAuthenticated) {
      router.replace(getPostAuthPath(session));
    }
  }, [isReady, session, router]);

  const handleLoginContinue = async (formData: LoginFormData) => {
    setUserIdentifier(formData.identifier);
    updateSession({ identifier: formData.identifier });
    setView('otp');
  };

  const handleAuthenticated = () => {
    const next = completeAuthentication();
    router.push(getPostAuthPath(next));
  };

  if (!isReady || session.isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {view === 'login' && (
        <ThyLoginForm
          initialIdentifier={session.identifier}
          onSubmit={handleLoginContinue}
          onGoogleSignIn={handleAuthenticated}
          onNavigateSignUp={() => setView('signup')}
        />
      )}

      {view === 'otp' && (
        <ThyOtpVerificationForm
          identifier={userIdentifier || session.identifier}
          onVerifyOtp={async () => {
            handleAuthenticated();
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
