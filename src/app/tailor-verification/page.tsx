'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { submitTailorVerification } from '@/lib/auth-api';
import { hasSubmittedVerification } from '@/lib/tailor-session';

export default function TailorVerificationPage() {
  const router = useRouter();
  const { session, isReady, accessToken, updateSession } = useTailorSession();
  const [govId, setGovId] = useState<File | null>(null);
  const [shopProof, setShopProof] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!session.isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (session.role !== 'tailor') {
      router.replace('/');
      return;
    }
    if (hasSubmittedVerification(session)) {
      router.replace('/tailor-dashboard');
    }
  }, [isReady, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govId) {
      setErrorMessage('Please upload a government ID to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const documentName = [govId.name, shopProof?.name].filter(Boolean).join(', ');
    const verification = {
      idType: 'Aadhaar / PAN',
      idNumber: 'on-file',
      documentName: documentName || 'Identity proof',
      status: 'pending' as const,
    };

    try {
      if (accessToken) {
        await submitTailorVerification(
          {
            idType: verification.idType,
            idNumber: `${govId.name}-${govId.size}`,
            documentName: verification.documentName,
          },
          accessToken
        );
      }
    } catch {
      // Session still records the one-time signup so later logins skip this page.
    }

    updateSession({
      isAuthenticated: true,
      role: 'tailor',
      verification,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('thy_logged_out');
    }

    router.push('/tailor-dashboard');
    setIsSubmitting(false);
  };

  if (!isReady) {
    return (
      <div className="min-h-dvh bg-transparent flex items-center justify-center p-4" suppressHydrationWarning>
        <div className="text-sm text-thy-muted" suppressHydrationWarning>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-transparent flex items-center justify-center p-4">
      <div className="thy-card p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <p className="thy-section-label mb-2">THY</p>
          <h1
            className="text-3xl leading-[0.95] text-thy-ink"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Tailor Verification
          </h1>
          <p className="text-sm text-thy-muted mt-3">
            Upload identity and business proofs once during signup to activate payouts and ordering.
          </p>
          <div className="thy-divider-glow mt-4 mx-auto max-w-xs" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-thy-ink mb-1">
              Government ID Proof (Aadhaar / PAN / Driving License)
            </label>
            <input
              type="file"
              required
              accept="image/*,.pdf"
              onChange={(e) => setGovId(e.target.files?.[0] || null)}
              className="w-full text-xs text-thy-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-thy-mist file:text-thy-brand hover:file:bg-thy-mist cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-thy-ink mb-1">
              Shop / Studio License or Address Proof
            </label>
            <input
              type="file"
              required
              accept="image/*,.pdf"
              onChange={(e) => setShopProof(e.target.files?.[0] || null)}
              className="w-full text-xs text-thy-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-thy-mist file:text-thy-brand hover:file:bg-thy-mist cursor-pointer"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px] space-y-0.5">
            <p className="font-bold">Review Process</p>
            <p className="text-amber-700">
              This is required only once at signup. Later logins will not ask for these documents again.
            </p>
          </div>

          {errorMessage ? (
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-thy-brand hover:bg-thy-brand-hover text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting Documents...' : 'Submit Verification & Proceed →'}
          </button>
        </form>
      </div>
    </div>
  );
}
