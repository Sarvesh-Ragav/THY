'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { TailorPage } from '@/components/tailor/TailorPage';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  isFeatured: boolean;
}

interface ServicePrice {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  enabled: boolean;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

export default function TailorProfilePreviewPage() {
  const { session } = useTailorSession();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const displayName = session.profile?.fullName || 'Tailor';
  const displayBusinessName = session.profile?.shopName || (displayName !== 'Tailor' ? `${displayName}'s Boutique` : 'Your atelier');
  const displayLocation = session.profile?.city || session.profile?.shopAddress || session.selectedLocation || 'India';
  const displayExperience = session.profile?.yearsOfExperience
    ? `${session.profile.yearsOfExperience}+ Years`
    : 'Experience on file';

  const tailorInfo = {
    name: displayName,
    businessName: displayBusinessName,
    location: displayLocation,
    experience: displayExperience,
    rating: 4.9,
    totalReviews: 128,
    completedOrders: 154,
    isVerified: true,
    bio: "Specializing in designer blouses, custom Anarkalis, lehengas, and precision-fit alterations.",
  };

  const savedPortfolio = (session.tailorPortfolio ?? []).map((item, index) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image,
    isFeatured: index < 2,
  }));
  const portfolioItems: PortfolioItem[] = savedPortfolio;

  const services: ServicePrice[] = [
    { id: '1', name: 'Saree Blouse', minPrice: 800, maxPrice: 2500, enabled: true },
    { id: '2', name: 'Salwar / Kurti', minPrice: 600, maxPrice: 1800, enabled: true },
    { id: '3', name: 'Anarkali', minPrice: 1500, maxPrice: 4500, enabled: true },
    { id: '4', name: 'Lehenga', minPrice: 3000, maxPrice: 12000, enabled: true },
    { id: '5', name: 'Bridal Wear', minPrice: 5000, maxPrice: 25000, enabled: true },
    { id: '6', name: 'Alterations', minPrice: 200, maxPrice: 800, enabled: true },
  ];

  const reviews: Review[] = [
    { id: '1', name: 'Ananya Ramesh', rating: 5, date: 'Sep 2026', comment: 'Perfect fit on my silk saree blouse! Delivery was right on time for the wedding event.', isVerified: true },
    { id: '2', name: 'Meera K.', rating: 5, date: 'Aug 2026', comment: 'Superb stitching quality and accurate measurements. Very professional service.', isVerified: true },
  ];

  const categories = ['All', 'Blouse', 'Kurti', 'Anarkali', 'Lehenga', 'Dress', 'Bridal'];

  const filteredItems = activeFilter === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <TailorPage
      title="Public Profile"
      description="This is how customers view your atelier, services, and portfolio."
      actions={
        <div className="flex items-center gap-2 bg-thy-mist p-1.5 w-full sm:w-auto">
          <Link
            href="/tailor-dashboard/portfolio"
            className="flex-1 sm:flex-none px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-thy-muted hover:text-thy-ink text-center"
          >
            Management
          </Link>
          <span className="flex-1 sm:flex-none px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] bg-thy-burgundy text-white text-center">
            Preview
          </span>
        </div>
      }
    >
      <div className="space-y-6 text-thy-ink">

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="thy-card p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
            alt={tailorInfo.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-thy-mist shadow-sm"
          />
          <div className="space-y-1.5 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-thy-ink">{tailorInfo.businessName}</h2>
              {tailorInfo.isVerified && (
                <span className="bg-thy-mist text-thy-ink text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  ✓ THY Verified
                </span>
              )}
            </div>
            <p className="text-xs text-thy-muted font-medium">{tailorInfo.bio}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-thy-muted font-semibold pt-1">
              <span>📍 {tailorInfo.location}</span>
              <span>•</span>
              <span>✂️ {tailorInfo.experience}</span>
              <span>•</span>
              <span className="text-amber-500">⭐ {tailorInfo.rating} ({tailorInfo.totalReviews} Reviews)</span>
            </div>
          </div>
        </div>

        {/* Services & Indicative Pricing */}
        <div className="thy-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-thy-ink border-b border-thy-burgundy/10 pb-3">Services Offered & Indicative Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.filter(s => s.enabled).map(service => (
              <div key={service.id} className="p-3 bg-thy-mist rounded-2xl border border-thy-burgundy/10 flex justify-between items-center">
                <span className="text-xs font-bold text-thy-ink">{service.name}</span>
                <span className="text-xs font-extrabold text-thy-burgundy">₹{service.minPrice} - ₹{service.maxPrice}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-thy-subtle italic">
            Note: Final price may vary by design, fabric, customization, and specific measurements.
          </p>
        </div>

        {/* Featured Work Grid */}
        <div className="thy-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-thy-ink border-b border-thy-burgundy/10 pb-3">⭐ Featured Work</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portfolioItems.filter(i => i.isFeatured).slice(0, 3).length === 0 ? (
              <p className="text-sm text-thy-muted col-span-full">Featured work will appear here once you add portfolio pieces.</p>
            ) : (
              portfolioItems.filter(i => i.isFeatured).slice(0, 3).map(item => (
              <div key={item.id} className="rounded-2xl overflow-hidden border border-thy-burgundy/15 group">
                <div className="h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 bg-thy-surface">
                  <p className="text-xs font-bold text-thy-ink">{item.title}</p>
                  <p className="text-[10px] text-thy-muted font-medium">{item.category}</p>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="thy-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-thy-burgundy/10 pb-3">
            <h3 className="text-sm font-bold text-thy-ink">Portfolio Gallery</h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                    activeFilter === cat ? 'bg-thy-burgundy text-white' : 'bg-thy-mist text-thy-muted hover:bg-thy-mist'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredItems.length === 0 ? (
              <p className="text-sm text-thy-muted col-span-full">No portfolio pieces yet. Add finished work from Portfolio management.</p>
            ) : (
              filteredItems.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-thy-burgundy/10 shadow-2xs">
                <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                <div className="p-2 bg-thy-mist">
                  <p className="text-[11px] font-bold text-thy-ink truncate">{item.title}</p>
                  <p className="text-[10px] text-thy-subtle">{item.category}</p>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Reviews */}
        <div className="thy-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
            <h3 className="text-sm font-bold text-thy-ink">Customer Reviews</h3>
            <span className="text-xs font-bold text-amber-500">⭐ {tailorInfo.rating} out of 5</span>
          </div>
          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-thy-mist rounded-2xl border border-thy-burgundy/10 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <p className="font-bold text-thy-ink">
                    {rev.name}
                    {rev.isVerified && (
                      <span className="text-[10px] font-normal text-thy-burgundy bg-thy-mist px-2 py-0.5 rounded-md ml-2">
                        ✓ Verified Order
                      </span>
                    )}
                  </p>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-xs text-thy-muted">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Card */}
        <div className="bg-gradient-to-r from-thy-brand to-thy-brand-active text-white p-6 rounded-3xl shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-thy-canvas">Why Customers Choose {tailorInfo.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-lg font-black text-white">{tailorInfo.experience}</p>
              <p className="text-[10px] text-thy-cream/80">Experience</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-lg font-black text-white">{tailorInfo.completedOrders}+</p>
              <p className="text-[10px] text-thy-cream/80">Completed Orders</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-lg font-black text-white">{tailorInfo.rating} ★</p>
              <p className="text-[10px] text-thy-cream/80">User Rating</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-lg font-black text-thy-cream">100%</p>
              <p className="text-[10px] text-thy-cream/80">THY Verified</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </TailorPage>
  );
}