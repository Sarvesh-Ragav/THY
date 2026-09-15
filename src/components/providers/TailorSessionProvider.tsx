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
import { logoutAuthentication, refreshAuthentication, type AuthenticatedUser } from '@/lib/auth-api';

interface TailorSessionContextValue {
  session: TailorSession;
  isReady: boolean;
  accessToken: string | null;
  updateSession: (partial: Partial<TailorSession>) => TailorSession;
  completeAuthentication: (
    accessToken: string,
    role?: 'customer' | 'tailor' | 'admin' | null,
    identifier?: string,
    user?: AuthenticatedUser | null,
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
      .then(({ accessToken, user }) => {
        setAccessToken(accessToken);
        setSession((current) => {
          const existing = current.customerProfile;
          const resolvedIdentifier = user.phoneNumber || user.email || current.identifier;
          const isPhone = Boolean(resolvedIdentifier && /^\+?\d{10,15}$/.test(resolvedIdentifier));
          const isEmail = Boolean(resolvedIdentifier && resolvedIdentifier.includes('@'));
          const next = {
            ...current,
            isAuthenticated: true,
            role: user.role ?? current.role,
            identifier: resolvedIdentifier,
            customerProfile: {
              fullName: existing?.fullName || user.name || '',
              phone: existing?.phone || user.phoneNumber || (isPhone ? resolvedIdentifier : ''),
              email: existing?.email || user.email || (isEmail ? resolvedIdentifier : ''),
              city: existing?.city || '',
              address: existing?.address || '',
            },
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

  const completeAuthentication = useCallback(
    (
      accessToken: string,
      authenticatedRole?: 'customer' | 'tailor' | 'admin' | null,
      identifier?: string,
      user?: AuthenticatedUser | null,
      sessionPatch?: Partial<TailorSession>
    ) => {
      const existing = sessionPatch?.customerProfile ?? session.customerProfile;
      const resolvedIdentifier = identifier ?? user?.phoneNumber ?? user?.email ?? session.identifier;
      const isPhone = Boolean(resolvedIdentifier && /^\+?\d{10,15}$/.test(resolvedIdentifier));
      const isEmail = Boolean(resolvedIdentifier && resolvedIdentifier.includes('@'));
      const next: TailorSession = {
        ...session,
        ...sessionPatch,
        isAuthenticated: true,
        hasPassword: Boolean(sessionPatch?.hasPassword ?? user?.hasPassword ?? session.hasPassword),
        role: authenticatedRole ?? user?.role ?? sessionPatch?.role ?? session.role,
        identifier: resolvedIdentifier,
        customerProfile: sessionPatch?.customerProfile ?? {
          fullName: existing?.fullName || user?.name || '',
          phone: existing?.phone || user?.phoneNumber || (isPhone ? resolvedIdentifier : ''),
          email: existing?.email || user?.email || (isEmail ? resolvedIdentifier : ''),
          city: existing?.city || '',
          address: existing?.address || '',
        },
      };
      setAccessToken(accessToken);
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
