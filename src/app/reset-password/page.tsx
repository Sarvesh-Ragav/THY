'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThyLogo } from '@/components/auth/ThyLogo';
import { PasswordField, validatePasswordPair } from '@/components/auth/PasswordField';
import { AuthApiError, resetPassword } from '@/lib/auth-api';
import { AuthMain, ScreenStatus } from '@/components/ui/AppScreen';

const RESET_SESSION_KEY = 'thy-password-reset';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ScreenStatus />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function readStoredReset(): { email: string; token: string } {
  if (typeof window === 'undefined') return { email: '', token: '' };
  try {
    const raw = window.sessionStorage.getItem(RESET_SESSION_KEY);
    if (!raw) return { email: '', token: '' };
    const parsed = JSON.parse(raw) as { email?: unknown; token?: unknown };
    return {
      email: typeof parsed.email === 'string' ? parsed.email : '',
      token: typeof parsed.token === 'string' ? parsed.token : '',
    };
  } catch {
    return { email: '', token: '' };
  }
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = readStoredReset();
    const fromQuery = searchParams.get('email') || '';
    setEmail((current) => current || fromQuery || stored.email);
    setToken((current) => current || stored.token);
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedToken = token.trim() || readStoredReset().token;
    if (!trimmedEmail) {
      setErrorMessage('Please enter the email for this account.');
      return;
    }
    if (!trimmedToken) {
      setErrorMessage('Start from Forgot password to continue.');
      return;
    }
    const passwordError = validatePasswordPair(password, confirmPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await resetPassword({
        email: trimmedEmail,
        token: trimmedToken,
        password,
        confirmPassword,
      });
      window.sessionStorage.removeItem(RESET_SESSION_KEY);
      router.push('/login');
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError ? error.message : 'Unable to reset your password. Please try again.'
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
          <p className="text-thy-canvas text-sm font-medium opacity-90 mt-1">Choose a new password</p>
        </div>

        <div className="p-6 sm:p-8 bg-thy-surface">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-thy-ink tracking-tight">Reset password</h2>
            <p className="text-sm text-thy-muted mt-1">Enter a new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-thy-ink mb-1">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                readOnly
                autoComplete="email"
                className="thy-input bg-thy-mist/40"
              />
            </div>
            <PasswordField
              id="new-password"
              label="New password"
              value={password}
              onChange={setPassword}
              placeholder="Create a new password"
              autoComplete="new-password"
            />
            <PasswordField
              id="confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
            {errorMessage ? <p className="text-xs text-red-500 font-medium">{errorMessage}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-thy-brand hover:bg-thy-brand-hover text-white font-bold py-3 px-4 rounded-xl disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>

          <p className="text-sm text-thy-muted font-medium text-center mt-6">
            <Link href="/login" className="text-thy-brand font-semibold hover:underline">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </AuthMain>
  );
}
