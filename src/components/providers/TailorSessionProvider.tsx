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

  const syncSessionFromStorage = useCallback(() => {
    const local = loadTailorSession();
    let storedName = '';

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('thy_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          storedName = parsed?.name || parsed?.fullName || '';
        } catch {
          storedName = '';
        }
      }
    }

    if (storedName || local.isAuthenticated) {
      setSession({
        ...local,
        isAuthenticated: true,
        identifier: storedName || local.identifier,
      });
    } else {
      setSession({ ...local, isAuthenticated: false, identifier: '' });
    }
  }, []);

  useEffect(() => {
    syncSessionFromStorage();

    refreshAuthentication()
      .then(({ accessToken, user }) => {
        setAccessToken(accessToken);
        setSession((current) => {
          const userObj = user as Record<string, any>;
          const next: TailorSession = {
            ...current,
            isAuthenticated: true,
            role: userObj?.role ?? current.role ?? 'customer',
            identifier: userObj?.name || userObj?.fullName || userObj?.phoneNumber || current.identifier,
          };
          persistTailorSession(next);
          return next;
        });
      })
      .catch(() => undefined)
      .finally(() => setIsReady(true));

    window.addEventListener('storage', syncSessionFromStorage);
    window.addEventListener('thy-auth-change', syncSessionFromStorage);
    return () => {
      window.removeEventListener('storage', syncSessionFromStorage);
      window.removeEventListener('thy-auth-change', syncSessionFromStorage);
    };
  }, [syncSessionFromStorage]);

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
      localStorage.removeItem('thy_session');
      localStorage.removeItem('thy_user');
      localStorage.removeItem('tailor_session');
      window.dispatchEvent(new Event('thy-auth-change'));
    }

    const resetSession = createDefaultSession();
    resetSession.isAuthenticated = false;

    setAccessToken(null);
    setSession(resetSession);
    persistTailorSession(resetSession);
    void logoutAuthentication();
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