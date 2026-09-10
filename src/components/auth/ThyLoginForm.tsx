'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThyLogo } from './ThyLogo';
import { GoogleIcon } from './GoogleIcon';
import { ThyLoginCardProps, LoginFormData, LoginApiResponse } from '@/types/auth';

export const ThyLoginForm: React.FC<ThyLoginCardProps> = ({
  initialIdentifier = '',
  onSubmit,
  onGoogleSignIn,
  onNavigateSignUp,
  isLoading = false,
}) => {
  const [identifier, setIdentifier] = useState<string>(initialIdentifier);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  /**
   * Client-side validation logic
   * Validates if the input is a valid 10-digit mobile number or standard email address
   */
  const validateInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your mobile number or email address');
      return false;
    }

    // Strip non-digit characters for phone check
    const digitsOnly = trimmed.replace(/\D/g, '');

    // Standard Email Regex Pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidMobile = digitsOnly.length === 10;
    const isValidEmail = emailRegex.test(trimmed);

    if (isValidMobile || isValidEmail) {
      setErrorMessage(null);
      return true;
    }

    setErrorMessage('Please enter a valid 10-digit mobile number or email address.');
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateInput(identifier)) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        const response = await onSubmit({ identifier: identifier.trim() });
        if (response && !response.success && response.error) {
          setErrorMessage(response.error);
        } else if (response && response.success) {
          setSuccessMessage(response.message || 'Login successful! Redirecting...');
        }
      } else {
        // Default Mock API integration handling (retains zero business logic in UI)
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSuccessMessage('Login initiated successfully! Connecting to THY server...');
      }
    } catch (err) {
      setErrorMessage('An unexpected connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
      {/* 1. Header Section */}
      <div className="bg-[#00c9b7] px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
        <ThyLogo size={52} className="mb-2" />
        <h1 className="text-3xl font-extrabold text-white tracking-wider font-sans">THY</h1>
        <p className="text-teal-50 text-sm font-medium opacity-90 mt-1">Tailoring, connected.</p>
      </div>

      {/* 2. Body Section */}
      <div className="p-6 sm:p-8 bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Log in to continue to THY</p>
        </div>

        {/* Success Alert Banner (Conditional) */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl flex items-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
            >
              Mobile number or email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={handleInputChange}
              placeholder="Mobile number or email"
              autoComplete="username"
              inputMode="text"
              disabled={isSubmitting || isLoading}
              className={`w-full px-4 py-3 text-sm text-gray-900 bg-white border rounded-xl placeholder:text-gray-400 transition-all duration-200 focus:outline-none ${
                errorMessage
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#00c9b7] focus:ring-1 focus:ring-[#00c9b7]'
              }`}
            />

            {/* Inline Error Message */}
            {errorMessage ? (
              <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1.5 animate-shake">
                <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1.5 leading-normal">
                Use the mobile number or email linked to your THY account
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-[#00c9b7] hover:bg-[#00b5a4] active:bg-[#009e8f] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting || isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>

        {/* 3. Divider Line */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-white px-3 text-xs uppercase font-medium text-gray-400 tracking-wider">
            OR
          </div>
        </div>

        {/* Secondary Social Login Button */}
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="w-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer active:scale-[0.99] shadow-2xs"
        >
          <GoogleIcon size={18} />
          <span className="text-sm text-gray-800 font-semibold">Continue with Google</span>
        </button>

        {/* Navigation Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-medium">
            New to THY?{' '}
            {onNavigateSignUp ? (
              <button
                type="button"
                onClick={onNavigateSignUp}
                className="text-[#00c9b7] font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            ) : (
              <Link href="/signup" className="text-[#00c9b7] font-semibold hover:underline">
                Sign Up
              </Link>
            )}
          </p>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-[11px] text-gray-400 text-center leading-relaxed mt-6 px-2">
          By continuing, you agree to THY&apos;s{' '}
          <Link href="/terms" className="hover:underline text-gray-500">
            Terms
          </Link>{' '}
          &amp;{' '}
          <Link href="/privacy" className="hover:underline text-gray-500">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
