'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  priceRange: string;
  likes: number;
}

const initialPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Custom Velvet Groom Sherwani',
    category: 'Bridal & Groom',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop',
    priceRange: '₹12,000 - ₹18,000',
    likes: 24,
  },
  {
    id: 'port-2',
    title: 'Hand-Embroidered Silk Silk Lehenga',
    category: 'Ethnicwear',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop',
    priceRange: '₹15,000 - ₹22,000',
    likes: 38,
  },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(initialPortfolio);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Ethnicwear');
  const [newPrice, setNewPrice] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop',
      priceRange: newPrice,
      likes: 0,
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewImageUrl('');
    showToast('New design added to portfolio!');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Portfolio item removed.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio & Showcase</h1>
          <p className="text-xs text-gray-600">Manage completed garment designs shown on your public tailor profile.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4] transition-colors"
          >
            + Add New Design
          </button>
          <Link href="/tailor-dashboard" className="text-sm font-semibold text-[#00c9b7] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-teal-50 border border-[#00c9b7] text-teal-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-teal-600 font-bold">✕</button>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                {item.category}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">{item.priceRange}</span>
                <span className="text-gray-400 font-medium">❤️ {item.likes} likes</span>
              </div>
              <div className="pt-2 border-t flex justify-end">
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-gray-900 text-sm">Add Design to Portfolio</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Garment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Designer Anarkali Suit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                >
                  <option value="Ethnicwear">Ethnicwear</option>
                  <option value="Bridal & Groom">Bridal & Groom</option>
                  <option value="Western Formal">Western Formal</option>
                  <option value="Casual Alterations">Casual Alterations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Price Range (₹)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹5,000 - ₹8,000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl font-semibold hover:bg-[#00b5a4]"
                >
                  Publish to Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}