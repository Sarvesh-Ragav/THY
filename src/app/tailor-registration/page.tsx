'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { getPostAuthPath, isTailorOnboardingComplete } from '@/lib/tailor-session';
import { AuthApiError, registerAccount } from '@/lib/auth-api';
import { PasswordField, validatePasswordPair } from '@/components/auth/PasswordField';

export default function TailorRegistration() {
  const router = useRouter();
  const { session, isReady, completeAuthentication } = useTailorSession();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (session.role === 'customer') {
      router.replace(getPostAuthPath(session));
      return;
    }

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
    }

    const trimmed = session.identifier.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) {
      setPhone(digits);
    } else if (trimmed.includes('@')) {
      setEmail(trimmed);
    }
    // Prefill once after session hydrates so typing is not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.replace(/\D/g, '');
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedShop = shopName.trim();
    const trimmedExperience = yearsOfExperience.trim();
    const trimmedAddress = shopAddress.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedShop || !trimmedExperience || !trimmedAddress) {
      setErrorMessage('Please fill in all registration details to continue.');
      return;
    }

    if (trimmedPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (Number(trimmedExperience) < 0) {
      setErrorMessage('Years of experience cannot be negative.');
      return;
    }

    const passwordError = validatePasswordPair(password, confirmPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const profile = {
        fullName: trimmedName,
        phone: trimmedPhone,
        shopName: trimmedShop,
        yearsOfExperience: trimmedExperience,
        shopAddress: trimmedAddress,
      };
      const result = await registerAccount({
        role: 'tailor',
        fullName: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        shopName: trimmedShop,
        yearsOfExperience: Number(trimmedExperience),
        shopAddress: trimmedAddress,
        password,
        confirmPassword,
      });
      completeAuthentication(result.accessToken, 'tailor', trimmedPhone, result.user, {
        role: 'tailor',
        hasPassword: true,
        identifier: trimmedPhone,
        profile,
      });
      router.push('/tailor-verification');
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError
          ? error.message
          : 'Unable to create your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-dvh bg-transparent flex items-center justify-center">
        <p className="text-sm text-thy-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-transparent flex items-start sm:items-center justify-center p-4 md:p-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md md:max-w-3xl bg-thy-surface rounded-2xl border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.08)] p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-thy-ink">
            Tailor Registration
          </h1>
          <p className="text-sm md:text-base text-thy-muted mt-2">
            Fill in your details and set a password to get started
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
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="shopName">
              Shop Name
            </label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
              className="thy-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="yearsOfExperience">
              Years of Experience
            </label>
            <input
              id="yearsOfExperience"
              type="number"
              min="0"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="e.g. 5"
              className="thy-input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="shopAddress">
              Shop Address
            </label>
            <textarea
              id="shopAddress"
              rows={3}
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              placeholder="Enter complete shop address"
              className="thy-input"
            />
          </div>

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your password"
          />

          {errorMessage && (
            <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-thy-brand hover:bg-thy-brand-hover text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
