'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TailorPage } from '@/components/tailor/TailorPage';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { saveTailorPortfolio } from '@/lib/directory-api';

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
  const { session, updateSession, accessToken } = useTailorSession();
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
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    setPortfolioItems((current) => {
      if (current.length) return current;
      return (session.tailorPortfolio ?? []).map((item, index) => ({
        ...item,
        isFeatured: Boolean(item.isFeatured) || index < 2,
      }));
    });
  }, [session.tailorPortfolio]);

  useEffect(() => {
    const items = session.tailorPortfolio ?? [];
    if (!accessToken || items.length === 0) return;
    void saveTailorPortfolio(items, accessToken).catch((error) => {
      console.warn('Could not publish portfolio to the directory:', error);
    });
  }, [accessToken, session.tailorPortfolio]);

  const persistPortfolio = (items: PortfolioItem[]) => {
    setPortfolioItems(items);
    const payload = items.map(({ id, title, image, category, isFeatured }) => ({
      id,
      title,
      image,
      category,
      isFeatured,
    }));
    updateSession({ tailorPortfolio: payload });
    if (accessToken) {
      void saveTailorPortfolio(payload, accessToken).catch((error) => {
        console.warn('Could not save portfolio to the directory:', error);
      });
    }
  };

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

    persistPortfolio([newItem, ...portfolioItems]);
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
    persistPortfolio(
      portfolioItems.map((item) => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
    );
  };

  const deleteItem = (id: string) => {
    persistPortfolio(portfolioItems.filter((item) => item.id !== id));
  };

  return (
    <TailorPage
      title="Portfolio"
      description="Manage finished work, pricing ranges, and active service offerings."
      actions={
        <div className="flex items-center gap-2 bg-thy-mist p-1.5 w-full sm:w-auto">
          <span className="flex-1 sm:flex-none px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] bg-thy-burgundy text-white text-center">
            Management
          </span>
          <Link
            href="/tailor-dashboard/profile-preview"
            className="flex-1 sm:flex-none px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-thy-muted hover:text-thy-ink text-center"
          >
            Public preview
          </Link>
        </div>
      }
    >
      <div className="space-y-6 text-thy-ink">

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setIsAddWorkOpen(true)}
          className="p-5 bg-gradient-to-r from-thy-burgundy to-thy-brand-hover text-white rounded-2xl font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="text-left">
            <p className="text-base font-extrabold">+ Add New Work</p>
            <p className="text-xs text-thy-cream font-normal">Upload garment photos & titles</p>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          onClick={() => setIsEditServicesOpen(true)}
          className="p-5 bg-thy-surface border border-thy-burgundy/15 rounded-2xl font-bold text-sm text-thy-ink shadow-xs hover:bg-thy-mist transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="text-left">
            <p className="text-base font-extrabold text-thy-ink">Edit Services Offered</p>
            <p className="text-xs text-thy-muted font-normal">Manage tailoring services & set min/max rates</p>
          </div>
          <span className="text-thy-subtle">✂️</span>
        </button>
      </div>

      {/* Manage Work Grid */}
      <div className="thy-card p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-4">
          <h2 className="text-base font-bold text-thy-ink">Your Work Gallery ({portfolioItems.length})</h2>
          <p className="text-xs text-thy-subtle hidden sm:block">Featured items display prominently on your public profile</p>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-thy-burgundy/15 rounded-2xl space-y-3">
            <div className="w-16 h-16 bg-thy-mist text-thy-burgundy rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🧵
            </div>
            <h3 className="text-base font-bold text-thy-ink">Empty Portfolio</h3>
            <p className="text-xs text-thy-muted max-w-sm mx-auto">
              Show customers what you can create. Add your services, indicative price ranges, and best work.
            </p>
            <button
              onClick={() => setIsAddWorkOpen(true)}
              className="px-4 py-2 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-hover transition-colors cursor-pointer"
            >
              + Add Your First Work
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolioItems.map(item => (
              <div key={item.id} className="border border-thy-burgundy/15 rounded-2xl overflow-hidden group bg-thy-mist/50 hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {item.isFeatured && (
                    <span className="absolute top-2 left-2 bg-thy-burgundy text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      ★ Featured
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <p className="text-xs font-bold text-thy-ink truncate">{item.title}</p>
                    <p className="text-[10px] text-thy-muted font-medium">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-thy-burgundy/10 pt-2 text-[11px]">
                    <button
                      onClick={() => toggleFeature(item.id)}
                      className={`font-bold hover:underline cursor-pointer ${item.isFeatured ? 'text-amber-600' : 'text-thy-muted'}`}
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
        <div className="fixed inset-0 bg-thy-deep/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="thy-card p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-thy-ink">Add Finished Garment Work</h3>
            <form onSubmit={handleAddWork} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-thy-ink block mb-1">Work Title</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Bridal Blouse"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-thy-burgundy/15 rounded-xl text-xs focus:outline-none focus:border-thy-burgundy"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-thy-ink block mb-1">Garment Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-thy-burgundy/15 rounded-xl text-xs focus:outline-none focus:border-thy-burgundy"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-thy-ink block mb-1">Upload Garment Photo</label>
                {newImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-thy-burgundy/15 h-36 w-full group">
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
                  <label className="border-2 border-dashed border-thy-burgundy/15 hover:border-thy-burgundy rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-thy-mist/50 hover:bg-thy-mist/40">
                    <svg className="w-8 h-8 text-thy-subtle mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold text-thy-ink">Click to upload photo</span>
                    <span className="text-[10px] text-thy-subtle mt-0.5">PNG, JPG, or WEBP (Max 5MB)</span>
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
                  className="rounded text-thy-burgundy"
                />
                <label htmlFor="featured" className="text-xs font-medium text-thy-ink cursor-pointer">Set as Featured Work</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkOpen(false)}
                  className="flex-1 py-2 bg-thy-mist text-thy-ink rounded-xl text-xs font-bold hover:bg-thy-mist cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newImage}
                  className="flex-1 py-2 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-hover disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 bg-thy-deep/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="thy-card p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
              <h3 className="text-base font-bold text-thy-ink">Edit Services & Price Ranges</h3>
              <button
                type="button"
                onClick={() => setIsEditServicesOpen(false)}
                className="text-thy-subtle hover:text-thy-muted text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Add New Service Input Form */}
            <form onSubmit={handleAddNewService} className="bg-thy-mist/70 border border-thy-burgundy/15 p-3 rounded-2xl space-y-2">
              <p className="text-xs font-extrabold text-thy-ink flex items-center gap-1">
                <span>+</span> Add New Service Offering
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Service Name (e.g. Blazer)"
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  className="px-2.5 py-1.5 border border-thy-burgundy/15 rounded-xl text-xs bg-thy-surface focus:outline-none focus:border-thy-burgundy"
                  required
                />
                <input
                  type="number"
                  placeholder="Min Price (₹)"
                  value={newServiceMin}
                  onChange={e => setNewServiceMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-thy-burgundy/15 rounded-xl text-xs bg-thy-surface focus:outline-none focus:border-thy-burgundy text-center"
                  required
                />
                <input
                  type="number"
                  placeholder="Max Price (₹)"
                  value={newServiceMax}
                  onChange={e => setNewServiceMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-thy-burgundy/15 rounded-xl text-xs bg-thy-surface focus:outline-none focus:border-thy-burgundy text-center"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-hover transition-colors cursor-pointer"
              >
                + Add Service
              </button>
            </form>

            {/* Services List with Dedicated Min/Max Header Columns */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <div className="flex items-center gap-3 text-[10px] font-extrabold text-thy-subtle px-3 uppercase tracking-wider">
                <span className="w-32 shrink-0">Service Name</span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-full text-center">Min Price (₹)</span>
                  <span className="w-4 text-center"></span>
                  <span className="w-full text-center">Max Price (₹)</span>
                </div>
                <span className="w-6 shrink-0"></span>
              </div>

              {services.map(service => (
                <div key={service.id} className="p-3 border border-thy-burgundy/10 bg-thy-mist rounded-2xl flex items-center gap-3">
                  <span className="text-xs font-bold text-thy-ink w-32 shrink-0 truncate">{service.name}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      value={service.minPrice}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setServices(services.map(s => (s.id === service.id ? { ...s, minPrice: val } : s)));
                      }}
                      className="w-full px-2 py-1.5 border border-thy-burgundy/15 rounded-lg text-xs bg-thy-surface text-center font-semibold focus:outline-none focus:border-thy-burgundy"
                    />
                    <span className="text-xs text-thy-subtle font-bold">-</span>
                    <input
                      type="number"
                      value={service.maxPrice}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setServices(services.map(s => (s.id === service.id ? { ...s, maxPrice: val } : s)));
                      }}
                      className="w-full px-2 py-1.5 border border-thy-burgundy/15 rounded-lg text-xs bg-thy-surface text-center font-semibold focus:outline-none focus:border-thy-burgundy"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-thy-subtle hover:text-rose-600 transition-colors p-1 cursor-pointer w-6 shrink-0 text-center"
                    title="Remove Service"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-thy-burgundy/10">
              <button
                onClick={() => setIsEditServicesOpen(false)}
                className="w-full py-2.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-hover cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </TailorPage>
  );
}