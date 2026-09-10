'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath, isTailorOnboardingComplete } from '@/lib/tailor-session';

export default function TailorRegistration() {
  const router = useRouter();
  const { session, isReady, updateSession } = useTailorSession();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    if (session.isAuthenticated && isTailorOnboardingComplete(session)) {
      router.replace('/tailor-dashboard');
      return;
    }

    if (session.profile) {
      setFullName(session.profile.fullName);
      setPhone(session.profile.phone);
      setShopName(session.profile.shopName);
      setYearsOfExperience(session.profile.yearsOfExperience);
      setShopAddress(session.profile.shopAddress);
      return;
    }

    const digits = session.identifier.replace(/\D/g, '');
    if (digits.length === 10) {
      setPhone(digits);
    }
    // Prefill once after session hydrates so typing is not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.replace(/\D/g, '');
    const trimmedShop = shopName.trim();
    const trimmedExperience = yearsOfExperience.trim();
    const trimmedAddress = shopAddress.trim();

    if (!trimmedName || !trimmedPhone || !trimmedShop || !trimmedExperience || !trimmedAddress) {
      setErrorMessage('Please fill in all registration details to continue.');
      return;
    }

    if (trimmedPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (Number(trimmedExperience) < 0) {
      setErrorMessage('Years of experience cannot be negative.');
      return;
    }

    const next = updateSession({
      role: 'tailor',
      identifier: session.identifier || trimmedPhone,
      profile: {
        fullName: trimmedName,
        phone: trimmedPhone,
        shopName: trimmedShop,
        yearsOfExperience: trimmedExperience,
        shopAddress: trimmedAddress,
      },
    });

    router.push(getPostAuthPath(next));
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
      <div className="w-full max-w-md md:max-w-3xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tailor Registration
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Fill in your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shopName">
              Shop Name
            </label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yearsOfExperience">
              Years of Experience
            </label>
            <input
              id="yearsOfExperience"
              type="number"
              min="0"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="e.g. 5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shopAddress">
              Shop Address
            </label>
            <textarea
              id="shopAddress"
              rows={3}
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              placeholder="Enter complete shop address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {errorMessage && (
            <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-[#00c9b7] hover:bg-[#00b5a4] text-white font-semibold rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
