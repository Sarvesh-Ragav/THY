'use client';

import React from 'react';
import { ThyOtpVerificationForm } from '@/components/auth/ThyOtpVerificationForm';

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ThyOtpVerificationForm />
    </main>
  );
}
