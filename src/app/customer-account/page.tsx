'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  getCustomerFirstName,
  getPostAuthPath,
  isCustomerOnboardingComplete,
} from '@/lib/tailor-session';

const ACCOUNT_CARDS = [
  { href: '#profile', title: 'Profile', body: 'Name, city, delivery address and contact preferences.' },
  { href: '#measurements', title: 'Saved measurements', body: 'Keep sizes ready for the next saree, suit or sherwani.' },
  { href: '#orders', title: 'Order history', body: 'Quotes, fittings, stitching progress and deliveries.' },
  { href: '#wishlist', title: 'Wishlist', body: 'Looks and ateliers you want to return to.' },
  { href: '#chat', title: 'Chat with tailor', body: 'Fabric notes, revisions and fitting times.' },
  { href: '#track', title: 'Track order', body: 'See cutting, embroidery, fitting and dispatch.' },
];

export default function CustomerAccountPage() {
  const router = useRouter();
  const { session, isReady } = useTailorSession();

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

  if (!isReady || !session.isAuthenticated || !isCustomerOnboardingComplete(session)) {
    return (
      <div className="min-h-screen bg-[#F3EEE4] flex items-center justify-center">
        <p className="text-sm text-[#8A7D70]">Loading your atelier...</p>
      </div>
    );
  }

  const profile = session.customerProfile;
  const preferences = session.customerPreferences;

  return (
    <div className="min-h-screen bg-[#F3EEE4] text-[#2C2418]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7D70]">Your account</p>
        <h1 className="mt-2 text-4xl md:text-6xl leading-[0.92]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          Welcome back, {getCustomerFirstName(session)}.
        </h1>
        <p className="mt-4 max-w-xl text-[#5C5146]">
          Manage measurements, follow orders, and pick up the conversation with your tailor. Browse the atelier any time from the home page.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACCOUNT_CARDS.map((card) => (
            <a key={card.href} href={card.href} className="border border-[#2C2418]/10 bg-white/40 p-5 hover:border-[#C4A15A] transition-colors">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{card.title}</h2>
              <p className="mt-2 text-sm text-[#5C5146]">{card.body}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section id="profile" className="border border-[#2C2418]/10 p-6 bg-white/40">
            <h2 className="text-3xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Profile</h2>
            <div className="mt-4 space-y-2 text-sm text-[#5C5146]">
              <p><span className="text-[#8A7D70]">Name</span> · {profile?.fullName}</p>
              <p><span className="text-[#8A7D70]">Phone</span> · {profile?.phone}</p>
              <p><span className="text-[#8A7D70]">Email</span> · {profile?.email}</p>
              <p><span className="text-[#8A7D70]">City</span> · {profile?.city}</p>
              <p><span className="text-[#8A7D70]">Delivery</span> · {profile?.address}</p>
            </div>
          </section>

          <section id="measurements" className="border border-[#2C2418]/10 p-6 bg-white/40">
            <h2 className="text-3xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Preferences</h2>
            <div className="mt-4 space-y-2 text-sm text-[#5C5146]">
              <p><span className="text-[#8A7D70]">Shopping for</span> · {preferences?.shoppingFor}</p>
              <p><span className="text-[#8A7D70]">Contact</span> · {preferences?.contactMethod}</p>
              <p><span className="text-[#8A7D70]">Services</span> · {preferences?.services.join(', ')}</p>
              <p>
                <span className="text-[#8A7D70]">Garments</span> ·{' '}
                {preferences?.garmentTypes.length ? preferences.garmentTypes.join(', ') : 'Add looks from the atelier'}
              </p>
            </div>
          </section>
        </div>

        <section id="orders" className="mt-6 border border-[#2C2418]/10 p-6 bg-white/40">
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Orders</h2>
          <p className="mt-3 text-sm text-[#5C5146]">No stitching jobs yet. Request a quotation from Meet the Tailors.</p>
          <Link href="/#tailors" className="inline-block mt-5 text-[11px] uppercase tracking-[0.2em] border-b border-[#2C2418]">
            Browse artisans
          </Link>
        </section>
      </main>
    </div>
  );
}
