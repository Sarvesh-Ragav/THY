'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ErrorKind = 'network' | 'general' | null;

interface ErrorContextValue {
  error: ErrorKind;
  setError: (error: ErrorKind) => void;
  retry: () => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function CustomerErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorKind>(null);

  useEffect(() => {
    const goOffline = () => setError('network');
    const goOnline = () => setError((current) => (current === 'network' ? null : current));
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setError('network');
    }
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const retry = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setError('network');
      return;
    }
    setError(null);
    window.location.reload();
  }, []);

  const value = useMemo(() => ({ error, setError, retry }), [error, retry]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
      {error && (
        <div className="fixed inset-0 z-[80] bg-thy-deep/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-thy-surface p-6 text-thy-ink border border-thy-ink/10 rounded-t-2xl sm:rounded-none pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-thy-subtle">
              {error === 'network' ? 'Network failure' : 'General failure'}
            </p>
            <h2 className="mt-2 text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {error === 'network' ? 'No Internet Connection' : 'Something went wrong. Please try again.'}
            </h2>
            <button
              type="button"
              onClick={retry}
              className="mt-6 hero-leather-btn px-5 py-2.5 text-[11px] uppercase tracking-[0.18em]"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useCustomerError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useCustomerError must be used within CustomerErrorProvider');
  }
  return context;
}
