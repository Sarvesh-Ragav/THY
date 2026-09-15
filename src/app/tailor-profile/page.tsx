'use client';
import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  Calendar, 
  Scissors, 
  Shirt, 
  ShieldCheck, 
  Clock, 
  Ruler, 
  Eye, 
  X, 
  Heart, 
  Wrench, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Edit3, 
  Plus, 
  Download, 
  Bookmark, 
  FileText, 
  Globe,
  User,
  ArrowRight
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    // Shared
    brandTitle: "Tailor Community Hub",
    verified: "Verified",
    switchRole: "Switch View",
    tailorView: "Tailor Profile",
    customerView: "Customer Profile",
    location: "Chennai, Tamil Nadu",
    message: "Message",
    close: "Close",
    
    // Tailor Profile Translations
    tailorName: "Aarav Sharma",
    tailorTitle: "Master Designer & Ethnic Wear Specialist",
    tailorBio: "Specializing in traditional South Indian bridal blouses, custom designer sherwanis, and precision alterations. Equipped with high-speed industrial machinery for reliable remote contract fulfillment.",
    acceptingOrders: "Accepting Remote Orders",
    experience: "12+ Years Exp.",
    completedOrders: "Completed Orders",
    onTimeDelivery: "On-Time Delivery",
    ratings: "Ratings",
    hireTailor: "Assign Work / Hire",
    orderRequested: "Order Requested",
    
    // Tailor Tabs
    tabPortfolio: "Stitching Gallery",
    tabServices: "Services & Rates",
    tabEquipment: "Workshop Setup",
    tabReviews: "Reviews",
    
    // Customer Profile Translations
    custName: "Sarah Jenkins",
    custBadge: "THY Member",
    stitchPoints: "Stitch Loyalty Points",
    editProfile: "Edit Profile",
    fitCard: "Fit Card",
    activeOrders: "Active Orders",
    completedDesigns: "Completed Designs",
    savedTailors: "Saved Tailors",
    
    // Customer Fit Card
    fitCardTitle: "Digital Measurement Fit Card",
    fitCardSub: "Share exact measurements instantly with remote tailors for custom orders.",
    measurementsSelf: "Self (Default)",
    measurementsPartner: "Partner (Rahul - Formal Fits)",
    measurementsKid: "Daughter (Ananya - Ethnic)",
    downloadPdf: "Download PDF",
    editValues: "Edit Values",
    
    // Customer Tabs
    tabMyOrders: "My Orders",
    tabSavedTailors: "Saved Tailors",
    tabWishlist: "Design Wardrobe",
    tabMyReviews: "My Reviews",
    
    // Order Labels
    inStitching: "In Stitching",
    fittingStage: "Fitting Stage",
    delivered: "Delivered",
    estDelivery: "Est. Delivery",
    assignedTailor: "Assigned Tailor",
    progressTracker: "Order Progress Tracker",
    orderDetails: "Order Details",
    chatTailor: "Chat with Tailor",
    
    // Wishlist
    wishlistTitle: "Custom Design Inspiration Board",
    wishlistSub: "Saved sketches & outfit designs ready to send to remote tailors.",
    addIdea: "Add Idea",
    sendForQuote: "Send to Tailor for Quote",
    suggestedFabric: "Suggested Fabric"
  },
  
  hi: {
    // Shared
    brandTitle: "दर्जी कम्युनिटी हब",
    verified: "सत्यापित",
    switchRole: "व्यू बदलें",
    tailorView: "दर्जी प्रोफ़ाइल",
    customerView: "ग्राहक प्रोफ़ाइल",
    location: "चेन्नई, तमिलनाडु",
    message: "संदेश",
    close: "बंद करें",
    
    // Tailor Profile Translations
    tailorName: "आरव शर्मा",
    tailorTitle: "मास्टर डिजाइनर और एथनिक परिधान विशेषज्ञ",
    tailorBio: "पारंपरिक दक्षिण भारतीय ब्राइडल ब्लाउज, कस्टम शेरावनी और सटीक फिटिंग में विशेषज्ञता। दूरस्थ सिलाई कार्यों के लिए आधुनिक औद्योगिक मशीनों से लैस।",
    acceptingOrders: "ऑनलाइन ऑर्डर स्वीकार हैं",
    experience: "12+ वर्ष अनुभव",
    completedOrders: "पूरे किए गए ऑर्डर",
    onTimeDelivery: "समय पर डिलीवरी",
    ratings: "रेटिंग",
    hireTailor: "काम सौंपें / सिलाई बुक करें",
    orderRequested: "ऑर्डर भेजा गया",
    
    // Tailor Tabs
    tabPortfolio: "सिलाई गैलरी",
    tabServices: "सेवाएं और दरें",
    tabEquipment: "वर्कशॉप मशीनें",
    tabReviews: "समीक्षाएं",
    
    // Customer Profile Translations
    custName: "सारा जेन्किंस",
    custBadge: "THY सदस्य",
    stitchPoints: "स्टिच रिवॉर्ड पॉइंट्स",
    editProfile: "प्रोफ़ाइल बदलें",
    fitCard: "फिट कार्ड",
    activeOrders: "सक्रिय ऑर्डर",
    completedDesigns: "पूरे डिज़ाइन",
    savedTailors: "सेव किए गए दर्जी",
    
    // Customer Fit Card
    fitCardTitle: "डिजिटल माप फिट कार्ड",
    fitCardSub: "कस्टम ऑर्डर के लिए दूरस्थ दर्जियों के साथ सटीक माप तुरंत साझा करें।",
    measurementsSelf: "स्वयं (डिफ़ॉल्ट)",
    measurementsPartner: "पार्टनर (राहुल - फॉर्मल)",
    measurementsKid: "बेटी (अनन्या - एथनिक)",
    downloadPdf: "PDF डाउनलोड करें",
    editValues: "माप बदलें",
    
    // Customer Tabs
    tabMyOrders: "मेरे ऑर्डर",
    tabSavedTailors: "सेव दर्जी",
    tabWishlist: "डिज़ाइन वार्डरोब",
    tabMyReviews: "मेरी समीक्षाएं",
    
    // Order Labels
    inStitching: "सिलाई जारी है",
    fittingStage: "फिटिंग चरण",
    delivered: "डिलीवर किया गया",
    estDelivery: "अनुमानित डिलीवरी",
    assignedTailor: "चुने गए दर्जी",
    progressTracker: "ऑर्डर प्रगति ट्रैकर",
    orderDetails: "ऑर्डर विवरण",
    chatTailor: "दर्जी से बात करें",
    
    // Wishlist
    wishlistTitle: "कस्टम डिज़ाइन प्रेरणा बोर्ड",
    wishlistSub: "दर्जियों को कोटेशन के लिए भेजने हेतु सहेजे गए स्केच और डिज़ाइन।",
    addIdea: "आइडिया जोड़ें",
    sendForQuote: "कोटेशन के लिए दर्जी को भेजें",
    suggestedFabric: "सुझाया गया कपड़ा"
  },
  
  ta: {
    // Shared
    brandTitle: "தையல் சமூக மையம்",
    verified: "சரிபார்க்கப்பட்டது",
    switchRole: "பார்வையை மாற்றுக",
    tailorView: "தையல்காரர் சுயவிவரம்",
    customerView: "வாடிக்கையாளர் சுயவிவரம்",
    location: "சென்னை, தமிழ்நாடு",
    message: "செய்தி",
    close: "மூடு",
    
    // Tailor Profile Translations
    tailorName: "ஆரவ் சர்மா",
    tailorTitle: "முதன்மை ஆடை வடிவமைப்பாளர் & பாரம்பரிய ஆடை நிபுணர்",
    tailorBio: "பாரம்பரிய தென்னிந்திய மணப்பெண் பிளவுஸ்கள், ஷெர்வானிகள் மற்றும் துல்லியமான அளவுகளுக்கு சிறந்தது. விரைவான வேலைகளுக்கு நவீன தையல் இயந்திரங்களுடன் செயல்படுகிறது.",
    acceptingOrders: "ஆர்டர்கள் ஏற்கப்படுகின்றன",
    experience: "12+ ஆண்டுகள் அனுபவம்",
    completedOrders: "முடிந்த ஆர்டர்கள்",
    onTimeDelivery: "சரியான நேர விநியோகம்",
    ratings: "மதிப்பீடுகள்",
    hireTailor: "வேலையை ஒப்படைக்கவும்",
    orderRequested: "ஆர்டர் அனுப்பப்பட்டது",
    
    // Tailor Tabs
    tabPortfolio: "தையல் கேலரி",
    tabServices: "சேவைகள் & கட்டணம்",
    tabEquipment: "பட்டறை கருவிகள்",
    tabReviews: "மதிப்புரைகள்",
    
    // Customer Profile Translations
    custName: "சாரா ஜென்கின்ஸ்",
    custBadge: "THY உறுப்பினர்",
    stitchPoints: "தையல் புள்ளி வெகுமதி",
    editProfile: "சுயவிவரத்தை திருத்து",
    fitCard: "அளவு அட்டை",
    activeOrders: "செயலில் உள்ள ஆர்டர்கள்",
    completedDesigns: "முடிந்த ஆடைகள்",
    savedTailors: "சேமிக்கப்பட்ட தையல்காரர்கள்",
    
    // Customer Fit Card
    fitCardTitle: "டிஜிட்டல் தையல் அளவு அட்டை",
    fitCardSub: "தையல்காரர்களிடம் துல்லியமான உடலளவுகளை உடனடியாகப் பகிரவும்.",
    measurementsSelf: "எனது அளவு",
    measurementsPartner: "துணைவர் (ராகுல்)",
    measurementsKid: "மகள் (அனன்யா)",
    downloadPdf: "PDF பதிவிறக்கம்",
    editValues: "அளவை திருத்து",
    
    // Customer Tabs
    tabMyOrders: "எனது ஆர்டர்கள்",
    tabSavedTailors: "சேமித்த தையல்காரர்கள்",
    tabWishlist: "வடிவமைப்பு கேலரி",
    tabMyReviews: "எனது மதிப்புரைகள்",
    
    // Order Labels
    inStitching: "தைக்கப்படுகிறது",
    fittingStage: "அளவு சோதனை",
    delivered: "டெலிவரி செய்யப்பட்டது",
    estDelivery: "எதிர்பார்க்கப்படும் நாள்",
    assignedTailor: "ஒப்படைக்கப்பட்ட தையல்காரர்",
    progressTracker: "ஆர்டர் நிலை டிராக்கர்",
    orderDetails: "ஆர்டர் விவரங்கள்",
    chatTailor: "தையல்காரருடன் பேசுங்கள்",
    
    // Wishlist
    wishlistTitle: "ஆடை வடிவமைப்பு பலகை",
    wishlistSub: "தையல்காரருக்கு அனுப்ப சேமிக்கப்பட்ட வடிவமைப்பு படங்கள்.",
    addIdea: "புதிய யோசனை",
    sendForQuote: "விலை கேட்க அனுப்பவும்",
    suggestedFabric: "பரிந்துரைக்கப்பட்ட துணி"
  }
};

