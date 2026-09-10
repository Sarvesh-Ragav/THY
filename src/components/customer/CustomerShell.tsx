'use client';

import React from 'react';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { CustomerErrorProvider } from '@/components/customer/CustomerErrorProvider';

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <CustomerErrorProvider>
      <div className="min-h-screen bg-thy-bg text-thy-ink" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
        <CustomerNavbar />
        {children}
      </div>
    </CustomerErrorProvider>
  );
}
