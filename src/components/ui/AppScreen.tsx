'use client';

import React from 'react';

export const AUTH_MAIN_CLASS =
  'min-h-dvh bg-transparent flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]';

export function AuthMain({
  children,
  className = AUTH_MAIN_CLASS,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={className} suppressHydrationWarning>
      {children}
    </main>
  );
}

export function InlineStatus({
  label = 'Loading...',
  className = 'p-8 text-sm text-thy-subtle',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={className} suppressHydrationWarning>
      {label}
    </div>
  );
}

export function ScreenStatus({
  label = 'Loading...',
  className = AUTH_MAIN_CLASS,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <AuthMain className={className}>
      <div className="text-sm text-thy-muted" suppressHydrationWarning>
        {label}
      </div>
    </AuthMain>
  );
}
