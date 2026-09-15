'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThyLoginForm } from '@/components/auth/ThyLoginForm';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { LoginFormData } from '@/types/auth';
import { AuthApiError, googleAuth, loginWithPassword, type AuthenticationResult } from '@/lib/auth-api';
import { AppearanceControls } from '@/components/customer/AppearanceControls';

export default function LoginPage() {
  const router = useRouter();
  const { session, isReady, completeAuthentication } = useTailorSession();
  const [view, setView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (!isReady) return;
    if (session.isAuthenticated) {
      router.replace(getPostAuthPath(session));
    }
  }, [isReady, session, router]);

  const handleAuthenticated = (result: AuthenticationResult) => {
    const next = completeAuthentication(result);
    router.push(getPostAuthPath(next));
  };

  const handleLoginContinue = async (formData: LoginFormData) => {
    try {
      const result = await loginWithPassword(formData.email, formData.password);
      handleAuthenticated(result);
      return { success: true, message: 'Logged in. Redirecting...' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof AuthApiError ? error.message : 'Unable to log in. Please try again.',
      };
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    try {
      const result = await googleAuth(credential);
      handleAuthenticated(result);
    } catch (error) {
      console.error('Google Sign-In failed', error);
      alert('Google Sign-In failed. Please try again.');
    }
  };

  if (!isReady || session.isAuthenticated) {
    return (
      <main className="min-h-dvh bg-transparent flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="text-sm text-thy-muted">Loading...</p>
      </main>
    );
  }

  const initialEmail = session.identifier.includes('@') ? session.identifier : '';

  return (
    <main className="min-h-dvh bg-transparent flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="fixed top-3 right-3 z-50 thy-silk-bar px-2 rounded-lg">
        <AppearanceControls />
      </div>
      {view === 'login' && (
        <ThyLoginForm
          initialEmail={initialEmail}
          onSubmit={handleLoginContinue}
          onGoogleSignIn={handleGoogleSignIn}
          onNavigateSignUp={() => setView('signup')}
        />
      )}

      {view === 'signup' && (
        <ThySignUpForm
          onNavigateLogin={() => setView('login')}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </main>
  );
}
