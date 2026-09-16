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
  applyAccountToSession,
  createDefaultSession,
  loadTailorSession,
  persistTailorSession,
} from '@/lib/tailor-session';
import {
  logoutAuthentication,
  refreshAuthentication,
  type AuthenticationResult,
} from '@/lib/auth-api';

interface TailorSessionContextValue {
  session: TailorSession;
  isReady: boolean;
  accessToken: string | null;
  updateSession: (
    partial: Partial<TailorSession> | ((current: TailorSession) => Partial<TailorSession>)
  ) => TailorSession;
  completeAuthentication: (
    result: AuthenticationResult,
    sessionPatch?: Partial<TailorSession>
  ) => TailorSession;
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
      .then((result) => {
        setAccessToken(result.accessToken);
        setSession((current) => {
          const next = applyAccountToSession(
            { ...localSession, ...current },
            result.user,
            result.customerProfile,
            result.tailorProfile
          );
          persistTailorSession(next);
          return next;
        });
      })
      .catch(() => undefined)
      .finally(() => setIsReady(true));
  }, []);

  const updateSession = useCallback(
    (partial: Partial<TailorSession> | ((current: TailorSession) => Partial<TailorSession>)) => {
      let next: TailorSession = createDefaultSession();
      setSession((current) => {
        const patch = typeof partial === 'function' ? partial(current) : partial;
        next = { ...current, ...patch };
        persistTailorSession(next);
        return next;
      });
      return next;
    },
    []
  );

  const completeAuthentication = useCallback(
    (result: AuthenticationResult, sessionPatch?: Partial<TailorSession>) => {
      const next = applyAccountToSession(
        session,
        result.user,
        result.customerProfile,
        result.tailorProfile,
        sessionPatch
      );
      setAccessToken(result.accessToken);
      setSession(next);
      persistTailorSession(next);
      return next;
    },
    [session]
  );

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
