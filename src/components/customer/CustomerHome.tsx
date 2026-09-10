'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { PlaceholderVideo } from '@/components/customer/PlaceholderVideo';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  CATEGORIES,
  FEATURED_TAILORS,
  FILTERS,
  FeaturedTailor,
  HOW_IT_WORKS,
} from '@/lib/customer-home-data';
import { isCustomerOnboardingComplete } from '@/lib/tailor-session';

export function CustomerHome() {
  const router = useRouter();
  const { session, isReady } = useTailorSession();
  const [location, setLocation] = useState<(typeof FILTERS.location)[number]>('All cities');
  const [rating, setRating] = useState<(typeof FILTERS.rating)[number]>('Any rating');
  const [price, setPrice] = useState<(typeof FILTERS.price)[number]>('Any price');
  const [experience, setExperience] = useState<(typeof FILTERS.experience)[number]>('Any experience');
  const [selectedTailor, setSelectedTailor] = useState<FeaturedTailor | null>(null);

  const loggedInCustomer = isReady && session.isAuthenticated && session.role === 'customer' && isCustomerOnboardingComplete(session);

  const tailors = useMemo(() => {
    return FEATURED_TAILORS.filter((tailor) => {
      if (location !== 'All cities' && tailor.city !== location) return false;
      if (rating === '4.8+' && tailor.rating < 4.8) return false;
      if (rating === '4.5+' && tailor.rating < 4.5) return false;

      const priceValue = Number(tailor.startingPrice.replace(/[₹,]/g, ''));
      if (price === 'Under ₹3,000' && priceValue >= 3000) return false;
      if (price === '₹3,000–₹8,000' && (priceValue < 3000 || priceValue > 8000)) return false;
      if (price === '₹8,000+' && priceValue < 8000) return false;

      const years = Number.parseInt(tailor.experience, 10);
      if (experience === '10+ years' && years < 10) return false;
      if (experience === '5+ years' && years < 5) return false;
      return true;
    });
  }, [experience, location, price, rating]);

  const handleQuote = (tailor: FeaturedTailor) => {
    if (!loggedInCustomer) {
      router.push('/login');
      return;
    }
    setSelectedTailor(tailor);
  };

  return (
    <div className="min-h-screen bg-[#F3EEE4] text-[#2C2418]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
      <CustomerNavbar />

      <section className="relative min-h-[88vh] overflow-hidden">
        <PlaceholderVideo
          poster="/hero/hero-couple.png"
          label="Watch atelier film"
          className="absolute inset-0 h-full w-full"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[88vh] flex items-end pb-16 md:pb-24">
          <div className="max-w-2xl text-[#F3EEE4]">
            <p className="text-[11px] uppercase tracking-[0.32em] mb-4">Customer atelier</p>
            <h1
              className="text-[clamp(3rem,7vw,7rem)] leading-[0.88] tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Bespoke Indian wear.
              <br />
              Tailored locally.
            </h1>
            <p className="mt-5 max-w-md text-sm md:text-base text-[#F3EEE4]/80 leading-relaxed">
              Discover artisan tailors for sarees, salwars, sherwanis and lehengas. Share a brief, receive a quote, and wear a piece made for you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="hero-leather-btn px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2C2418]">
                Design your perfect fit
              </Link>
              <Link href="#tailors" className="text-[11px] uppercase tracking-[0.22em] text-[#F3EEE4] border-b border-[#F3EEE4]/40 pb-1">
                Meet the tailors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="sarees" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A7D70]">Collections</p>
            <h2 className="mt-2 text-4xl md:text-5xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              What shall we make?
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              id={category.id}
              href={`#${category.id}`}
              className="group relative min-h-[280px] overflow-hidden bg-[#e6dccb]"
            >
              <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2418]/80 via-[#2C2418]/10 to-transparent" />
              <div className="absolute bottom-0 p-4 text-[#F3EEE4]">
                <h3 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{category.title}</h3>
                <p className="mt-1 text-xs text-[#F3EEE4]/80">{category.note}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="tailors" className="bg-[#2C2418] text-[#F3EEE4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#C4A15A]">Directory</p>
              <h2 className="mt-2 text-4xl md:text-5xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Meet the tailors
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[#F3EEE4]/70">
              Filter by city, rating, price and experience. Quotes require an account so the atelier can follow up.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            <select value={location} onChange={(e) => setLocation(e.target.value as typeof location)} className="bg-transparent border border-[#F3EEE4]/20 px-3 py-3 text-xs uppercase tracking-[0.16em] outline-none">
              {FILTERS.location.map((option) => <option key={option} className="text-[#2C2418]">{option}</option>)}
            </select>
            <select value={rating} onChange={(e) => setRating(e.target.value as typeof rating)} className="bg-transparent border border-[#F3EEE4]/20 px-3 py-3 text-xs uppercase tracking-[0.16em] outline-none">
              {FILTERS.rating.map((option) => <option key={option} className="text-[#2C2418]">{option}</option>)}
            </select>
            <select value={price} onChange={(e) => setPrice(e.target.value as typeof price)} className="bg-transparent border border-[#F3EEE4]/20 px-3 py-3 text-xs uppercase tracking-[0.16em] outline-none">
              {FILTERS.price.map((option) => <option key={option} className="text-[#2C2418]">{option}</option>)}
            </select>
            <select value={experience} onChange={(e) => setExperience(e.target.value as typeof experience)} className="bg-transparent border border-[#F3EEE4]/20 px-3 py-3 text-xs uppercase tracking-[0.16em] outline-none">
              {FILTERS.experience.map((option) => <option key={option} className="text-[#2C2418]">{option}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tailors.map((tailor) => (
              <article key={tailor.id} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] bg-[#F3EEE4] text-[#2C2418] overflow-hidden">
                <img src={tailor.image} alt="" className="h-56 sm:h-full w-full object-cover" />
                <div className="p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8A7D70]">{tailor.studio}</p>
                      <h3 className="text-2xl mt-1" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{tailor.name}</h3>
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.16em] px-2 py-1 ${tailor.available ? 'bg-[#d9efe4] text-[#1d5c45]' : 'bg-[#f0e4d4] text-[#8A7D70]'}`}>
                      {tailor.available ? 'Available' : 'Waitlist'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#5C5146]">{tailor.specialty} · {tailor.city}</p>
                  <p className="mt-1 text-sm">★ {tailor.rating} · {tailor.reviews} reviews · {tailor.experience}</p>
                  <p className="mt-2 text-sm">From {tailor.startingPrice}</p>
                  <button
                    type="button"
                    onClick={() => handleQuote(tailor)}
                    className="mt-auto pt-5 text-left text-[11px] uppercase tracking-[0.2em] text-[#2C2418] border-b border-[#2C2418] w-fit"
                  >
                    {loggedInCustomer ? 'Request quotation' : 'Log in to request a quote'}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {tailors.length === 0 && (
            <p className="text-sm text-[#F3EEE4]/70">No ateliers match these filters yet. Try a broader city or price range.</p>
          )}
        </div>
      </section>

      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-4xl md:text-5xl mb-12" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          How THY works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step}>
              <p className="text-[#C4A15A] text-sm tracking-[0.2em]">{item.step}</p>
              <h3 className="mt-3 text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{item.title}</h3>
              <p className="mt-2 text-sm text-[#5C5146] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="salwars" className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl mb-8" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Atelier film & fabrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PlaceholderVideo poster="/hero/hero-street.png" label="Placeholder process film" className="md:col-span-2 min-h-[320px] md:min-h-[420px]" />
            <div className="grid grid-rows-2 gap-4 min-h-[320px]">
              <img src="/hero/fabric-beige.png" alt="Silk placeholder" className="h-full w-full object-cover" />
              <img src="/hero/fabric-olive.png" alt="Sherwani placeholder" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2C2418]/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-[#8A7D70]">
          <p>THY · Connecting you with Indian artisans</p>
          <div className="flex gap-6">
            <Link href="/login">Log In</Link>
            <Link href="/signup">Create account</Link>
            <Link href="/customer-account">Orders & profile</Link>
          </div>
        </div>
      </footer>

      {selectedTailor && (
        <div className="fixed inset-0 z-50 bg-[#2C2418]/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#F3EEE4] p-6 space-y-4">
            <h3 className="text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              Quote request · {selectedTailor.name}
            </h3>
            <p className="text-sm text-[#5C5146]">
              Measurement upload, fabric notes and payment will connect here next. For now this confirms the atelier received your interest.
            </p>
            <button
              type="button"
              onClick={() => setSelectedTailor(null)}
              className="hero-leather-btn px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#2C2418]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
