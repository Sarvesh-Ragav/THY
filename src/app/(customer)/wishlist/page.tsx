'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  MapPin, 
  Star, 
  Scissors, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

interface WishlistItem {
  id: string;
  title: string;
  category: string;
  boutiqueName: string;
  rating: number;
  location: string;
  price: number;
  fabric: string;
  imageUrl: string;
  deliveryEstimate: string;
}

const initialWishlist: WishlistItem[] = [
  {
    id: 'THY-W01',
    title: 'Silk Embroidered Anarkali Kurti',
    category: 'Ethnic',
    boutiqueName: 'Vogue Custom Design Studio',
    rating: 4.8,
    location: 'Nungambakkam, Chennai',
    price: 4200,
    fabric: 'Pure Kanchipuram Silk with Zari',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '5-7 Days'
  },
  {
    id: 'THY-W02',
    title: 'Custom 3-Piece Tuxedo Blazer',
    category: 'Formal',
    boutiqueName: 'Royal Stitch Atelier',
    rating: 4.9,
    location: 'T. Nagar, Chennai',
    price: 8500,
    fabric: 'Italian Navy Wool Blend',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '8-10 Days'
  },
  {
    id: 'THY-W03',
    title: 'Handcrafted Bridal Lehengas Set',
    category: 'Bridal',
    boutiqueName: 'Heritage Threads Couture',
    rating: 4.9,
    location: 'Mylapore, Chennai',
    price: 24500,
    fabric: 'Raw Silk with Hand-Done Zardozi',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '12-15 Days'
  },
  {
    id: 'THY-W04',
    title: 'Designer Linen Casual Nehru Jacket',
    category: 'Ethnic',
    boutiqueName: 'Thread & Tailor Co.',
    rating: 4.7,
    location: 'Adyar, Chennai',
    price: 2800,
    fabric: 'Breathable Pure Linen',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    deliveryEstimate: '4-5 Days'
  }
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Ethnic', 'Formal', 'Bridal'];

  const handleRemove = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = wishlist.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.boutiqueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 font-sans pb-16">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#26988a] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              thy
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">THY Custom Tailoring</h1>
              <p className="text-xs text-gray-500">Crafting connections, one stitch at a time.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-[#26988a]/10 text-[#26988a] px-3 py-1.5 rounded-full text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-[#26988a] mr-1.5" />
              {wishlist.length} Saved Items
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Title & Description */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
              My Wishlist <Sparkles className="w-5 h-5 ml-2 text-[#26988a]" />
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Your saved custom styles & preferred fabrics ready for tailoring.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search saved styles, fabrics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#26988a] transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shadow-2xs ${
                activeCategory === cat
                  ? 'bg-[#26988a] text-white font-semibold'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat} {cat === 'All' ? `(${wishlist.length})` : `(${wishlist.filter(i => i.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Wishlist Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image & Overlay Actions */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                    
                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      {item.category}
                    </span>

                    {/* Heart Remove Button */}
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 hover:bg-white shadow-sm transition-transform active:scale-95 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>

                    {/* Price & Delivery badge on image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <span className="text-xs text-gray-200 block">Estimated Delivery</span>
                        <span className="text-xs font-semibold">{item.deliveryEstimate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-200 block">Custom Price</span>
                        <span className="text-base font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#26988a] transition-colors">
                      {item.title}
                    </h3>

                    {/* Fabric details */}
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mb-3 border border-gray-100 flex items-center">
                      <Scissors className="w-3.5 h-3.5 text-[#26988a] mr-1.5 shrink-0" />
                      <span className="truncate">Fabric: {item.fabric}</span>
                    </p>

                    {/* Boutique & Location */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <div>
                        <span className="font-semibold text-gray-700 block">{item.boutiqueName}</span>
                        <span className="flex items-center text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[180px]">{item.location}</span>
                        </span>
                      </div>
                      <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold text-xs shrink-0 border border-amber-200/60">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-4 pt-0">
                  <button className="w-full bg-[#26988a] hover:bg-[#22877b] text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors shadow-xs active:scale-[0.99] cursor-pointer">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Customize & Order Now
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-xs mt-4">
            <div className="w-16 h-16 bg-[#26988a]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#26988a]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Tap the heart icon on any custom design or fabric while browsing to save them here for future tailoring.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="bg-[#26988a] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs hover:bg-[#22877b] transition-colors cursor-pointer"
            >
              Explore All Styles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}