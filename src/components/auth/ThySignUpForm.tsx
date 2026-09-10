'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThyLogo } from './ThyLogo';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export interface ThySignUpFormProps {
  onSelectRole?: (role: 'customer' | 'tailor') => void;
  onNavigateLogin?: () => void;
}

export const ThySignUpForm: React.FC<ThySignUpFormProps> = ({
  onSelectRole,
  onNavigateLogin,
}) => {
  const router = useRouter();
  const { updateSession } = useTailorSession();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'tailor' | null>('customer');

  const handleRoleClick = (role: 'customer' | 'tailor') => {
    setSelectedRole(role);
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  const handleContinue = () => {
    if (selectedRole === 'tailor') {
      updateSession({ role: 'tailor' });
      router.push('/tailor-registration');
      return;
    }

    updateSession({ role: 'customer' });
    router.push('/customer-registration');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-thy-surface overflow-hidden border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.12)]">
      {/* 1. Header Section */}
      <div className="thy-auth-header px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
        <ThyLogo size={56} className="mb-0" />
      </div>

      {/* 2. Body Section */}
      <div className="p-6 sm:p-8 bg-thy-surface">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-thy-ink tracking-tight">
            Create your THY account
          </h2>
          <p className="text-sm text-thy-muted mt-1">Choose how you want to get started.</p>
        </div>

        {/* Role Options */}
        <div className="space-y-4 mb-8">
          {/* Customer Option */}
          <button
            type="button"
            onClick={() => handleRoleClick('customer')}
            className={`w-full p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col ${
              selectedRole === 'customer'
                ? 'border-2 border-thy-brand bg-thy-mist/70 shadow-xs'
                : 'border border-thy-ink/10 hover:border-thy-ink/20 bg-thy-surface'
            }`}
          >
            <span className="font-bold text-thy-ink text-base">Customer</span>
            <span className="text-xs text-thy-muted mt-0.5">Find tailors and manage orders</span>
          </button>

          {/* Tailor Option */}
          <button
            type="button"
            onClick={() => handleRoleClick('tailor')}
            className={`w-full p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col ${
              selectedRole === 'tailor'
                ? 'border-2 border-thy-brand bg-thy-mist/70 shadow-xs'
                : 'border border-thy-ink/10 hover:border-thy-ink/20 bg-thy-surface'
            }`}
          >
            <span className="font-bold text-thy-ink text-base">Tailor</span>
            <span className="text-xs text-thy-muted mt-0.5">
              Create your profile and receive orders
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-thy-brand hover:bg-thy-brand-hover active:bg-thy-brand-active text-white font-bold py-3 px-4 rounded-xl shadow-sm transition duration-200 cursor-pointer active:scale-[0.99] mb-6"
        >
          Continue
        </button>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-thy-muted font-medium">
            Already have an account?{' '}
            {onNavigateLogin ? (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-thy-brand font-semibold hover:underline cursor-pointer"
              >
                Log in
              </button>
            ) : (
              <Link href="/login" className="text-thy-brand font-semibold hover:underline">
                Log in
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
