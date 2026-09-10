'use client';

import React, { useState } from 'react';
import { ThyLoginForm } from '@/components/auth/ThyLoginForm';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';
import { ThyOtpVerificationForm } from '@/components/auth/ThyOtpVerificationForm';

export default function HomePage() {
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [userIdentifier, setUserIdentifier] = useState<string>('');

  const handleLoginContinue = async (formData: { identifier: string }) => {
    setUserIdentifier(formData.identifier);
    // Transition to OTP Verification page
    setView('otp');
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {view === 'login' && (
        <ThyLoginForm
          onSubmit={handleLoginContinue}
          onNavigateSignUp={() => setView('signup')}
        />
      )}

      {view === 'otp' && (
        <ThyOtpVerificationForm
          identifier={userIdentifier}
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
