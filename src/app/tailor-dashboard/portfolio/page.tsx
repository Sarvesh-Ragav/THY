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

export default function TailorPortfolioManagementPage() {
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [isEditServicesOpen, setIsEditServicesOpen] = useState(false);

  // Form State: Add Work
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Blouse');
  const [newImage, setNewImage] = useState('');
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  // Form State: Add New Service inside Modal
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceMin, setNewServiceMin] = useState<number | ''>('');
  const [newServiceMax, setNewServiceMax] = useState<number | ''>('');

  const categories = ['All', 'Blouse', 'Kurti', 'Anarkali', 'Lehenga', 'Dress', 'Bridal'];

  // Portfolio Items State
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

  // Services & Pricing State
  const [services, setServices] = useState<ServicePrice[]>([
    { id: '1', name: 'Saree Blouse', minPrice: 800, maxPrice: 2500, enabled: true },
    { id: '2', name: 'Salwar / Kurti', minPrice: 600, maxPrice: 1800, enabled: true },
    { id: '3', name: 'Anarkali', minPrice: 1500, maxPrice: 4500, enabled: true },
    { id: '4', name: 'Lehenga', minPrice: 3000, maxPrice: 12000, enabled: true },
    { id: '5', name: 'Bridal Wear', minPrice: 5000, maxPrice: 25000, enabled: true },
    { id: '6', name: 'Alterations', minPrice: 200, maxPrice: 800, enabled: true },
  ]);

  // File Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Add New Service offering handler
  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || newServiceMin === '' || newServiceMax === '') return;

    const newService: ServicePrice = {
      id: Date.now().toString(),
      name: newServiceName,
      minPrice: Number(newServiceMin),
      maxPrice: Number(newServiceMax),
      enabled: true,
    };

    setServices([...services, newService]);
    setNewServiceName('');
    setNewServiceMin('');
    setNewServiceMax('');
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const toggleFeature = (id: string) => {
    setPortfolioItems(items =>
      items.map(item => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
    );
  };

  const deleteItem = (id: string) => {
    setPortfolioItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 text-thy-ink">
      {/* Header with Route Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-thy-canvas/90 p-5 rounded-2xl border border-thy-burgundy/15/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Portfolio & Gallery Management
          </h1>
          <p className="text-xs text-thy-muted font-medium mt-0.5">
            Manage your finished work, pricing ranges, and active service offerings.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <span className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl bg-thy-canvas/90 text-[#5C1A24] shadow-xs text-center">
            ⚙️ Tailor Management
          </span>
          <Link
            href="/tailor-dashboard/profile-preview"
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-thy-ink transition-all text-center"
          >
            👁️ Public Profile Preview
          </Link>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setIsAddWorkOpen(true)}
          className="p-5 bg-gradient-to-r from-[#00c9b7] to-[#00b5a4] text-white rounded-2xl font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="text-left">
            <p className="text-base font-extrabold">+ Add New Work</p>
            <p className="text-xs text-thy-cream font-normal">Upload garment photos & titles</p>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          onClick={() => setIsEditServicesOpen(true)}
          className="p-5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-800 shadow-xs hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="text-left">
            <p className="text-base font-extrabold text-slate-900">Edit Services Offered</p>
            <p className="text-xs text-slate-500 font-normal">Manage tailoring services & set min/max rates</p>
          </div>
          <span className="text-slate-400">✂️</span>
        </button>
      </div>

      {/* Manage Work Grid */}
      <div className="bg-thy-canvas/90 p-6 rounded-2xl border border-thy-burgundy/15/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-thy-ink">Your Work Gallery ({portfolioItems.length})</h2>
          <p className="text-xs text-slate-400 hidden sm:block">Featured items display prominently on your public profile</p>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-thy-burgundy/15 rounded-2xl space-y-3">
            <div className="w-16 h-16 bg-thy-mist text-[#5C1A24] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🧵
            </div>
            <h3 className="text-base font-bold text-slate-800">Empty Portfolio</h3>
            <p className="text-xs text-thy-muted max-w-sm mx-auto">
              Show customers what you can create. Add your services, indicative price ranges, and best work.
            </p>
            <button
              onClick={() => setIsAddWorkOpen(true)}
              className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] transition-colors cursor-pointer"
            >
              + Add Your First Work
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolioItems.map(item => (
              <div key={item.id} className="border border-thy-burgundy/15 rounded-2xl overflow-hidden group bg-slate-50/50 hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {item.isFeatured && (
                    <span className="absolute top-2 left-2 bg-[#5C1A24] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      ★ Featured
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <p className="text-xs font-bold text-thy-ink truncate">{item.title}</p>
                    <p className="text-[10px] text-thy-muted font-medium">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-thy-burgundy/15/60 pt-2 text-[11px]">
                    <button
                      onClick={() => toggleFeature(item.id)}
                      className={`font-bold hover:underline cursor-pointer ${item.isFeatured ? 'text-amber-600' : 'text-slate-600'}`}
                    >
                      {item.isFeatured ? 'Unfeature' : 'Feature Work'}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
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

      {/* Add Work Modal */}
      {isAddWorkOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-thy-canvas/90 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-thy-ink">Add Finished Garment Work</h3>
            <form onSubmit={handleAddWork} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Title</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Bridal Blouse"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-thy-burgundy/15 rounded-xl text-xs focus:outline-none focus:border-[#5C1A24]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Garment Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-thy-burgundy/15 rounded-xl text-xs focus:outline-none focus:border-[#5C1A24]"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Upload Garment Photo</label>
                {newImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 w-full group">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImage('')}
                      className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#00c9b7] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/20">
                    <svg className="w-8 h-8 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-700">Click to upload photo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newIsFeatured}
                  onChange={e => setNewIsFeatured(e.target.checked)}
                  className="rounded text-[#5C1A24]"
                />
                <label htmlFor="featured" className="text-xs font-medium text-slate-700 cursor-pointer">Set as Featured Work</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newImage}
                  className="flex-1 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] disabled:opacity-50 cursor-pointer"
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
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Services & Price Ranges</h3>
              <button
                type="button"
                onClick={() => setIsEditServicesOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Add New Service Input Form */}
            <form onSubmit={handleAddNewService} className="bg-teal-50/50 border border-teal-100 p-3 rounded-2xl space-y-2">
              <p className="text-xs font-extrabold text-[#083e38] flex items-center gap-1">
                <span>+</span> Add New Service Offering
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Service Name (e.g. Blazer)"
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#00c9b7]"
                  required
                />
                <input
                  type="number"
                  placeholder="Min Price (₹)"
                  value={newServiceMin}
                  onChange={e => setNewServiceMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#00c9b7] text-center"
                  required
                />
                <input
                  type="number"
                  placeholder="Max Price (₹)"
                  value={newServiceMax}
                  onChange={e => setNewServiceMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#00c9b7] text-center"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] transition-colors cursor-pointer"
              >
                + Add Service
              </button>
            </form>

            {/* Services List with Dedicated Min/Max Header Columns */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <div className="flex items-center gap-3 text-[10px] font-extrabold text-slate-400 px-3 uppercase tracking-wider">
                <span className="w-32 shrink-0">Service Name</span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-full text-center">Min Price (₹)</span>
                  <span className="w-4 text-center"></span>
                  <span className="w-full text-center">Max Price (₹)</span>
                </div>
                <span className="w-6 shrink-0"></span>
              </div>

              {services.map(service => (
                <div key={service.id} className="p-3 border border-slate-100 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 w-32 shrink-0 truncate">{service.name}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      value={service.minPrice}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setServices(services.map(s => (s.id === service.id ? { ...s, minPrice: val } : s)));
                      }}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-center font-semibold focus:outline-none focus:border-[#00c9b7]"
                    />
                    <span className="text-xs text-slate-400 font-bold">-</span>
                    <input
                      type="number"
                      value={service.maxPrice}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setServices(services.map(s => (s.id === service.id ? { ...s, maxPrice: val } : s)));
                      }}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-center font-semibold focus:outline-none focus:border-[#00c9b7]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer w-6 shrink-0 text-center"
                    title="Remove Service"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsEditServicesOpen(false)}
                className="w-full py-2.5 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}