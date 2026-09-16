'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThyLoginForm } from '@/components/auth/ThyLoginForm';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath } from '@/lib/tailor-session';
import { LoginFormData } from '@/types/auth';
import { AuthApiError, googleAuth, loginWithPassword, type AuthenticationResult } from '@/lib/auth-api';
import { AuthMain } from '@/components/ui/AppScreen';

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

  const initialEmail = isReady && session.identifier.includes('@') ? session.identifier : '';

  return (
    <AuthMain>
      {view === 'login' ? (
        <ThyLoginForm
          initialEmail={initialEmail}
          onSubmit={handleLoginContinue}
          onGoogleSignIn={handleGoogleSignIn}
          onNavigateSignUp={() => setView('signup')}
        />
      ) : (
        <ThySignUpForm
          onNavigateLogin={() => setView('login')}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </AuthMain>
  );
}
