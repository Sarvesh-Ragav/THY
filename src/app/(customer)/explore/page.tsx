'use client';

import React, { useState, createContext, useContext } from 'react';
import {
  Scissors,
  Sparkles,
  Search,
  Languages,
  Moon,
  Sun,
  ShoppingBag,
  Tag,
  ArrowRight,
  Clock,
  CheckCircle2,
  Gift,
  Copy,
  Truck
} from 'lucide-react';

// ==========================================
// 1. Multilingual Dictionary (Branded strictly as THY)
// ==========================================
const translations = {
  en: {
    brandName: "THY",
    subBrand: "OFFERS & FESTIVE HUB",
    searchPlaceholder: "Search THY offers, fabrics, blouse stitching...",
    heroBadge: "FESTIVE SEASON EXTRAVAGANZA",
    heroTitle: "Exquisite Couture Deals & Doorstep Pickup",
    heroSubtitle: "Get up to 40% OFF on custom stitching, bridal combos & express 48-hr fitting delivery by THY.",
    btnStart: "Claim THY Offer",
    btnStory: "Free Fabric Doorstep Pickup",
    
    // Category Filters
    filterAll: "All Deals",
    filterFestive: "Festive Season",
    filterCombos: "Combo Savings",
    filterUnder499: "Under ₹499",
    filterArtisans: "Artisan Picks",

    // Section Headers
    couponsTitle: "Flash Coupons & Discount Claims",
    gridTitle1: "Stitching Under ₹499",
    gridTitle2: "Festive Combo Offers",
    gridTitle3: "Master Artisan Specials",
    gridTitle4: "Express Delivery & Fit",

    // Footer
    footerText: "© 2026 THY. Empowering local master artisans & exquisite custom fashion."
  },
  hi: {
    brandName: "थाई (THY)",
    subBrand: "ऑफर और फेस्टिव हब",
    searchPlaceholder: "थाई ऑफर्स, कपड़ा, ब्लाउज सिलाई खोजें...",
    heroBadge: "त्योहारों का खास धमाका",
    heroTitle: "उत्कृष्ट कॉट्यूर डील्स और घर बैठे पिकअप",
    heroSubtitle: "कस्टम सिलाई, ब्राइडल कॉम्बोस और एक्सप्रेस 48-घंटे डिलीवरी पर 40% तक की छूट।",
    btnStart: "थाई ऑफर क्लेम करें",
    btnStory: "मुफ्त डोरस्टेप फैब्रिक पिकअप",

    filterAll: "सभी डील्स",
    filterFestive: "फेस्टिव सीजन",
    filterCombos: "कॉम्बो बचत",
    filterUnder499: "₹499 के अंदर",
    filterArtisans: "कारीगर की पसंद",

    couponsTitle: "फ्लैश कूपन और डिस्काउंट कोड्स",
    gridTitle1: "सिलाई ₹499 के अंदर",
    gridTitle2: "फेस्टिव कॉम्बो ऑफर्स",
    gridTitle3: "मास्टर कारीगर विशेष",
    gridTitle4: "एक्सप्रेस डिलीवरी और फिटिंग",

    footerText: "© 2026 थाई (THY)। स्थानीय कारीगरों और कस्टम फैशन को सशक्त बनाना।"
  },
  ta: {
    brandName: "தாய் (THY)",
    subBrand: "சலுகைகள் & பண்டிகை மையம்",
    searchPlaceholder: "தாய் சலுகைகள், துணிகள் மற்றும் தையல் தேடுக...",
    heroBadge: "பண்டிகைக் கால சிறப்பு சலுகைகள்",
    heroTitle: "சிறந்த ஆடை வடிவமைப்புகள் & வீட்டு வாசல் சேவை",
    heroSubtitle: "தாய் தையல் சேவைகளில் 40% வரை தள்ளுபடி மற்றும் 48 மணிநேர விரைவு விநியோகம்.",
    btnStart: "சலுகையை பெறுக",
    btnStory: "இலவச துணி எடுக்கும் சேவை",

    filterAll: "அனைத்து சலுகைகள்",
    filterFestive: "பண்டிகை காலம்",
    filterCombos: "காம்போ சேமிப்பு",
    filterUnder499: "₹499-க்குள்",
    filterArtisans: "கைவினைஞர்களின் தேர்வுகள்",

    couponsTitle: "ப்ளாஷ் கூப்பன்கள் & தள்ளுபடிகள்",
    gridTitle1: "தையல் ₹499-க்குள்",
    gridTitle2: "பண்டிகை காம்போ சலுகைகள்",
    gridTitle3: "பிரத்யேக கைவினைஞர் சிறப்பு",
    gridTitle4: "விரைவு விநியோகம் & ஃபிட்டிங்",

    footerText: "© 2026 தாய் (THY). கைவினைஞர்கள் மற்றும் பிரத்யேக ஆடைகளை இணைக்கிறது."
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const t = translations[lang as keyof typeof translations];

  return (
    <LanguageContext.Provider value={{ lang, setLang, darkMode, setDarkMode, t }}>
      <div className={darkMode ? 'dark' : ''}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

function ExploreContent() {
  const { lang, setLang, darkMode, setDarkMode, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All Deals');
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [bookingsCount, setBookingsCount] = useState(0);

  const coupons = [
    { code: "THYFEST500", discount: "Flat ₹500 OFF", desc: "On festive bridal orders over ₹2,999", tag: "FESTIVE" },
    { code: "ARTISAN20", discount: "20% OFF", desc: "For hand-embroidered Zardosi work", tag: "ARTISAN" },
    { code: "EXPRESSFREE", discount: "Free Rush Delivery", desc: "48-hour fitting delivery on all blouses", tag: "EXPRESS" },
    { code: "COMBO1000", discount: "Save ₹1,000", desc: "On Suits & Lehengas complete tailor combos", tag: "COMBO" }
  ];

  const handleClaimCoupon = (code: string) => {
    setCopiedCoupon(code);
    setBookingsCount(prev => prev + 1);
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#209988] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* THY Brand Identity */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white text-[#209988] flex items-center justify-center font-bold shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-wider block leading-none text-white">
                {t.brandName}
              </span>
              <span className="text-[10px] text-teal-100 font-bold uppercase tracking-widest">
                {t.subBrand}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center bg-white rounded-xl overflow-hidden p-1 text-slate-800 shadow-inner">
            <select className="bg-slate-100 text-xs font-bold px-3 py-2 rounded-lg border-r border-slate-200 focus:outline-none text-slate-700 cursor-pointer">
              <option>All Categories</option>
              <option>Designer Blouses</option>
              <option>Kurti Tailoring</option>
              <option>Festive Combos</option>
              <option>Men's Suits</option>
              <option>Express Fitting</option>
            </select>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full text-xs px-3 py-2 focus:outline-none text-slate-800 placeholder-slate-400"
            />
            <button className="bg-[#1b8475] hover:bg-[#156d60] text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBookingsCount(prev => prev + 1)}
              className="flex items-center gap-2 bg-[#1b8475] hover:bg-[#166e61] px-3 py-2 rounded-xl border border-teal-400/40 text-white transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-teal-200" />
              <span className="text-xs font-bold hidden sm:inline">Bookings</span>
              <span className="bg-white text-[#209988] text-xs font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {bookingsCount}
              </span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-[#1b8475] hover:bg-[#166e61] text-white transition-all border border-teal-400/30 cursor-pointer"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-teal-100" />}
            </button>

            <div className="flex items-center gap-1 bg-[#1b8475] px-2 py-1.5 rounded-xl border border-teal-400/30">
              <Languages className="w-4 h-4 text-teal-200" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="en" className="text-slate-900">English</option>
                <option value="hi" className="text-slate-900">हिंदी</option>
                <option value="ta" className="text-slate-900">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* HERO & CONTENT */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#209988] via-[#1b8475] to-teal-900 text-white p-6 sm:p-10 shadow-xl border border-teal-600/30">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-teal-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t.heroBadge}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => setBookingsCount(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-white text-[#209988] font-bold text-xs hover:bg-teal-50 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                {t.btnStart}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-[#166e61] text-white font-bold text-xs hover:bg-[#12584e] border border-teal-400/30 transition-all flex items-center gap-2 cursor-pointer">
                <Truck className="w-4 h-4" />
                {t.btnStory}
              </button>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"
              alt="THY Custom Fitting"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* CATEGORY FILTER BAR */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <Tag className="w-3.5 h-3.5 text-[#209988]" /> Filter:
            </span>
            {[
              { label: t.filterAll, value: 'All Deals' },
              { label: t.filterFestive, value: 'Festive Season' },
              { label: t.filterCombos, value: 'Combo Savings' },
              { label: t.filterUnder499, value: 'Under ₹499' },
              { label: t.filterArtisans, value: 'Artisan Picks' }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveFilter(item.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                  activeFilter === item.value
                    ? 'bg-[#209988] text-white border-[#209988] shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#209988]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setActiveFilter('All Deals')}
            className="text-xs font-bold text-[#209988] hover:underline shrink-0 hidden sm:block cursor-pointer"
          >
            See All THY Deals →
          </button>
        </div>

        {/* FLASH COUPONS */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#209988]" />
            {t.couponsTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="bg-gradient-to-br from-teal-50 to-white dark:from-slate-800 dark:to-slate-850 p-4 rounded-2xl border border-teal-200 dark:border-slate-700 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#209988] text-white px-2 py-0.5 rounded-md">
                    {c.tag}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{c.discount}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{c.code}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{c.desc}</p>
                </div>
                <button
                  onClick={() => handleClaimCoupon(c.code)}
                  className="w-full py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-teal-500/30 text-[#209988] dark:text-teal-400 font-bold text-xs hover:bg-[#209988] hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copiedCoupon === c.code ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Applied to Booking!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Claim Coupon
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* OFFER CARDS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Stitching Under ₹499 */}
          {(activeFilter === 'All Deals' || activeFilter === 'Under ₹499') && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.gridTitle1}</h3>
                  <span className="text-[10px] font-extrabold text-[#209988] bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                    BUDGET FITS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <img 
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80" 
                      alt="Blouse Stitching" 
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">Designer Blouses</span>
                    <span className="text-[11px] font-extrabold text-[#209988]">From ₹399</span>
                  </div>

                  <div className="space-y-1">
                    <img 
                      src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop&q=80" 
                      alt="Kurti Fitting" 
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">Daily Kurti Stitching</span>
                    <span className="text-[11px] font-extrabold text-[#209988]">From ₹449</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setBookingsCount(prev => prev + 1)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#209988] hover:text-white text-[#209988] font-bold text-xs transition-colors text-center cursor-pointer"
              >
                Explore All Budget Fits →
              </button>
            </div>
          )}

          {/* Card 2: Festive Combo Offers */}
          {(activeFilter === 'All Deals' || activeFilter === 'Festive Season' || activeFilter === 'Combo Savings') && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.gridTitle2}</h3>
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    SAVE 35%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop&q=80" 
                      alt="Lehenga Stitching" 
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">Bridal Lehenga + Blouse</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Save ₹1,200 on complete bridal fit</p>
                      <span className="text-xs font-black text-[#209988]">₹2,499 <span className="line-through text-slate-400 font-normal text-[10px]">₹3,699</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=200&auto=format&fit=crop&q=80" 
                      alt="Men Suit" 
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">Men's Suit + Shirt</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">3-Piece Premium Tailoring</p>
                      <span className="text-xs font-black text-[#209988]">₹2,999 <span className="line-through text-slate-400 font-normal text-[10px]">₹4,200</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setBookingsCount(prev => prev + 1)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#209988] hover:text-white text-[#209988] font-bold text-xs transition-colors text-center cursor-pointer"
              >
                View All Festive Combos →
              </button>
            </div>
          )}

          {/* Card 3: Master Artisan Specials */}
          {(activeFilter === 'All Deals' || activeFilter === 'Artisan Picks') && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.gridTitle3}</h3>
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    CRAFT HANDWORK
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80" 
                    alt="Hand embroidery" 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white">Hand-Embroidered Zardosi</span>
                    <span className="text-[10px] text-slate-200">Customized motif designs by certified THY artisans</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">★ 4.95 Average Fitting Rating</span>
                  <CheckCircle2 className="w-4 h-4 text-[#209988]" />
                </div>
              </div>

              <button 
                onClick={() => setBookingsCount(prev => prev + 1)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#209988] hover:text-white text-[#209988] font-bold text-xs transition-colors text-center cursor-pointer"
              >
                Browse THY Artisans →
              </button>
            </div>
          )}

          {/* Card 4: Express Delivery */}
          {(activeFilter === 'All Deals' || activeFilter === 'Festive Season') && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.gridTitle4}</h3>
                  <span className="text-[10px] font-extrabold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                    48-HR RUSH
                  </span>
                </div>

                <div className="bg-gradient-to-br from-[#209988] to-teal-800 text-white rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-200" />
                    <span className="font-bold text-xs">Doorstep Agent @ 60 Mins</span>
                  </div>
                  <p className="text-[11px] text-teal-100 leading-relaxed">
                    Book a THY doorstep measurement agent to collect your fabric and fit samples directly today.
                  </p>
                  <div className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-md inline-block">
                    ⚡ Express Stitching Slot Available
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setBookingsCount(prev => prev + 1)}
                className="w-full py-2.5 rounded-xl bg-[#209988] text-white font-bold text-xs hover:bg-[#197d6f] shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                Book Express Pickup
              </button>
            </div>
          )}

        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>{t.footerText}</p>
        </footer>

      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <LanguageProvider>
      <ExploreContent />
    </LanguageProvider>
  );
}