const PORTFOLIO_ITEMS = [
  { id: 1, title: "Royal Velvet Bridal Blouse", category: "Ethnic", fabric: "Pure Silk Velvet", time: "4 Days", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "Custom 3-Piece Tuxedo", category: "Formal", fabric: "Italian Wool Blend", time: "6 Days", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Designer Silk Lehenga", category: "Ethnic", fabric: "Chanderi Silk", time: "5 Days", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600" }
];

const CUSTOMER_ORDERS = [
  { id: "THY-8921", title: "Custom Velvet Bridal Lehenga", tailor: "Aarav Sharma", status: "In Stitching", step: 3, price: "₹6,800", date: "18 Oct 2026", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600" },
  { id: "THY-8740", title: "Bespoke Italian Wool Tuxedo", tailor: "Vikramaditya Tailors", status: "Fitting Stage", step: 4, price: "₹8,500", date: "22 Oct 2026", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600" }
];

export default function App() {
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en'); // 'en', 'hi', 'ta'
  const [viewMode, setViewMode] = useState('tailor'); // 'tailor' or 'customer'
  const [activeTab, setActiveTab] = useState('main');
  const [isHired, setIsHired] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('self');

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-12">
      
      {}
      <header className="bg-[#1FA694] text-white py-3 px-4 shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-2">
            <div className="bg-white text-[#1FA694] p-1.5 rounded-lg font-bold text-lg leading-none tracking-wider">THY</div>
            <span className="font-semibold text-base sm:text-lg tracking-wide hidden sm:inline">{t.brandTitle}</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Language Toggle Dropdown */}
            <div className="relative flex items-center bg-[#178576] rounded-lg px-2 py-1 text-xs font-semibold border border-teal-300/30">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-teal-200" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as keyof typeof TRANSLATIONS)}
                className="bg-transparent text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="text-slate-900">English</option>
                <option value="hi" className="text-slate-900">हिंदी (Hindi)</option>
                <option value="ta" className="text-slate-900">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Profile View Mode Switcher */}
            <button 
              onClick={() => {
                setViewMode(viewMode === 'tailor' ? 'customer' : 'tailor');
                setActiveTab('main');
              }}
              className="bg-white text-[#1FA694] hover:bg-[#E6F5F3] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>{viewMode === 'tailor' ? t.customerView : t.tailorView}</span>
            </button>

          </div>
        </div>
      </header>

      {}
      <main className="max-w-6xl mx-auto px-0 sm:px-4 py-0 sm:py-6">

        {/* ========================================================= */}
        {/* VIEW 1: TAILOR PROFILE                                    */}
        {/* ========================================================= */}
        {viewMode === 'tailor' && (
          <div>
            {/* Tailor Cover Banner & Identity Header */}
            <div className="bg-white sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
              
              <div className="h-44 sm:h-60 relative bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Tailor Workshop Cover" 
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20" />
                <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                  {t.acceptingOrders}
                </div>
              </div>

              <div className="relative px-4 sm:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-5 gap-4">
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                        alt={t.tailorName} 
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md object-cover bg-white"
                      />
                      <span className="absolute bottom-2 right-2 bg-[#1FA694] text-white p-1 rounded-full border-2 border-white shadow">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="pt-2 sm:pt-0">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.tailorName}</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F5F3] text-[#1FA694] border border-[#1FA694]/20">
                          {t.verified}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 mt-0.5">{t.tailorTitle}</p>
                      
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#1FA694]" />
                          {t.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Scissors className="w-3.5 h-3.5 text-[#1FA694]" />
                          {t.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-end gap-2.5 mt-2 sm:mt-0">
                    <button 
                      onClick={() => setIsHired(!isHired)}
                      className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                        isHired 
                        ? "bg-emerald-600 text-white" 
                        : "bg-[#1FA694] hover:bg-[#178576] text-white active:scale-95"
                      }`}
                    >
                      {isHired ? <Check className="w-4 h-4" /> : <Scissors className="w-4 h-4" />}
                      <span>{isHired ? t.orderRequested : t.hireTailor}</span>
                    </button>

                    <button className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                      <span className="hidden sm:inline">{t.message}</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 max-w-4xl text-center sm:text-left leading-relaxed">
                  {t.tailorBio}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 p-3 sm:p-4 rounded-xl bg-[#E6F5F3]/60 border border-[#1FA694]/20 text-center">
                  <div>
                    <div className="text-lg sm:text-2xl font-bold text-[#1FA694]">342+</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{t.completedOrders}</div>
                  </div>
                  <div className="border-x border-[#1FA694]/20">
                    <div className="text-lg sm:text-2xl font-bold text-[#1FA694]">99%</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{t.onTimeDelivery}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-lg sm:text-2xl font-bold text-[#1FA694]">
                      <span>4.9</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">(128 {t.ratings})</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white sm:rounded-xl shadow-sm border border-slate-200/80 mb-6">
              <nav className="flex divide-x divide-slate-100">
                {[
                  { id: 'main', label: t.tabPortfolio, icon: Eye },
                  { id: 'services', label: t.tabServices, icon: Shirt },
                  { id: 'equipment', label: t.tabEquipment, icon: Wrench },
                  { id: 'reviews', label: t.tabReviews, icon: Star },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                        isActive 
                          ? 'border-[#1FA694] text-[#1FA694] bg-[#E6F5F3]/30' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#1FA694]' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PORTFOLIO_ITEMS.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="h-48 relative bg-slate-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-slate-900/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span>Fabric: <strong className="text-slate-700">{item.fabric}</strong></span>
                      <span className="text-[#1FA694] font-semibold">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: CUSTOMER PROFILE                                  */}
        {/* ========================================================= */}
        {viewMode === 'customer' && (
          <div>
            {/* Customer Banner & Header */}
            <div className="bg-white sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
              
              <div className="h-40 sm:h-56 relative bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Customer Cover" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-[#E6F5F3] text-[#1FA694] border border-[#1FA694]/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-[#1FA694]" />
                  450 {t.stitchPoints}
                </div>
              </div>

              <div className="relative px-4 sm:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-5 gap-4">
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" 
                      alt={t.custName} 
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                    />
                    <div className="pt-2 sm:pt-0">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.custName}</h1>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F5F3] text-[#1FA694] border border-[#1FA694]/20">
                          {t.custBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1FA694]" /> {t.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-end gap-2">
                    <button className="px-4 py-2 rounded-xl bg-[#1FA694] hover:bg-[#178576] text-white text-xs font-semibold transition-all flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> {t.editProfile}
                    </button>
                  </div>
                </div>

                {/* Customer Quick Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 p-3 sm:p-4 rounded-xl bg-[#E6F5F3]/60 border border-[#1FA694]/20 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">2</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{t.activeOrders}</div>
                  </div>
                  <div className="border-x border-[#1FA694]/20">
                    <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">18</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{t.completedDesigns}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-[#1FA694]">12</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{t.savedTailors}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Digital Fit Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-[#1FA694]" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">{t.fitCardTitle}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{t.fitCardSub}</p>
                </div>

                {/* Profile selector buttons */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'self', label: t.measurementsSelf },
                    { id: 'partner', label: t.measurementsPartner },
                    { id: 'kid', label: t.measurementsKid }
                  ].map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => setSelectedProfileId(prof.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                        selectedProfileId === prof.id
                          ? "bg-[#1FA694] text-white border-[#1FA694]"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {prof.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Metrics Display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-[#E6F5F3]/40 border border-[#1FA694]/15">
                  <span className="text-[11px] text-slate-500 font-medium">Chest / Bust</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">36 in</p>
                </div>
                <div className="p-3 rounded-xl bg-[#E6F5F3]/40 border border-[#1FA694]/15">
                  <span className="text-[11px] text-slate-500 font-medium">Waist</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">28 in</p>
                </div>
                <div className="p-3 rounded-xl bg-[#E6F5F3]/40 border border-[#1FA694]/15">
                  <span className="text-[11px] text-slate-500 font-medium">Hips</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">38 in</p>
                </div>
                <div className="p-3 rounded-xl bg-[#E6F5F3]/40 border border-[#1FA694]/15">
                  <span className="text-[11px] text-slate-500 font-medium">Full Length</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">54 in</p>
                </div>
              </div>
            </div>

            {/* Active Orders List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1FA694]" /> {t.tabMyOrders}
              </h3>

              {CUSTOMER_ORDERS.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-[#1FA694] bg-[#E6F5F3] px-2 py-0.5 rounded">{order.id}</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">{order.title}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      ● {order.status === "In Stitching" ? t.inStitching : t.fittingStage}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={order.image} alt={order.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="text-xs space-y-0.5">
                      <p className="text-slate-500">{t.assignedTailor}: <strong className="text-slate-700">{order.tailor}</strong></p>
                      <p className="text-slate-500">{t.estDelivery}: <strong className="text-slate-700">{order.date}</strong></p>
                      <p className="text-[#1FA694] font-bold">{order.price}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                    <div className="flex justify-between font-semibold text-slate-600 mb-1">
                      <span>{t.progressTracker}</span>
                      <span className="text-[#1FA694]">Step {order.step} / 5</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#1FA694] h-full rounded-full" style={{ width: `${(order.step / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-lg">
        {viewMode === 'tailor' ? (
          <button 
            onClick={() => setIsHired(!isHired)}
            className="w-full py-2.5 rounded-xl bg-[#1FA694] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <Scissors className="w-4 h-4" /> {isHired ? t.orderRequested : t.hireTailor}
          </button>
        ) : (
          <button className="w-full py-2.5 rounded-xl bg-[#1FA694] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
            <ShoppingBag className="w-4 h-4" /> {t.tabMyOrders}
          </button>
        )}
      </div>

    </div>
  );
}