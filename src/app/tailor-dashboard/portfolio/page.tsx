'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock catalog images matching the HLD design
const initialPortfolioItems = [
  {
    id: 1,
    title: 'Bridal Silk Lehenga',
    category: 'Bridalwear',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Custom Velvet Sherwani',
    category: 'Ethnic Men',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Hand-embroidered Suit',
    category: 'Formalwear',
    imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop',
  },
];

export default function PortfolioPage() {
  const [items, setItems] = useState(initialPortfolioItems);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Bridalwear');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop',
    };
    setItems([newItem, ...items]);
    setNewTitle('');
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-thy-ink">Portfolio & Design Showcase</h1>
          <p className="text-sm text-thy-muted">Upload and showcase your best stitching work to potential customers.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-thy-brand hover:underline self-start"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-thy-surface p-4 rounded-2xl border border-thy-ink/10 shadow-sm">
        <span className="text-sm font-semibold text-thy-ink">Total Showcase Items: {items.length}</span>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-3 sm:py-2 bg-thy-brand text-white rounded-xl text-xs font-semibold hover:bg-thy-brand-hover transition-colors min-h-11 w-full sm:w-auto"
        >
          + Add New Work
        </button>
      </div>

      {/* Portfolio Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-thy-surface rounded-2xl overflow-hidden border border-thy-ink/10 shadow-sm group">
            <div className="h-48 bg-thy-mist overflow-hidden relative">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                {item.category}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-thy-ink text-sm">{item.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Work Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-thy-surface rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl space-y-4 max-h-[90dvh] overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-thy-ink text-lg">Add New Portfolio Image</h2>
              <button onClick={() => setShowModal(false)} className="text-thy-subtle font-bold">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-thy-ink mb-1">Garment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Velvet Blouse"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-thy-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-thy-ink mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-thy-brand"
                >
                  <option value="Bridalwear">Bridalwear</option>
                  <option value="Ethnic Men">Ethnic Men</option>
                  <option value="Formalwear">Formalwear</option>
                  <option value="Casual & Alterations">Casual & Alterations</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-thy-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-thy-brand text-white rounded-xl text-xs font-semibold hover:bg-thy-brand-hover"
                >
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}