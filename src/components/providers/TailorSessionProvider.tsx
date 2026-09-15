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
    // Only hydrate from storage if explicitly logged in
    const local = loadTailorSession();
    if (typeof window !== 'undefined') {
      const isLoggedOut = localStorage.getItem('thy_logged_out') === 'true';
      if (isLoggedOut) {
        setSession(createDefaultSession());
      } else {
        setSession(local);
      }
    }
    setIsReady(true);
  }, []);

  const updateSession = useCallback((partial: Partial<TailorSession>) => {
    setSession((current) => {
      const next = { ...current, ...partial };
      persistTailorSession(next);
      return next;
    });
    return session;
  }, [session]);

  const completeAuthentication = useCallback(
    (token: string, authenticatedRole?: 'customer' | 'tailor' | null) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('thy_logged_out');
      }
      const next: TailorSession = {
        ...session,
        isAuthenticated: true,
        role: authenticatedRole ?? session.role ?? 'customer',
      };
      setAccessToken(token);
      setSession(next);
      persistTailorSession(next);
      return next;
    },
    [session]
  );

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      localStorage.setItem('thy_logged_out', 'true');
    }
    setAccessToken(null);
    setSession(createDefaultSession());
  }, []);

  const value = useMemo(
    () => ({
      session,
      isReady,
      accessToken,
      updateSession,
      completeAuthentication,
      logout,
    }),
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