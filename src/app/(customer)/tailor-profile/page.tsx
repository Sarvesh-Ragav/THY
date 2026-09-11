'use client';

import React, { useState } from 'react';

interface ServiceItem {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
}

interface PortfolioWork {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

export default function TailorPublicProfilePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Saree Blouse');
  const [notes, setNotes] = useState('');

  // Mock Profile Data
  const tailor = {
    name: "Priya S.",
    businessName: "Priya's Boutique & Custom Tailoring",
    location: "Adyar, Chennai",
    experience: "8+ Years",
    rating: 4.9,
    totalReviews: 128,
    completedOrders: 154,
    isVerified: true,
    bio: "Specializing in premium bridal blouses, custom designer Anarkalis, and precision-fit alterations. Delivering elegance with every stitch.",
  };

  const services: ServiceItem[] = [
    { id: '1', name: 'Saree Blouse', minPrice: 800, maxPrice: 2500 },
    { id: '2', name: 'Salwar / Kurti', minPrice: 600, maxPrice: 1800 },
    { id: '3', name: 'Anarkali', minPrice: 1500, maxPrice: 4500 },
    { id: '4', name: 'Lehenga', minPrice: 3000, maxPrice: 12000 },
    { id: '5', name: 'Bridal Wear', minPrice: 5000, maxPrice: 25000 },
    { id: '6', name: 'Alterations & Custom Stitching', minPrice: 200, maxPrice: 800 },
  ];

  const portfolio: PortfolioWork[] = [
    { id: '1', title: 'Heavy Silk Bridal Blouse', category: 'Blouse', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' },
    { id: '2', title: 'Royal Anarkali Suit', category: 'Anarkali', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80' },
    { id: '3', title: 'Hand-Embroidered Lehenga', category: 'Lehenga', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
    { id: '4', title: 'Casual Cotton Kurti', category: 'Kurti', image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80' },
  ];

  const reviews: Review[] = [
    { id: '1', name: 'Ananya Ramesh', rating: 5, date: 'Sep 2026', comment: 'The fitting was spot on! Completed my blouse in just 3 days.', isVerified: true },
    { id: '2', name: 'Meera K.', rating: 5, date: 'Aug 2026', comment: 'Beautiful intricate border work on my Anarkali suit. Highly recommended!', isVerified: true },
  ];

  const categories = ['All', 'Blouse', 'Kurti', 'Anarkali', 'Lehenga', 'Bridal'];

  const filteredPortfolio = selectedCategory === 'All'
    ? portfolio
    : portfolio.filter(item => item.category === selectedCategory);

  const handleEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Estimate Request Sent to ${tailor.name} for ${selectedService}!`);
    setIsEstimateModalOpen(false);
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 space-y-6">
      
      {/* C11 Header Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
            alt={tailor.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-teal-50 shadow-sm"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{tailor.businessName}</h1>
              {tailor.isVerified && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  ✓ THY Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{tailor.bio}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-slate-600 pt-1">
              <span>📍 {tailor.location}</span>
              <span>•</span>
              <span>✂️ {tailor.experience}</span>
              <span>•</span>
              <span className="text-amber-500">⭐ {tailor.rating} ({tailor.totalReviews} reviews)</span>
            </div>
          </div>
          <div className="shrink-0 space-y-2 text-center w-full sm:w-auto">
            <button
              onClick={() => setIsEstimateModalOpen(true)}
              className="w-full px-6 py-3 bg-[#00c9b7] text-white font-extrabold text-xs rounded-2xl shadow-sm hover:bg-[#00b5a4] transition-all"
            >
              Request Estimate
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Services + Portfolio */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Services & Indicative Price Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Services Offered & Indicative Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((service) => (
              <div key={service.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">{service.name}</span>
                <span className="text-xs font-extrabold text-[#00c9b7]">
                  ₹{service.minPrice} - ₹{service.maxPrice}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * Final price may vary based on design complexity, fabric customization, and measurements.
          </p>
        </div>

        {/* Portfolio Visual Grid with Filters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Portfolio & Past Work</h2>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    selectedCategory === cat ? 'bg-[#00c9b7] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-slate-100 shadow-2xs group">
                <div className="h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 bg-slate-50">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Reviews */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Customer Reviews</h2>
            <span className="text-xs font-bold text-amber-500">⭐ {tailor.rating} / 5.0</span>
          </div>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <p className="font-bold text-slate-900">
                    {rev.name}
                    {rev.isVerified && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-2 font-semibold">
                        ✓ Verified Order
                      </span>
                    )}
                  </p>
                  <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating)}</span>
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
                <p className="text-[10px] text-slate-400 pt-0.5">{rev.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REQUEST ESTIMATE MODAL */}
      {isEstimateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Request Estimate from {tailor.name}</h3>
            <form onSubmit={handleEstimateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Garment Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} (₹{s.minPrice} - ₹{s.maxPrice})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Customization & Notes</label>
                <textarea
                  placeholder="Describe your design, measurements, or urgent delivery date..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7]"
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
                  className="flex-1 py-2.5 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4]"
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