'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedEstimateService, setSelectedEstimateService] = useState('Saree Blouse');
  const [estimateNotes, setEstimateNotes] = useState('');

  const tailorInfo = {
    name: "Priya S.",
    businessName: "Priya's Boutique & Custom Tailoring",
    location: "Adyar, Chennai",
    experience: "8+ Years",
    rating: 4.9,
    totalReviews: 128,
    completedOrders: 154,
    isVerified: true,
    bio: "Specializing in designer blouses, custom Anarkalis, lehengas, and precision-fit alterations.",
  };

  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      title: 'Embroidered Silk Anarkali',
      category: 'Anarkali',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    },
    {
      id: '2',
      title: 'Bridal Velvet Blouse',
      category: 'Blouse',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    },
    {
      id: '3',
      title: 'Custom Men Kurta Set',
      category: 'Kurti',
      image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
      isFeatured: false,
    },
    {
      id: '4',
      title: 'Heavy Designer Lehenga',
      category: 'Lehenga',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    },
  ];

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
    <div className="space-y-6 text-thy-ink">
      {/* Header with Route Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Public Profile Preview
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            This is how customers view your profile, services, and portfolio on THY.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <Link
            href="/tailor-dashboard/portfolio"
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 transition-all text-center"
          >
            ⚙️ Tailor Management
          </Link>
          <span className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl bg-[#5C1A24] text-white shadow-xs text-center">
            👁️ Public Profile Preview
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
            alt={tailorInfo.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-thy-mist shadow-sm"
          />
          <div className="space-y-1.5 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{tailorInfo.businessName}</h2>
              {tailorInfo.isVerified && (
                <span className="bg-thy-mist text-thy-ink text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  ✓ THY Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{tailorInfo.bio}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 font-semibold pt-1">
              <span>📍 {tailorInfo.location}</span>
              <span>•</span>
              <span>✂️ {tailorInfo.experience}</span>
              <span>•</span>
              <span className="text-amber-500">⭐ {tailorInfo.rating} ({tailorInfo.totalReviews} Reviews)</span>
            </div>
          </div>
          <div className="shrink-0 space-y-2 text-center w-full md:w-auto">
            <button
              onClick={() => setIsEstimateModalOpen(true)}
              className="w-full px-5 py-2.5 bg-[#5C1A24] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#4A1520] transition-colors"
            >
              Request Estimate
            </button>
          </div>
        </div>

        {/* Services & Indicative Pricing */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Services Offered & Indicative Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.filter(s => s.enabled).map(service => (
              <div key={service.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">{service.name}</span>
                <span className="text-xs font-extrabold text-[#5C1A24]">₹{service.minPrice} - ₹{service.maxPrice}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Note: Final price may vary by design, fabric, customization, and specific measurements.
          </p>
        </div>

        {/* Featured Work Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">⭐ Featured Work</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portfolioItems.filter(i => i.isFeatured).slice(0, 3).map(item => (
              <div key={item.id} className="rounded-2xl overflow-hidden border border-slate-200 group">
                <div className="h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs font-bold text-slate-900">{item.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Portfolio Gallery</h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    activeFilter === cat ? 'bg-[#5C1A24] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredItems.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-slate-100 shadow-2xs">
                <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                <div className="p-2 bg-slate-50">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Customer Reviews</h3>
            <span className="text-xs font-bold text-amber-500">⭐ {tailorInfo.rating} out of 5</span>
          </div>
          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <p className="font-bold text-slate-900">
                    {rev.name}
                    {rev.isVerified && (
                      <span className="text-[10px] font-normal text-thy-burgundy bg-thy-mist px-2 py-0.5 rounded-md ml-2">
                        ✓ Verified Order
                      </span>
                    )}
                  </p>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Card */}
        <div className="bg-gradient-to-r from-[#3F1218] to-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-thy-cream">Why Customers Choose Priya</h3>
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

      {/* Request Estimate Modal */}
      {isEstimateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Request Estimate from {tailorInfo.name}</h3>
            <form onSubmit={e => { e.preventDefault(); alert('Test Estimate Request Sent!'); setIsEstimateModalOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Garment Service</label>
                <select
                  value={selectedEstimateService}
                  onChange={e => setSelectedEstimateService(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C1A24]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} (₹{s.minPrice} - ₹{s.maxPrice})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Design Details / Notes</label>
                <textarea
                  placeholder="Describe your design, measurements, or preferred timeline..."
                  value={estimateNotes}
                  onChange={e => setEstimateNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C1A24]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEstimateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#5C1A24] text-white rounded-xl text-xs font-bold hover:bg-[#4A1520]"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}