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
import { logoutAuthentication, refreshAuthentication } from '@/lib/auth-api';

interface TailorSessionContextValue {
  session: TailorSession;
  isReady: boolean;
  accessToken: string | null;
  updateSession: (partial: Partial<TailorSession>) => TailorSession;
  completeAuthentication: (accessToken: string, role?: 'customer' | 'tailor' | null) => TailorSession;
  logout: () => void;
}

const TailorSessionContext = createContext<TailorSessionContextValue | null>(null);

export function TailorSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TailorSession>(createDefaultSession);
  const [isReady, setIsReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const localSession = loadTailorSession();
    // Browser storage is retained for onboarding only; it is never proof of authentication.
    setSession({ ...localSession, isAuthenticated: false });
    refreshAuthentication()
      .then(({ accessToken, user }) => {
        setAccessToken(accessToken);
        setSession((current) => {
          const next = {
            ...current,
            isAuthenticated: true,
            role: user.role ?? current.role ?? 'tailor',
            identifier: user.phoneNumber,
          };
          persistTailorSession(next);
          return next;
        });
      })
      .catch(() => undefined)
      .finally(() => setIsReady(true));
  }, []);

  const updateSession = useCallback((partial: Partial<TailorSession>) => {
    const next = { ...session, ...partial };
    setSession(next);
    persistTailorSession(next);
    return next;
  }, [session]);

  const completeAuthentication = useCallback((accessToken: string, authenticatedRole?: 'customer' | 'tailor' | null) => {
    const next: TailorSession = {
      ...session,
      isAuthenticated: true,
      role: authenticatedRole ?? session.role ?? 'tailor',
    };
    setAccessToken(accessToken);
    setSession(next);
    persistTailorSession(next);
    return next;
  }, [session]);

  const logout = useCallback(() => {
    const next = { ...session, isAuthenticated: false };
    setAccessToken(null);
    setSession(next);
    persistTailorSession(next);
    void logoutAuthentication();
  }, [session]);

  const value = useMemo(
    () => ({ session, isReady, accessToken, updateSession, completeAuthentication, logout }),
    [session, isReady, accessToken, updateSession, completeAuthentication, logout]
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
