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

export default function TailorPortfolioPage() {
  // Mode switcher: 'management' vs 'preview'
  const [viewMode, setViewMode] = useState<'management' | 'preview'>('management');

  // Filter state for portfolio
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Modal states
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [isEditServicesOpen, setIsEditServicesOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedEstimateService, setSelectedEstimateService] = useState('Saree Blouse');
  const [estimateNotes, setEstimateNotes] = useState('');

  // Tailor Profile Details
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

  // Mock Data: Portfolio Items
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
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
  ]);

  // Mock Data: Services & Pricing
  const [services, setServices] = useState<ServicePrice[]>([
    { id: '1', name: 'Saree Blouse', minPrice: 800, maxPrice: 2500, enabled: true },
    { id: '2', name: 'Salwar / Kurti', minPrice: 600, maxPrice: 1800, enabled: true },
    { id: '3', name: 'Anarkali', minPrice: 1500, maxPrice: 4500, enabled: true },
    { id: '4', name: 'Lehenga', minPrice: 3000, maxPrice: 12000, enabled: true },
    { id: '5', name: 'Bridal Wear', minPrice: 5000, maxPrice: 25000, enabled: true },
    { id: '6', name: 'Alterations', minPrice: 200, maxPrice: 800, enabled: true },
  ]);

  // Mock Data: Reviews
  const reviews: Review[] = [
    { id: '1', name: 'Ananya Ramesh', rating: 5, date: 'Sep 2026', comment: 'Perfect fit on my silk saree blouse! Delivery was right on time for the wedding event.', isVerified: true },
    { id: '2', name: 'Meera K.', rating: 5, date: 'Aug 2026', comment: 'Superb stitching quality and accurate measurements. Very professional service.', isVerified: true },
  ];

  // Form State: Add Work
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Blouse');
  const [newImage, setNewImage] = useState('');
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  const categories = ['All', 'Blouse', 'Kurti', 'Anarkali', 'Lehenga', 'Dress', 'Bridal'];

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImage) return;

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      image: newImage,
      isFeatured: newIsFeatured,
    };

    setPortfolioItems([newItem, ...portfolioItems]);
    setIsAddWorkOpen(false);
    setNewTitle('');
    setNewImage('');
    setNewIsFeatured(false);
  };

  const toggleFeature = (id: string) => {
    setPortfolioItems(items =>
      items.map(item => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item)
    );
  };

  const deleteItem = (id: string) => {
    setPortfolioItems(items => items.filter(item => item.id !== id));
  };

  const filteredItems = activeFilter === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div className="p-3 md:p-8 min-h-screen bg-slate-50 text-slate-800 space-y-6">
      
      {/* Dynamic Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {viewMode === 'management' ? 'Portfolio & Work Management' : 'Public Profile Preview'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {viewMode === 'management' 
              ? 'Manage your finished work, pricing ranges, and active service offerings.' 
              : 'This is how customers view your profile, services, and portfolio on THY.'}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setViewMode('management')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'management' 
                ? 'bg-white text-[#00c9b7] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ Tailor Management
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'preview' 
                ? 'bg-[#00c9b7] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👁️ Public Profile Preview
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: TAILOR-SIDE MANAGEMENT */}
      {/* ========================================================================= */}
      {viewMode === 'management' && (
        <div className="space-y-6">
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setIsAddWorkOpen(true)}
              className="p-5 bg-gradient-to-r from-[#00c9b7] to-[#00b5a4] text-white rounded-2xl font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-between group"
            >
              <div className="text-left">
                <p className="text-base font-extrabold">+ Add New Work</p>
                <p className="text-xs text-teal-100 font-normal">Upload garment photos & titles</p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => setIsEditServicesOpen(true)}
              className="p-5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-800 shadow-xs hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="text-left">
                <p className="text-base font-extrabold text-slate-900">Edit Services Offered</p>
                <p className="text-xs text-slate-500 font-normal">Manage tailoring service list</p>
              </div>
              <span className="text-slate-400">✂️</span>
            </button>

            <button
              onClick={() => setIsEditServicesOpen(true)}
              className="p-5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-800 shadow-xs hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="text-left">
                <p className="text-base font-extrabold text-slate-900">Edit Price Ranges</p>
                <p className="text-xs text-slate-500 font-normal">Set Min - Max estimate rates</p>
              </div>
              <span className="text-slate-400">🏷️</span>
            </button>
          </div>

          {/* Manage Work Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Your Work Gallery ({portfolioItems.length})</h2>
              <p className="text-xs text-slate-400 hidden sm:block">Featured items display prominently on your public profile</p>
            </div>

            {portfolioItems.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                <div className="w-16 h-16 bg-teal-50 text-[#00c9b7] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  🧵
                </div>
                <h3 className="text-base font-bold text-slate-800">Empty Portfolio</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Show customers what you can create. Add your services, indicative price ranges, and best work.
                </p>
                <button
                  onClick={() => setIsAddWorkOpen(true)}
                  className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] transition-colors"
                >
                  + Add Your First Work
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden group bg-slate-50/50 hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      {item.isFeatured && (
                        <span className="absolute top-2 left-2 bg-[#00c9b7] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                        <button
                          onClick={() => toggleFeature(item.id)}
                          className={`font-bold hover:underline ${item.isFeatured ? 'text-amber-600' : 'text-slate-600'}`}
                        >
                          {item.isFeatured ? 'Unfeature' : 'Feature Work'}
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CUSTOMER-FACING PUBLIC PROFILE PREVIEW */}
      {/* ========================================================================= */}
      {viewMode === 'preview' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* C11 Banner Banner Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
              alt={tailorInfo.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-50 shadow-sm"
            />
            <div className="space-y-1.5 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{tailorInfo.businessName}</h2>
                {tailorInfo.isVerified && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
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
                className="w-full px-5 py-2.5 bg-[#00c9b7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#00b5a4] transition-colors"
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
                  <span className="text-xs font-extrabold text-[#00c9b7]">₹{service.minPrice} - ₹{service.maxPrice}</span>
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

          {/* Visual Grid Portfolio + Filter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Portfolio Gallery</h3>
              
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                      activeFilter === cat ? 'bg-[#00c9b7] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

          {/* Customer Reviews */}
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
                        <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-2">
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

          {/* Why Customers Choose This Tailor */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-teal-300">Why Customers Choose Priya</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-lg font-black text-white">{tailorInfo.experience}</p>
                <p className="text-[10px] text-teal-200">Experience</p>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-lg font-black text-white">{tailorInfo.completedOrders}+</p>
                <p className="text-[10px] text-teal-200">Completed Orders</p>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-lg font-black text-white">{tailorInfo.rating} ★</p>
                <p className="text-[10px] text-teal-200">User Rating</p>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-lg font-black text-emerald-400">100%</p>
                <p className="text-[10px] text-teal-200">THY Verified</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {/* Add Work Modal */}
      {isAddWorkOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Add Finished Garment Work</h3>
            <form onSubmit={handleAddWork} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Title</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Bridal Blouse"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Garment Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7]"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newIsFeatured}
                  onChange={e => setNewIsFeatured(e.target.checked)}
                  className="rounded text-[#00c9b7]"
                />
                <label htmlFor="featured" className="text-xs font-medium text-slate-700">Set as Featured Work</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4]"
                >
                  Save Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Services Modal */}
      {isEditServicesOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Edit Services & Price Ranges</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {services.map(service => (
                <div key={service.id} className="p-3 border border-slate-100 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 w-28 shrink-0">{service.name}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      value={service.minPrice}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setServices(services.map(s => s.id === service.id ? { ...s, minPrice: val } : s));
                      }}
                      className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white text-center"
                    />
                    <span className="text-xs text-slate-400 font-bold">-</span>
                    <input
                      type="number"
                      value={service.maxPrice}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setServices(services.map(s => s.id === service.id ? { ...s, maxPrice: val } : s));
                      }}
                      className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white text-center"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsEditServicesOpen(false)}
                className="w-full py-2.5 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Estimate Modal (Interactive Preview) */}
      {isEstimateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Request Estimate from {tailorInfo.name}</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Test Estimate Request Sent!'); setIsEstimateModalOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Garment Service</label>
                <select
                  value={selectedEstimateService}
                  onChange={e => setSelectedEstimateService(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7]"
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