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
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
      {/* 1. Header Section */}
      <div className="bg-[#00c9b7] px-6 py-10 text-center flex flex-col items-center justify-center relative select-none">
        <ThyLogo size={56} className="mb-0" />
      </div>

      {/* 2. Body Section */}
      <div className="p-6 sm:p-8 bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create your THY account
          </h2>
          <p className="text-sm text-gray-500 mt-1">Choose how you want to get started.</p>
        </div>

        {/* Role Options */}
        <div className="space-y-4 mb-8">
          {/* Customer Option */}
          <button
            type="button"
            onClick={() => handleRoleClick('customer')}
            className={`w-full p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col ${
              selectedRole === 'customer'
                ? 'border-2 border-[#00c9b7] bg-teal-50/20 shadow-xs'
                : 'border border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <span className="font-bold text-gray-900 text-base">Customer</span>
            <span className="text-xs text-gray-500 mt-0.5">Find tailors and manage orders</span>
          </button>

          {/* Tailor Option */}
          <button
            type="button"
            onClick={() => handleRoleClick('tailor')}
            className={`w-full p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col ${
              selectedRole === 'tailor'
                ? 'border-2 border-[#00c9b7] bg-teal-50/20 shadow-xs'
                : 'border border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <span className="font-bold text-gray-900 text-base">Tailor</span>
            <span className="text-xs text-gray-500 mt-0.5">
              Create your profile and receive orders
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-[#00c9b7] hover:bg-[#00b5a4] active:bg-[#009e8f] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition duration-200 cursor-pointer active:scale-[0.99] mb-6"
        >
          Continue
        </button>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            {onNavigateLogin ? (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-[#00c9b7] font-semibold hover:underline cursor-pointer"
              >
                Log in
              </button>
            ) : (
              <Link href="/" className="text-[#00c9b7] font-semibold hover:underline">
                Log in
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
