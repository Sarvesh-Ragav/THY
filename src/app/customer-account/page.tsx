'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  getCustomerFirstName,
  getPostAuthPath,
  isCustomerOnboardingComplete,
} from '@/lib/tailor-session';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { session, isReady, logout } = useTailorSession();

  useEffect(() => {
    if (!isReady) return;

    if (session.role === 'tailor') {
      router.replace(getPostAuthPath(session));
      return;
    }

    if (!session.isAuthenticated || !isCustomerOnboardingComplete(session)) {
      router.replace(getPostAuthPath({ ...session, role: session.role ?? 'customer' }));
    }
  }, [isReady, session, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isReady || !session.isAuthenticated || !isCustomerOnboardingComplete(session)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const profile = session.customerProfile;
  const preferences = session.customerPreferences;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome, {getCustomerFirstName(session)}!
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Your customer account is ready. The customer dashboard will be available next.
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
            <h2 className="font-bold text-gray-900 mb-2">Account details</h2>
            <p><strong>Name:</strong> {profile?.fullName}</p>
            <p><strong>Phone:</strong> {profile?.phone}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>City:</strong> {profile?.city}</p>
            <p><strong>Delivery address:</strong> {profile?.address}</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
            <h2 className="font-bold text-gray-900 mb-2">Stitching preferences</h2>
            <p><strong>Shopping for:</strong> {preferences?.shoppingFor}</p>
            <p><strong>Preferred contact:</strong> {preferences?.contactMethod}</p>
            <p><strong>Services:</strong> {preferences?.services.join(', ')}</p>
            <p>
              <strong>Typical garments:</strong>{' '}
              {preferences?.garmentTypes.length ? preferences.garmentTypes.join(', ') : 'Not specified yet'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full mt-8 py-3 bg-[#00c9b7] hover:bg-[#00b5a4] text-white font-semibold rounded-lg transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
