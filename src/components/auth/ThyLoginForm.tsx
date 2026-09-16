'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { ThyLogo } from './ThyLogo';
import { GoogleAuthButton } from './GoogleAuthButton';
import { ThyLoginCardProps, LoginApiResponse } from '@/types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ThyLoginForm: React.FC<ThyLoginCardProps> = ({
  initialEmail = '',
  onSubmit,
  onGoogleSignIn,
  onNavigateSignUp,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!initialEmail) return;
    setEmail((current) => current || initialEmail);
  }, [initialEmail]);

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 py-3 text-sm text-thy-ink bg-thy-surface border rounded-xl placeholder:text-thy-subtle transition-all duration-200 focus:outline-none disabled:opacity-60 ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
        : 'border-thy-ink/15 focus:border-thy-brand focus:ring-1 focus:ring-thy-brand'
    }`;

  const validateInput = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateInput()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        const response: LoginApiResponse | void = await onSubmit({
          email: email.trim().toLowerCase(),
          password,
        });
        if (response && !response.success && response.error) {
          setErrorMessage(response.error);
        } else if (response && response.success) {
          setSuccessMessage(response.message || 'Login successful! Redirecting...');
        }
      }
    } catch {
      setErrorMessage('An unexpected connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-thy-surface overflow-hidden border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.12)]">
      <div className="thy-auth-header px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
        <ThyLogo size={52} className="mb-2 text-white" />
        <h1 className="text-3xl tracking-[0.2em] text-white" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          THY
        </h1>
        <p className="text-thy-canvas text-sm font-medium opacity-90 mt-1">Tailoring, connected.</p>
      </div>

      <div className="p-6 sm:p-8 bg-thy-surface">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-thy-ink tracking-tight">Welcome back</h2>
          <p className="text-sm text-thy-muted mt-1">Log in with your email and password</p>
        </div>

        {successMessage && (
          <div className="mb-5 p-3.5 bg-thy-mist border border-thy-brand/25 text-thy-deep text-xs font-medium rounded-xl flex items-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-thy-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-thy-ink mb-1.5 uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errorMessage) setErrorMessage(null);
                if (successMessage) setSuccessMessage(null);
              }}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isSubmitting || isLoading}
              className={fieldClass(Boolean(errorMessage && !email.trim()))}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-thy-ink mb-1.5 uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                  if (successMessage) setSuccessMessage(null);
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting || isLoading}
                className={`${fieldClass(Boolean(errorMessage && email.trim() && !password))} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-thy-subtle hover:text-thy-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <Link href="/forgot-password" className="text-xs font-semibold text-thy-brand hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {errorMessage ? (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 animate-shake">
              <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-thy-brand hover:bg-thy-brand-hover active:bg-thy-brand-active text-white font-bold py-3 px-4 rounded-xl shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting || isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-thy-ink/10"></div>
          </div>
          <div className="relative bg-thy-surface px-3 text-xs uppercase font-medium text-thy-subtle tracking-wider">
            OR
          </div>
        </div>

        {onGoogleSignIn ? (
          <GoogleAuthButton onCredential={onGoogleSignIn} text="continue_with" />
        ) : (
          <button
            type="button"
            onClick={() => setErrorMessage('Google sign-in is not available yet. Please log in with email and password.')}
            className="w-full border border-thy-ink/15 hover:border-thy-ink/25 bg-thy-surface hover:bg-thy-mist text-thy-ink font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer active:scale-[0.99]"
          >
            <span className="text-sm text-thy-ink font-semibold">Continue with Google</span>
          </button>
        )}

        <div className="text-center mt-6">
          <div className="text-sm text-thy-muted font-medium">
            New to THY?{' '}
            {onNavigateSignUp ? (
              <button
                type="button"
                onClick={onNavigateSignUp}
                className="text-thy-brand font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            ) : (
              <Link href="/signup" className="text-thy-brand font-semibold hover:underline">
                Sign Up
              </Link>
            )}
          </div>
        </div>

        <p className="text-[11px] text-thy-subtle text-center leading-relaxed mt-6 px-2">
          By continuing, you agree to THY&apos;s{' '}
          <Link href="/terms" className="hover:underline text-thy-muted">
            Terms
          </Link>{' '}
          &amp;{' '}
          <Link href="/privacy" className="hover:underline text-thy-muted">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
