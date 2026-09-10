'use client';

import React, { useState } from 'react';
import { ThyLogo } from './ThyLogo';

export interface ThyOtpVerificationFormProps {
  identifier?: string;
  onVerifyOtp?: (otp: string) => Promise<boolean | void>;
  onResendOtp?: () => void;
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

  const handleResend = () => {
    if (onResendOtp) {
      onResendOtp();
    }
    setResendStatus('Verification code resent successfully!');
    setTimeout(() => setResendStatus(null), 3500);
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
        await onVerifyOtp(otp);
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
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
      {/* 1. Header Section */}
      <div className="bg-[#00c9b7] px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
        <ThyLogo size={56} className="mb-0" />
      </div>

      {/* 2. Body Section */}
      <div className="p-6 sm:p-8 bg-white">
        {/* Back Arrow Button */}
        <button
          type="button"
          onClick={onNavigateBack}
          className="text-gray-800 hover:text-black p-1 -ml-1 mb-2 transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Verify your details
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Enter the verification code sent to {identifier ? <span className="font-semibold text-gray-700">{identifier}</span> : 'your registered contact'}
          </p>
        </div>

        {resendStatus && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium animate-fadeIn">
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
                className={`w-full px-4 py-3.5 text-center text-lg font-mono font-bold tracking-[0.5em] text-gray-900 bg-white border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errorMessage
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#00c9b7] focus:border-[#00c9b7]'
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
            className="w-full bg-[#00c9b7] hover:bg-[#00b5a4] active:bg-[#009e8f] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition duration-200 flex items-center justify-center cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting || isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* Resend Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleResend}
            className="text-[#00c9b7] font-semibold text-sm hover:underline cursor-pointer"
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};
