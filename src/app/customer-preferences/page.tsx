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
  hasCustomerProfile,
  isCustomerOnboardingComplete,
} from '@/lib/tailor-session';

export default function CustomerPreferences() {
  const router = useRouter();
  const { session, isReady, updateSession } = useTailorSession();
  const [shoppingFor, setShoppingFor] = useState<CustomerShoppingFor>('Myself');
  const [contactMethod, setContactMethod] = useState<CustomerContactMethod>('WhatsApp');
  const [services, setServices] = useState<CustomerService[]>(['Stitching']);
  const [garmentTypes, setGarmentTypes] = useState<CustomerGarmentType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    if (session.isAuthenticated && isCustomerOnboardingComplete(session)) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (services.length === 0) {
      setErrorMessage('Select at least one service you need from THY tailors.');
      return;
    }

    updateSession({
      isAuthenticated: true,
      role: 'customer',
      customerPreferences: {
        shoppingFor,
        contactMethod,
        services,
        garmentTypes,
      },
    });

    router.push('/');
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
            Stitching Preferences
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Help tailors understand what you usually need
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shoppingFor">
              Who is this account for?
            </label>
            <select
              id="shoppingFor"
              value={shoppingFor}
              onChange={(e) => setShoppingFor(e.target.value as CustomerShoppingFor)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {CUSTOMER_SHOPPING_FOR.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contactMethod">
              Preferred contact
            </label>
            <select
              id="contactMethod"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value as CustomerContactMethod)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {CUSTOMER_CONTACT_METHODS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <p className="block text-sm font-medium text-gray-700 mb-2">Services you need</p>
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
                        ? 'border-[#00c9b7] bg-teal-50 text-[#00c9b7] font-bold'
                        : 'border-gray-200 bg-gray-50 text-gray-500 font-medium'
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="block text-sm font-medium text-gray-700 mb-2">Typical garments</p>
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
                        ? 'border-[#00c9b7] bg-teal-50 text-[#00c9b7] font-bold'
                        : 'border-gray-200 bg-gray-50 text-gray-500 font-medium'
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
              className="w-full py-3 bg-[#00c9b7] hover:bg-[#00b5a4] text-white font-semibold rounded-lg transition-colors"
            >
              Create Customer Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
