'use client';

import React, { useState } from 'react';
import { ThyLogo } from './ThyLogo';

export interface ThyOtpVerificationFormProps {
  identifier?: string;
  onVerifyOtp?: (otp: string) => Promise<boolean | void>;
  onResendOtp?: () => Promise<boolean | void>;
  onNavigateBack?: () => void;
  isLoading?: boolean;
}

export const ThyOtpVerificationForm: React.FC<ThyOtpVerificationFormProps> = ({
  identifier = '',
  onVerifyOtp,
  onResendOtp,
  onNavigateBack,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleResend = async () => {
    try {
      if (onResendOtp) {
        const result = await onResendOtp();
        if (result === false) return;
      }
      setErrorMessage(null);
      setResendStatus('Verification code resent successfully!');
      setTimeout(() => setResendStatus(null), 3500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resend the verification code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onVerifyOtp) {
        const result = await onVerifyOtp(otp);
        if (result === false) return;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        alert('OTP Verified Successfully! Welcome to THY.');
      }
    } catch (err) {
      setErrorMessage('Invalid verification code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-thy-surface overflow-hidden border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.12)]">
      {/* 1. Header Section */}
      <div className="thy-auth-header px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
        <ThyLogo size={56} className="mb-0 text-white" />
      </div>

      {/* 2. Body Section */}
      <div className="p-6 sm:p-8 bg-thy-surface">
        {/* Back Arrow Button */}
        <button
          type="button"
          onClick={onNavigateBack}
          className="text-thy-ink hover:text-thy-deep p-1 -ml-1 mb-2 transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-thy-ink tracking-tight">
            Verify your details
          </h2>
          <p className="text-xs text-thy-muted mt-1 leading-relaxed">
            Enter the verification code sent to {identifier ? <span className="font-semibold text-thy-ink">{identifier}</span> : 'your registered contact'}
          </p>
        </div>

        {resendStatus && (
          <div className="mb-4 p-3 bg-thy-mist border border-thy-brand/25 text-thy-deep text-xs rounded-xl font-medium animate-fadeIn">
            {resendStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="—— —— —— —— —— ——"
                className={`w-full px-4 py-3.5 text-center text-lg font-mono font-bold tracking-[0.5em] text-thy-ink bg-thy-surface border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errorMessage
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-thy-brand focus:border-thy-brand'
                }`}
                autoFocus
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-500 font-medium mt-2 text-center">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-thy-brand hover:bg-thy-brand-hover active:bg-thy-brand-active text-white font-bold py-3 px-4 rounded-xl shadow-sm transition duration-200 flex items-center justify-center cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting || isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* Resend Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleResend}
            className="text-thy-brand font-semibold text-sm hover:underline cursor-pointer"
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};
