'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AuthApiError, loginWithPassword } from '@/lib/auth-api';
import { PasswordField } from '@/components/auth/PasswordField';
import { AuthMain } from '@/components/ui/AppScreen';

export default function AdminLoginPage() {
  const router = useRouter();
  const { session, isReady, completeAuthentication } = useTailorSession();
  const [email, setEmail] = useState('admin@thy.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (session.isAuthenticated && session.role === 'admin') {
      router.replace('/admin');
    }
  }, [isReady, router, session.isAuthenticated, session.role]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await loginWithPassword(email.trim().toLowerCase(), password);
      if (result.user.role !== 'admin') {
        setError('This account is not an admin. Use the main login for customers and tailors.');
        return;
      }
      completeAuthentication(result, { role: 'admin', identifier: email.trim().toLowerCase() });
      router.push('/admin');
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthMain>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-thy-surface border border-thy-ink/10 rounded-2xl p-6 sm:p-8 shadow-[0_18px_40px_rgba(92,26,36,0.08)] space-y-4"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">THY Admin</p>
          <h1 className="mt-2 text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Admin login
          </h1>
          <p className="mt-2 text-sm text-thy-muted">Verify tailors, manage accounts, and update delivery status.</p>
        </div>
        <label className="block text-sm">
          <span className="text-thy-subtle text-xs uppercase tracking-[0.14em]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="thy-input mt-1.5"
            required
            autoComplete="username"
          />
        </label>
        <PasswordField
          id="admin-password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter admin password"
          autoComplete="current-password"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 bg-thy-burgundy text-white text-[11px] uppercase tracking-[0.16em] font-semibold disabled:opacity-60"
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthMain>
  );
}
