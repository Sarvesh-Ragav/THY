import React, { useState } from 'react';
import { 
  Ruler, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Star, 
  MapPin, 
  Calendar, 
  Edit3, 
  Share2, 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Download, 
  Sliders, 
  User, 
  Scissors, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  Tag,
  X,
  FileText,
  Bookmark
} from 'lucide-react';

const CUSTOMER_DATA = {
  name: "Sarah Jenkins",
  handle: "@sarah_j",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200",
  location: "Chennai, Tamil Nadu",
  joinDate: "Member since Jan 2024",
  stats: {
    activeOrders: 2,
    completedDesigns: 18,
    savedTailors: 12,
    stitchPoints: 450
  },
  measurementProfiles: [
    {
      id: "self",
      label: "My Measurements (Default)",
      updatedAt: "Updated 2 weeks ago",
      data: {
        chestBust: "36 in",
        waist: "28 in",
        hips: "38 in",
        shoulderWidth: "15 in",
        sleeveLength: "22 in",
        fullLength: "54 in",
        neck: "14 in",
        inseam: "30 in"
      }
    },
    {
      id: "partner",
      label: "Partner (Rahul - Formal Fits)",
      updatedAt: "Updated 1 month ago",
      data: {
        chestBust: "40 in",
        waist: "32 in",
        hips: "40 in",
        shoulderWidth: "18 in",
        sleeveLength: "25 in",
        fullLength: "42 in",
        neck: "16 in",
        inseam: "32 in"
      }
    },
    {
      id: "kid",
      label: "Daughter (Ananya - Ethnic)",
      updatedAt: "Updated 3 months ago",
      data: {
        chestBust: "26 in",
        waist: "24 in",
        hips: "28 in",
        shoulderWidth: "12 in",
        sleeveLength: "16 in",
        fullLength: "36 in",
        neck: "11 in",
        inseam: "22 in"
      }
    }
  ],
  orders: [
    {
      id: "THY-8921",
      garmentTitle: "Custom Velvet Bridal Lehenga",
      category: "Ethnic Wear",
      tailorName: "Aarav Sharma",
      tailorHandle: "@aarav_master_craft",
      tailorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      status: "In Stitching",
      statusStep: 3, // 1: Fabric Received, 2: Pattern Cutting, 3: In Stitching, 4: Quality Check, 5: Delivered
      estimatedDelivery: "18 Oct 2026",
      price: "₹6,800",
      fabricProvided: "Customer Shipped (Pure Velvet)",
      measurementsUsed: "My Measurements (Default)",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "THY-8740",
      garmentTitle: "Bespoke Italian Wool Tuxedo",
      category: "Formal Wear",
      tailorName: "Vikramaditya Tailors",
      tailorHandle: "@vikram_suits",
      tailorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      status: "Fitting Stage",
      statusStep: 4,
      estimatedDelivery: "22 Oct 2026",
      price: "₹8,500",
      fabricProvided: "Tailor Sourced (Italian Wool Blend)",
      measurementsUsed: "Partner (Rahul - Formal Fits)",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "THY-7612",
      garmentTitle: "Chanderi Silk Anarkali Gown",
      category: "Ethnic Wear",
      tailorName: "Priya Couture & Embroidery",
      tailorHandle: "@priya_embroidery",
      tailorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      status: "Delivered",
      statusStep: 5,
      estimatedDelivery: "02 Sep 2026",
      price: "₹4,200",
      fabricProvided: "Customer Shipped",
      measurementsUsed: "My Measurements (Default)",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600"
    }
  ],
  savedTailors: [
    {
      id: 1,
      name: "Aarav Sharma",
      handle: "@aarav_master_craft",
      specialty: "Bridal Wear & Sherwanis",
      rating: 4.9,
      reviews: 128,
      location: "Chennai, TN",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      cover: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Meenakshi Stitching Studio",
      handle: "@meenakshi_designs",
      specialty: "Blouses & Silk Saree Alterations",
      rating: 4.8,
      reviews: 94,
      location: "Madurai, TN",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      cover: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      name: "Royal Fit Men's Atelier",
      handle: "@royalfit_men",
      specialty: "Suits, Blazers & Kurtas",
      rating: 5.0,
      reviews: 210,
      location: "Coimbatore, TN",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      cover: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=400"
    }
  ],
  wardrobeWishlist: [
    {
      id: 101,
      title: "Pastel Pink Zardosi Blouse Idea",
      category: "Blouse Design",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
      notes: "Deep U-neck line with gold zari embroidery on sleeves. Need to attach tassels.",
      fabricType: "Silk Organza"
    },
    {
      id: 102,
      title: "Double Breasted Summer Linen Blazer",
      category: "Men Formal",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
      notes: "Light beige color linen material. Unlined back for breathable fit.",
      fabricType: "Pure Linen"
    },
    {
      id: 103,
      title: "Layered Organza Festive Kurti",
      category: "Casual Ethnic",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
      notes: "A-line fit with subtle embroidery near cuffs.",
      fabricType: "Georgette"
    }
  ],
  reviewsGiven: [
    {
      id: 1,
      tailorName: "Priya Couture & Embroidery",
      garment: "Chanderi Silk Anarkali Gown",
      rating: 5,
      date: "05 Sep 2026",
      comment: "The precision on the chest fit and sleeve length was spot on! Priya handled my saree border customization with great care.",
      photo: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 2,
      tailorName: "Aarav Sharma",
      garment: "Puff Sleeve Silk Blouse",
      rating: 5,
      date: "14 Jul 2026",
      comment: "Aarav sir delivered right before my family event. High quality stitching work with smooth interlock finish inside.",
      photo: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300"
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedProfileId, setSelectedProfileId] = useState('self');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showAddWishlistModal, setShowAddWishlistModal] = useState(false);

  // Get active measurement object
  const currentMeasurementObj = CUSTOMER_DATA.measurementProfiles.find(p => p.id === selectedProfileId) || CUSTOMER_DATA.measurementProfiles[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-12">
      
      {}
      <header className="bg-[#1FA694] text-white py-3 px-4 shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-[#1FA694] p-1.5 rounded-lg font-bold text-lg leading-none tracking-wider">THY</div>
            <span className="font-semibold text-lg tracking-wide hidden sm:inline">Tailor Community Hub</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="bg-[#178576] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-teal-300/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified Customer
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-0 sm:px-4 py-0 sm:py-6">
        
        {}
        <div className="bg-white sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
          
          {/* Cover Image Banner */}
          <div className="h-40 sm:h-56 relative bg-slate-800">
            <img 
              src={CUSTOMER_DATA.coverImage} 
              alt="Customer Wardrobe Cover" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            
            {/* Loyalty Stitch Badge */}
            <div className="absolute top-4 right-4 bg-[#E6F5F3] text-[#1FA694] border border-[#1FA694]/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-[#1FA694]" />
              {CUSTOMER_DATA.stats.stitchPoints} Stitch Loyalty Points
            </div>
          </div>

          {/* Customer Profile Details Header */}
          <div className="relative px-4 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-5 gap-4">
              
              {/* Profile Avatar & Primary Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={CUSTOMER_DATA.avatar} 
                    alt={CUSTOMER_DATA.name} 
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#1FA694] text-white p-1 rounded-full border-2 border-white shadow" title="Verified THY Member">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                <div className="pt-2 sm:pt-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{CUSTOMER_DATA.name}</h1>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F5F3] text-[#1FA694] border border-[#1FA694]/20">
                      THY Member
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{CUSTOMER_DATA.handle}</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1FA694]" />
                      {CUSTOMER_DATA.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1FA694]" />
                      {CUSTOMER_DATA.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-2.5 mt-2 sm:mt-0">
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#1FA694] hover:bg-[#178576] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>

                <button 
                  onClick={() => setActiveTab('measurements')}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#E6F5F3] hover:bg-[#d5ede9] text-[#1FA694] border border-[#1FA694]/30 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Ruler className="w-4 h-4" /> Fit Card
                </button>

                <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6 p-3 sm:p-4 rounded-xl bg-[#E6F5F3]/60 border border-[#1FA694]/20 text-center">
              <div className="p-1">
                <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">{CUSTOMER_DATA.stats.activeOrders}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">Active Orders</div>
              </div>
              <div className="p-1 border-l border-slate-200 sm:border-x sm:border-[#1FA694]/20">
                <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">{CUSTOMER_DATA.stats.completedDesigns}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">Completed Designs</div>
              </div>
              <div className="p-1 border-t sm:border-t-0 border-slate-200">
                <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">{CUSTOMER_DATA.stats.savedTailors}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">Saved Tailors</div>
              </div>
              <div className="p-1 border-t border-l sm:border-t-0 border-slate-200">
                <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">{CUSTOMER_DATA.stats.stitchPoints}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">Stitch Points</div>
              </div>
            </div>

          </div>
        </div>

        {}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#1FA694]" />
                <h2 className="text-lg font-bold text-slate-900">Digital Measurement Fit Card</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Share exact measurements instantly with remote tailors for custom orders.</p>
            </div>

            {/* Profile Selector Dropdown / Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 md:pt-0">
              {CUSTOMER_DATA.measurementProfiles.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setSelectedProfileId(prof.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedProfileId === prof.id
                      ? "bg-[#1FA694] text-white border-[#1FA694] shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {prof.id === 'self' ? '👤 Self' : prof.id === 'partner' ? '👔 Partner' : '👧 Kid'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Measurement Metrics Display */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{currentMeasurementObj.label}</span>
              <span className="italic">{currentMeasurementObj.updatedAt}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(currentMeasurementObj.data).map(([key, value]) => {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="p-3 rounded-xl bg-[#E6F5F3]/40 border border-[#1FA694]/15 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium capitalize">{formattedKey}</span>
                    <span className="text-base font-bold text-slate-900 mt-1">{value}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Standardised fit values verified by THY Master Tailors
              </span>
              <div className="flex items-center gap-3">
                <button className="text-[#1FA694] hover:underline font-semibold flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download Size PDF
                </button>
                <button className="text-[#1FA694] hover:underline font-semibold flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Values
                </button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white sm:rounded-xl shadow-sm border border-slate-200/80 mb-6 sticky top-[57px] z-20">
          <nav className="flex divide-x divide-slate-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'orders', label: `My Orders (${CUSTOMER_DATA.orders.length})`, icon: ShoppingBag },
              { id: 'saved_tailors', label: `Saved Tailors (${CUSTOMER_DATA.savedTailors.length})`, icon: Scissors },
              { id: 'wishlist', label: `Design Wardrobe (${CUSTOMER_DATA.wardrobeWishlist.length})`, icon: Bookmark },
              { id: 'reviews', label: `My Reviews (${CUSTOMER_DATA.reviewsGiven.length})`, icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] sm:min-w-0 py-3.5 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                    isActive 
                      ? 'border-[#1FA694] text-[#1FA694] bg-[#E6F5F3]/30' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1FA694]' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {}
        <div className="px-3 sm:px-0">
          
          {/* TAB 1: ACTIVE & PAST ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {CUSTOMER_DATA.orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 sm:p-5 hover:border-[#1FA694]/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold bg-[#E6F5F3] text-[#1FA694] px-2.5 py-1 rounded-md border border-[#1FA694]/20">
                        {order.id}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{order.garmentTitle}</h3>
                        <span className="text-xs text-slate-400">{order.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        ● {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    {/* Image & Fabric info */}
                    <div className="flex items-center gap-3">
                      <img src={order.image} alt={order.garmentTitle} className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                      <div className="text-xs space-y-1">
                        <p className="text-slate-500">Fabric Status:</p>
                        <p className="font-semibold text-slate-700">{order.fabricProvided}</p>
                        <p className="text-[#1FA694] font-medium">{order.price}</p>
                      </div>
                    </div>

                    {/* Assigned Remote Tailor */}
                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <img src={order.tailorAvatar} alt={order.tailorName} className="w-10 h-10 rounded-full object-cover" />
                      <div className="text-xs">
                        <span className="text-slate-400 block">Assigned Tailor:</span>
                        <span className="font-bold text-slate-800">{order.tailorName}</span>
                        <span className="text-slate-500 block">{order.tailorHandle}</span>
                      </div>
                    </div>

                    {/* Timeline & Delivery */}
                    <div className="flex flex-col justify-center text-xs space-y-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Est. Delivery Date:
                      </span>
                      <span className="font-bold text-slate-800">{order.estimatedDelivery}</span>
                      <span className="text-[#1FA694]">Profile: {order.measurementsUsed}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  {order.status !== 'Delivered' && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 my-3">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                        <span>Order Progress Tracker</span>
                        <span className="text-[#1FA694]">Step {order.statusStep} of 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#1FA694] h-full transition-all duration-500 rounded-full" 
                          style={{ width: `${(order.statusStep / 5) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Fabric Recd</span>
                        <span>Patterning</span>
                        <span>Stitching</span>
                        <span>Fitting</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedOrderModal(order)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Order Details
                    </button>
                    <button className="px-3.5 py-1.5 rounded-lg bg-[#1FA694] hover:bg-[#178576] text-white text-xs font-semibold flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Chat with Tailor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SAVED REMOTE TAILORS */}
          {activeTab === 'saved_tailors' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CUSTOMER_DATA.savedTailors.map((tailor) => (
                <div key={tailor.id} className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="h-24 relative bg-slate-800">
                      <img src={tailor.cover} alt={tailor.name} className="w-full h-full object-cover opacity-70" />
                      <button className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full text-rose-500">
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>

                    <div className="p-4 pt-0 relative">
                      <img 
                        src={tailor.avatar} 
                        alt={tailor.name} 
                        className="w-14 h-14 rounded-full border-2 border-white object-cover -mt-7 shadow bg-white" 
                      />
                      <h3 className="font-bold text-slate-900 text-base mt-2">{tailor.name}</h3>
                      <p className="text-xs text-slate-500">{tailor.handle}</p>
                      <p className="text-xs text-[#1FA694] font-medium mt-1">{tailor.specialty}</p>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {tailor.rating} ({tailor.reviews})
                        </span>
                        <span>{tailor.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-[#1FA694] hover:bg-[#178576] text-white text-xs font-semibold flex items-center justify-center gap-1">
                      <Scissors className="w-3.5 h-3.5" /> Book Work
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DESIGN WARDROBE / WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Custom Design Inspiration Board</h2>
                  <p className="text-xs text-slate-500">Saved sketches, necklines, and outfit designs ready to send to remote tailors.</p>
                </div>
                <button 
                  onClick={() => setShowAddWishlistModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#1FA694] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#178576]"
                >
                  <Plus className="w-4 h-4" /> Add Idea
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {CUSTOMER_DATA.wardrobeWishlist.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="h-48 relative bg-slate-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-slate-900/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.notes}</p>
                        
                        <div className="mt-3 text-[11px] bg-[#E6F5F3] text-[#1FA694] px-2.5 py-1 rounded border border-[#1FA694]/20 inline-block font-medium">
                          Suggested Fabric: {item.fabricType}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                      <button className="w-full py-2 mt-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1">
                        <Scissors className="w-3.5 h-3.5" /> Send to Tailor for Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS GIVEN */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-2">My Community Reviews</h2>
              {CUSTOMER_DATA.reviewsGiven.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                  <img src={rev.photo} alt={rev.garment} className="w-20 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 text-sm">{rev.tailorName}</h3>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-xs font-medium text-[#1FA694]">Order: {rev.garment}</p>
                    <div className="flex items-center gap-0.5 py-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
            <button 
              onClick={() => setSelectedOrderModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1FA694]" />
              <h3 className="text-lg font-bold text-slate-900">Order Summary ({selectedOrderModal.id})</h3>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between"><span className="text-slate-500">Item:</span><span className="font-bold">{selectedOrderModal.garmentTitle}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tailor:</span><span>{selectedOrderModal.tailorName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Measurements Profile:</span><span>{selectedOrderModal.measurementsUsed}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Fabric Source:</span><span>{selectedOrderModal.fabricProvided}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Total Price:</span><span className="font-bold text-[#1FA694]">{selectedOrderModal.price}</span></div>
            </div>

            <button 
              onClick={() => setSelectedOrderModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#1FA694] text-white text-xs font-bold"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}

      {}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-lg">
        <button 
          onClick={() => setActiveTab('orders')}
          className="flex-1 py-2.5 rounded-xl bg-[#1FA694] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> My Orders
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          className="flex-1 py-2.5 rounded-xl bg-[#E6F5F3] text-[#1FA694] border border-[#1FA694]/30 text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Bookmark className="w-4 h-4" /> Wishlist
        </button>
      </div>

    </div>
  );
}