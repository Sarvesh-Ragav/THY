'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TailorVerificationPage() {
  const router = useRouter();
  const [govId, setGovId] = useState<File | null>(null);
  const [shopProof, setShopProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating document upload API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Route user to dashboard after verification submission
      router.push('/tailor-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-gray-100 space-y-6">
        <div className="text-center space-y-1">
          <div className="text-3xl mb-2">📜</div>
          <h1 className="text-xl font-bold text-gray-900">Tailor Verification</h1>
          <p className="text-xs text-gray-500">
            Upload identity & business proofs to activate full payout and ordering features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Government ID Proof (Aadhaar / PAN / Driving License)
            </label>
            <input
              type="file"
              required
              accept="image/*,.pdf"
              onChange={(e) => setGovId(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-[#00c9b7] hover:file:bg-teal-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Shop / Studio License or Address Proof
            </label>
            <input
              type="file"
              required
              accept="image/*,.pdf"
              onChange={(e) => setShopProof(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-[#00c9b7] hover:file:bg-teal-100 cursor-pointer"
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
            className="w-full py-3 bg-[#00c9b7] text-white rounded-xl font-bold text-xs hover:bg-[#00b5a4] transition-colors shadow-sm"
          >
            {isSubmitting ? 'Submitting Documents...' : 'Submit Verification & Proceed →'}
          </button>
        </form>
      </div>
    </div>
  );
}