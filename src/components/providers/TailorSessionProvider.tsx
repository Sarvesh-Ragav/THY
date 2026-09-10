'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  TailorSession,
  createDefaultSession,
  loadTailorSession,
  persistTailorSession,
} from '@/lib/tailor-session';

interface TailorSessionContextValue {
  session: TailorSession;
  isReady: boolean;
  updateSession: (partial: Partial<TailorSession>) => TailorSession;
  completeAuthentication: () => TailorSession;
  logout: () => void;
}

const TailorSessionContext = createContext<TailorSessionContextValue | null>(null);

export function TailorSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TailorSession>(createDefaultSession);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(loadTailorSession());
    setIsReady(true);
  }, []);

  const updateSession = useCallback((partial: Partial<TailorSession>) => {
    const next = { ...session, ...partial };
    setSession(next);
    persistTailorSession(next);
    return next;
  }, [session]);

  const completeAuthentication = useCallback(() => {
    const next: TailorSession = {
      ...session,
      isAuthenticated: true,
      role: session.role ?? 'tailor',
    };
    setSession(next);
    persistTailorSession(next);
    return next;
  }, [session]);

  const logout = useCallback(() => {
    const next = { ...session, isAuthenticated: false };
    setSession(next);
    persistTailorSession(next);
  }, [session]);

  const value = useMemo(
    () => ({ session, isReady, updateSession, completeAuthentication, logout }),
    [session, isReady, updateSession, completeAuthentication, logout]
  );

  return (
    <TailorSessionContext.Provider value={value}>
      {children}
    </TailorSessionContext.Provider>
  );
}

export function useTailorSession(): TailorSessionContextValue {
  const context = useContext(TailorSessionContext);
  if (!context) {
    throw new Error('useTailorSession must be used within TailorSessionProvider');
  }
  return context;
}
