'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath, isCustomerOnboardingComplete } from '@/lib/tailor-session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerRegistration() {
  const router = useRouter();
  const { session, isReady, updateSession } = useTailorSession();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    if (session.role === 'tailor') {
      router.replace(getPostAuthPath(session));
      return;
    }

    if (session.isAuthenticated && isCustomerOnboardingComplete(session)) {
      router.replace('/');
      return;
    }

    if (session.customerProfile) {
      setFullName(session.customerProfile.fullName);
      setPhone(session.customerProfile.phone);
      setEmail(session.customerProfile.email);
      setCity(session.customerProfile.city);
      setAddress(session.customerProfile.address);
      return;
    }

    const trimmed = session.identifier.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) {
      setPhone(digits);
    } else if (EMAIL_REGEX.test(trimmed)) {
      setEmail(trimmed);
    }
    // Prefill once after session hydrates so typing is not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.replace(/\D/g, '');
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCity = city.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedCity || !trimmedAddress) {
      setErrorMessage('Please fill in all details to create your customer account.');
      return;
    }

    if (trimmedPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const next = updateSession({
      role: 'customer',
      identifier: session.identifier || trimmedPhone,
      customerProfile: {
        fullName: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        city: trimmedCity,
        address: trimmedAddress,
      },
    });

    router.push(getPostAuthPath(next));
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-thy-bg flex items-center justify-center">
        <p className="text-sm text-thy-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-thy-bg flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-3xl bg-thy-surface rounded-2xl border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.08)] p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-thy-ink">
            Customer Registration
          </h1>
          <p className="text-sm md:text-base text-thy-muted mt-2">
            Tell us where to reach you and deliver your outfits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="thy-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="thy-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="thy-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="city">
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Chennai"
              className="thy-input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="address">
              Delivery Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the address where outfits should be picked up or delivered"
              className="thy-input"
            />
          </div>

          {errorMessage && (
            <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-thy-brand hover:bg-thy-brand-hover text-white font-semibold rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
