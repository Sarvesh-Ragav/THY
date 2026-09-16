'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { CustomerErrorProvider } from '@/components/customer/CustomerErrorProvider';

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <CustomerErrorProvider>
      <div
        className="thy-app-glow min-h-dvh bg-transparent text-thy-ink pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0"
        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
      >
        {children}
        <CustomerBottomNav />
      </div>
    </CustomerErrorProvider>
  );
}
