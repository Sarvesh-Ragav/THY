'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath, hasTailorProfile, isTailorOnboardingComplete } from '@/lib/tailor-session';

export default function TailorVerification() {
  const router = useRouter();
  const { session, isReady, updateSession } = useTailorSession();
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    if (session.role === 'customer') {
      router.replace(getPostAuthPath(session));
      return;
    }

    if (!hasTailorProfile(session)) {
      router.replace('/tailor-registration');
      return;
    }

    if (session.isAuthenticated && isTailorOnboardingComplete(session)) {
      router.replace('/tailor-dashboard');
      return;
    }

    if (session.verification) {
      setIdType(session.verification.idType);
      setIdNumber(session.verification.idNumber);
      setDocumentName(session.verification.documentName);
    }
    // Prefill once after session hydrates so typing is not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = idNumber.trim();
    if (!trimmedId) {
      setErrorMessage('Please enter your ID number.');
      return;
    }

    if (!documentName) {
      setErrorMessage('Please upload a document photo to continue.');
      return;
    }

    updateSession({
      isAuthenticated: true,
      role: 'tailor',
      verification: {
        idType,
        idNumber: trimmedId,
        documentName,
        status: 'pending',
      },
    });

    router.push('/tailor-dashboard');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tailor Verification
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Upload your verification documents to complete setup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="idType">
              Government ID Type
            </label>
            <select
              id="idType"
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option>Aadhaar Card</option>
              <option>PAN Card</option>
              <option>Voter ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="idNumber">
              ID Number
            </label>
            <input
              id="idNumber"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Enter ID number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="document">
              Upload Document Photo
            </label>
            <input
              id="document"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setDocumentName(e.target.files?.[0]?.name ?? '')}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#00c9b7] hover:file:bg-teal-100"
            />
            {documentName && (
              <p className="text-xs text-gray-500 mt-2">Selected: {documentName}</p>
            )}
          </div>

          {errorMessage && (
            <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-[#00c9b7] hover:bg-[#00b5a4] text-white font-semibold rounded-lg transition-colors"
            >
              Submit Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
