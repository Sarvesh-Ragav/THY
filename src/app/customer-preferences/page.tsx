'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  CUSTOMER_CONTACT_METHODS,
  CUSTOMER_GARMENT_TYPES,
  CUSTOMER_SERVICES,
  CUSTOMER_SHOPPING_FOR,
  CustomerContactMethod,
  CustomerGarmentType,
  CustomerService,
  CustomerShoppingFor,
  hasCustomerPreferences,
  hasCustomerProfile,
} from '@/lib/tailor-session';
import { AuthApiError, saveCustomerPreferences } from '@/lib/auth-api';

export default function CustomerPreferences() {
  const router = useRouter();
  const { session, isReady, updateSession, accessToken } = useTailorSession();
  const [shoppingFor, setShoppingFor] = useState<CustomerShoppingFor>('Myself');
  const [contactMethod, setContactMethod] = useState<CustomerContactMethod>('WhatsApp');
  const [services, setServices] = useState<CustomerService[]>(['Stitching']);
  const [garmentTypes, setGarmentTypes] = useState<CustomerGarmentType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (session.role === 'tailor') {
      router.replace('/tailor-registration');
      return;
    }

    if (!hasCustomerProfile(session)) {
      router.replace('/customer-registration');
      return;
    }

    // Preferences are signup-only: returning customers who already set them go home.
    if (session.isAuthenticated && hasCustomerPreferences(session)) {
      router.replace('/');
      return;
    }

    if (session.customerPreferences) {
      setShoppingFor(session.customerPreferences.shoppingFor);
      setContactMethod(session.customerPreferences.contactMethod);
      setServices(session.customerPreferences.services);
      setGarmentTypes(session.customerPreferences.garmentTypes);
    }
    // Prefill once after session hydrates so typing is not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, router]);

  const toggleService = (service: CustomerService) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    );
  };

  const toggleGarment = (garment: CustomerGarmentType) => {
    setGarmentTypes((prev) =>
      prev.includes(garment) ? prev.filter((item) => item !== garment) : [...prev, garment]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (services.length === 0) {
      setErrorMessage('Select at least one service you need from THY tailors.');
      return;
    }

    const preferences = {
      shoppingFor,
      contactMethod,
      services,
      garmentTypes,
    };

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (accessToken) {
        await saveCustomerPreferences(preferences, accessToken);
      }
      updateSession({
        isAuthenticated: true,
        role: 'customer',
        customerPreferences: preferences,
      });
      router.push('/');
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError ? error.message : 'Unable to save preferences. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-dvh bg-transparent flex items-center justify-center" suppressHydrationWarning>
        <div className="text-sm text-thy-muted" suppressHydrationWarning>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-transparent flex items-start sm:items-center justify-center p-4 md:p-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md md:max-w-2xl bg-thy-surface rounded-2xl border border-thy-ink/10 shadow-[0_24px_60px_rgba(11,51,47,0.08)] p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-thy-ink">
            Stitching Preferences
          </h1>
          <p className="text-sm md:text-base text-thy-muted mt-2">
            Help tailors understand what you usually need
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="shoppingFor">
              Who is this account for?
            </label>
            <select
              id="shoppingFor"
              value={shoppingFor}
              onChange={(e) => setShoppingFor(e.target.value as CustomerShoppingFor)}
              className="thy-input"
            >
              {CUSTOMER_SHOPPING_FOR.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-thy-ink mb-1" htmlFor="contactMethod">
              Preferred contact
            </label>
            <select
              id="contactMethod"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value as CustomerContactMethod)}
              className="thy-input"
            >
              {CUSTOMER_CONTACT_METHODS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <p className="block text-sm font-medium text-thy-ink mb-2">Services you need</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CUSTOMER_SERVICES.map((service) => {
                const active = services.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-3 rounded-xl border text-sm transition-all ${
                      active
                        ? 'border-thy-brand bg-thy-mist text-thy-brand font-bold'
                        : 'border-thy-ink/10 bg-thy-bg text-thy-muted font-medium'
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="block text-sm font-medium text-thy-ink mb-2">Typical garments</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CUSTOMER_GARMENT_TYPES.map((garment) => {
                const active = garmentTypes.includes(garment);
                return (
                  <button
                    key={garment}
                    type="button"
                    onClick={() => toggleGarment(garment)}
                    className={`p-3 rounded-xl border text-sm transition-all ${
                      active
                        ? 'border-thy-brand bg-thy-mist text-thy-brand font-bold'
                        : 'border-thy-ink/10 bg-thy-bg text-thy-muted font-medium'
                    }`}
                  >
                    {garment}
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-thy-brand hover:bg-thy-brand-hover text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
