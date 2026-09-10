'use client';

import React from 'react';
import { ThySignUpForm } from '@/components/auth/ThySignUpForm';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ThySignUpForm />
    </main>
  );
}
