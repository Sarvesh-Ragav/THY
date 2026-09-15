'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function TailorVerificationPage() {
  const router = useRouter();
  const { updateSession } = useTailorSession();
  const [govId, setGovId] = useState<File | null>(null);
  const [shopProof, setShopProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Step 1: Update session state with authentication & verification data before redirecting
    updateSession({
      isAuthenticated: true,
      role: 'tailor',
      verification: {
        idType: 'Aadhaar / PAN',
        idNumber: 'VERIFIED-DOC-123',
        documentName: govId?.name || 'Identity Proof',
        status: 'pending',
      },
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('thy_logged_out');
    }

    // Simulating document upload API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Route user to dashboard after verification submission
      router.push('/tailor-dashboard');
    }, 1000);
  };

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
            Upload identity and business proofs to activate payouts and ordering.
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
            <p className="font-bold">⚠️ Review Process</p>
            <p className="text-amber-700">
              Documents take 24–48 hours for admin review. You can still set up your profile in the meantime.
            </p>
          </div>

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