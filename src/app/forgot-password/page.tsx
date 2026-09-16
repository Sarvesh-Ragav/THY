'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThyLogo } from '@/components/auth/ThyLogo';
import { AuthApiError, requestPasswordReset } from '@/lib/auth-api';
import { AuthMain } from '@/components/ui/AppScreen';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_SESSION_KEY = 'thy-password-reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await requestPasswordReset(trimmed);
      window.sessionStorage.setItem(
        RESET_SESSION_KEY,
        JSON.stringify({ email: trimmed, token: result.resetToken ?? '' })
      );
      router.push(`/reset-password?email=${encodeURIComponent(trimmed)}`);
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError ? error.message : 'Unable to continue. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthMain>
      <div className="w-full max-w-sm mx-auto bg-thy-surface overflow-hidden border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.12)]">
        <div className="thy-auth-header px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
          <ThyLogo size={52} className="mb-2 text-white" />
          <h1 className="text-3xl tracking-[0.2em] text-white" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            THY
          </h1>
          <p className="text-thy-canvas text-sm font-medium opacity-90 mt-1">Reset your password</p>
        </div>

        <div className="p-6 sm:p-8 bg-thy-surface">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-thy-ink tracking-tight">Forgot password</h2>
            <p className="text-sm text-thy-muted mt-1">Enter the email used for your THY account.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-thy-ink mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm text-thy-ink bg-thy-surface border border-thy-ink/15 rounded-xl placeholder:text-thy-subtle focus:outline-none focus:border-thy-brand focus:ring-1 focus:ring-thy-brand"
              />
            </div>
            {errorMessage ? <p className="text-xs text-red-500 font-medium">{errorMessage}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-thy-brand hover:bg-thy-brand-hover text-white font-bold py-3 px-4 rounded-xl disabled:opacity-60"
            >
              {isSubmitting ? 'Continuing...' : 'Next'}
            </button>
          </form>
          <p className="text-sm text-thy-muted font-medium text-center mt-6">
            Remembered it?{' '}
            <Link href="/login" className="text-thy-brand font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthMain>
  );
}
