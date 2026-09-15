'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight, 
  Check, 
  Star, 
  ShieldCheck, 
  Scissors, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  MessageCircle, 
  ArrowRight, 
  MapPin, 
  Tag, 
  ArrowLeft, 
  Clock, 
  Eye, 
  FileText, 
  ExternalLink, 
  Printer 
} from 'lucide-react';

const TRANSLATIONS = {
  EN: {
    brandName: 'THY Tailoring Hub',
    navProduct: '1. Product Details',
    navCart: '2. Shopping Cart',
    navCheckout: '3. Checkout & Payment',
    breadcrumbHome: 'Home',
    breadcrumbCategory: 'Bridal Ethnic Wear',
    breadcrumbProduct: 'Hand-Embroidered Velvet Blouse',
    customTailoredBadge: 'Custom Tailored',
    categoryBadge: 'BRIDAL ETHNIC WEAR',
    productTitle: 'Hand-Embroidered Velvet Bridal Blouse',
    verifiedReviews: '128 Verified Reviews',
    stockStatus: 'In Stock & Ready for Tailor Pickup',
    stitchingHandledBy: 'CUSTOM STITCHING HANDLED BY',
    tailorName: 'Master Tailor Aarav Sharma',
    tailorLocation: 'Chennai, TN • 12+ Yrs Exp.',
    chatBtn: 'Chat',
    customizeTitle: 'Customize Stitching & Add-ons',
    customizeSub: 'Select custom hand-embroidery, lining, and finishing preferences.',
    totalQuotationLabel: 'Total Outfit Quotation',
    baseStitching: 'Base Stitching',
    addonsCost: 'Add-ons',
    addToCart: 'Add to Cart',
    proceedToCart: 'Proceed to Cart ->',
    guaranteeText: 'Free remote alteration support within 7 days of delivery.',
    cartHeading: 'Bespoke Shopping Cart',
    cartSubheading: 'Review item details and click to view full tailoring quotation breakdown.',
    continueCustomizing: 'Continue Customizing More Items',
    emptyCartTitle: 'Your Tailoring Cart is Empty',
    emptyCartSub: 'Configure your custom ethnic outfit with our master tailor to build a quotation.',
    configureNow: 'Configure Custom Outfit Now',
    viewQuotationBtn: 'View Quotation Breakdown',
    fabricProvided: 'Customer Doorstep Fabric Pickup',
    quantity: 'Qty',
    deleteItem: 'Delete Item',
    saveForLater: 'Save for Later',
    orderSummary: 'Order Summary',
    promoLabel: 'Apply Promo / Voucher Code',
    applyBtn: 'Apply',
    subtotal: 'Items Subtotal',
    discount: 'Promo Discount',
    pickupFee: 'Doorstep Fabric Pickup & Fitting',
    estimatedTax: 'Estimated GST (5%)',
    grandTotal: 'Total Quotation',
    proceedToCheckout: 'Proceed to Checkout & Fabric Pickup →',
    guaranteedPricing: 'Guaranteed Pricing',
    quotationPageTitle: 'Bespoke Tailoring Quotation & Invoice',
    quotationRef: 'Quotation ID',
    quotationDate: 'Generated Date',
    fabricDetailsLabel: 'Fabric Specification Status',
    customerProvided: 'Customer Doorstep Pickup (Raw Fabric)',
    stitchingBreakdownTitle: 'Itemized Stitching & Add-on Charges',
    masterTailorBadgeTitle: 'Assigned Master Craftsman',
    perUnitTotal: 'Unit Quotation Subtotal',
    backToCart: '← Back to Shopping Cart',
    proceedToCheckoutFromQuotation: 'Proceed to Checkout →',
    estimatedTurnaround: 'Estimated Delivery Timeline',
    turnaroundDays: '4-6 Days (Includes Fabric Pickup, Cutting & Stitching)',
    printQuotation: 'Print Invoice',
    checkoutHeading: 'Checkout & Fabric Pickup Setup',
    checkoutSubheading: 'Complete doorstep fabric pickup details, measurements, and instant payment.',
    step1Title: 'Doorstep Fabric Pickup Details',
    step1Sub: 'Address, pickup date & preferred time slot',
    step2Title: 'Measurement Preferences',
    step2Sub: 'Choose how your body measurements will be captured',
    step3Title: 'Payment Gateway Selection',
    step3Sub: 'Google Pay (GPay), UPI ID, Card, or Cash on Pickup',
    pickupAddress: 'Pickup Street Address',
    pickupCity: 'City / Pincode',
    pickupPhone: 'Phone Number',
    pickupDate: 'Pickup Date',
    timeSlot: 'Preferred Time Slot',
    morning: 'Morning (9 AM - 12 PM)',
    afternoon: 'Afternoon (12 PM - 4 PM)',
    evening: 'Evening (4 PM - 8 PM)',
    measureOptionA: 'Schedule Master Tailor Home Visit (Free)',
    measureOptionASub: 'Tailor arrives with sample fitting garments and tape.',
    measureOptionB: 'Mail Sample Garment with Fabric Pickup',
    measureOptionBSub: 'Send a perfect-fitting existing blouse/garment for exact clone sizing.',
    measureOptionC: 'Use Saved Sizing Profile (Chest 36", Waist 30")',
    measureOptionCSub: 'Verified profile from previous order #THY-8842.',
    payGPay: 'Google Pay / GPay',
    payUPI: 'UPI ID / VPA',
    payCard: 'Credit / Debit Card',
    payCOP: 'Cash on Fabric Pickup',
    placeOrderBtn: 'Confirm & Place Bespoke Order',
    orderSuccessTitle: 'Bespoke Order Confirmed!',
    orderRef: 'Tracking Reference:',
    deliveryTimeline: 'Track Live Status:',
    backToStudio: 'Back to Custom Tailoring Studio'
  }
};

const INITIAL_PRODUCT = {
  id: 'thy-blouse-001',
  title: 'Hand-Embroidered Velvet Bridal Blouse',
  category: 'BRIDAL ETHNIC WEAR',
  rating: 4.9,
  reviewsCount: 128,
  baseStitchingPrice: 1500,
  images: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&auto=format&fit=crop&q=80'
  ],
  addons: [
    { id: 'zardosi', name: 'Heavy Hand Zardosi Border Embroidery', price: 850, default: true },
    { id: 'lining', name: 'Pure Cotton Soft Breathable Lining', price: 250, default: true },
    { id: 'latkan', name: 'Custom Matching Latkan & Tassel Attachment', price: 150, default: false },
    { id: 'priority', name: 'Express 48-Hour Priority Stitching', price: 500, default: false }
  ]
};

export default function StitchCartPage() {
  const [lang, setLang] = useState<'EN'>('EN');
  const [activeTab, setActiveTab] = useState<'product' | 'cart' | 'checkout' | 'quotation'>('cart');
  const [selectedImage, setSelectedImage] = useState(INITIAL_PRODUCT.images[0]);

  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    zardosi: true,
    lining: true,
    latkan: false,
    priority: false
  });

  const [cart, setCart] = useState([
    {
      id: 'cart-item-1',
      productId: INITIAL_PRODUCT.id,
      title: 'Hand-Embroidered Velvet Bridal Blouse',
      image: INITIAL_PRODUCT.images[0],
      tailorName: 'Master Tailor Aarav Sharma',
      tailorExperience: '12+ Yrs Exp. (Chennai)',
      quantity: 1,
      stitchingCost: 1500,
      customizations: [
        { name: 'Heavy Hand Zardosi Border Embroidery', cost: 850 },
        { name: 'Pure Cotton Soft Breathable Lining', cost: 250 }
      ],
      savedForLater: false
    }
  ]);

  const [selectedQuotationItem, setSelectedQuotationItem] = useState(cart[0] || null);
  const [couponCode, setCouponCode] = useState('FESTIVETHY15');
  const [appliedDiscount, setAppliedDiscount] = useState(0.15);
  const [couponMsg, setCouponMsg] = useState({ text: '15% Festive Offer FESTIVETHY15 Applied!', type: 'success' });
  const [pickupOption, setPickupOption] = useState('morning');
  const [measurementOption, setMeasurementOption] = useState('optionA');
  const [paymentMethod, setPaymentMethod] = useState('gpay');

  const t = TRANSLATIONS[lang];

  const calculateAddonsSubtotal = () => {
    return INITIAL_PRODUCT.addons.reduce((acc, addon) => {
      return selectedAddons[addon.id] ? acc + addon.price : acc;
    }, 0);
  };

  const calculateProductGrandTotal = () => {
    return INITIAL_PRODUCT.baseStitchingPrice + calculateAddonsSubtotal();
  };

  const handleAddToCart = (shouldRedirect = false) => {
    const customList: { name: string; cost: number }[] = [];
    INITIAL_PRODUCT.addons.forEach(addon => {
      if (selectedAddons[addon.id]) {
        customList.push({ name: addon.name, cost: addon.price });
      }
    });

    const newItem = {
      id: 'cart-item-' + Date.now(),
      productId: INITIAL_PRODUCT.id,
      title: INITIAL_PRODUCT.title,
      image: selectedImage,
      tailorName: 'Master Tailor Aarav Sharma',
      tailorExperience: '12+ Yrs Exp. (Chennai)',
      quantity: 1,
      stitchingCost: INITIAL_PRODUCT.baseStitchingPrice,
      customizations: customList,
      savedForLater: false
    };

    setCart([newItem, ...cart]);
    if (shouldRedirect) {
      setActiveTab('cart');
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleSaveForLater = (id: string) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, savedForLater: !item.savedForLater };
      }
      return item;
    }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = couponCode.trim().toUpperCase();
    if (cleaned === 'FESTIVETHY15') {
      setAppliedDiscount(0.15);
      setCouponMsg({ text: 'FESTIVETHY15 Applied! (15% OFF)', type: 'success' });
    } else if (cleaned === 'TAILOR10') {
      setAppliedDiscount(0.10);
      setCouponMsg({ text: 'TAILOR10 Applied! (10% OFF)', type: 'success' });
    } else {
      setAppliedDiscount(0);
      setCouponMsg({ text: 'Invalid promo code', type: 'error' });
    }
  };

  const handleOpenQuotationPage = (item: typeof cart[0]) => {
    setSelectedQuotationItem(item);
    setActiveTab('quotation');
  };

  const activeCartItems = cart.filter(i => !i.savedForLater);
  const savedCartItems = cart.filter(i => i.savedForLater);

  const calculateItemTotal = (item: typeof cart[0] | null) => {
    if (!item) return 0;
    const addonsSum = item.customizations.reduce((sum, c) => sum + c.cost, 0);
    return (item.stitchingCost + addonsSum) * item.quantity;
  };

  const cartSubtotal = activeCartItems.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  const discountAmount = cartSubtotal * appliedDiscount;
  const fittingFee = activeCartItems.length > 0 ? 150 : 0;
  const estimatedTax = (cartSubtotal - discountAmount) * 0.05;
  const grandTotal = cartSubtotal - discountAmount + fittingFee + estimatedTax;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-16">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('product')}>
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-teal-600/30">
                thy
              </div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t.brandName}
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
              <button
                onClick={() => setActiveTab('product')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'product' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 text-center text-[10px] leading-5 font-bold">1</span>
                <span>{t.navProduct}</span>
              </button>

              <button
                onClick={() => setActiveTab('cart')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 relative ${
                  activeTab === 'cart' || activeTab === 'quotation' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 text-center text-[10px] leading-5 font-bold">2</span>
                <span>{t.navCart}</span>
                {activeCartItems.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'cart' || activeTab === 'quotation' ? 'bg-white text-teal-800' : 'bg-teal-600 text-white'
                  }`}>
                    {activeCartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('checkout')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'checkout' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 text-center text-[10px] leading-5 font-bold">3</span>
                <span>{t.navCheckout}</span>
              </button>
            </nav>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Globe className="w-4 h-4 text-teal-600" />
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as 'EN')}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="EN">English</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{t.cartHeading}</h1>
                <p className="text-xs text-slate-500 mt-1">{t.cartSubheading}</p>
              </div>
              <button 
                onClick={() => setActiveTab('product')}
                className="text-xs text-teal-700 hover:underline flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.continueCustomizing}
              </button>
            </div>

            {activeCartItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t.emptyCartTitle}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">{t.emptyCartSub}</p>
                <button
                  onClick={() => setActiveTab('product')}
                  className="px-6 py-3 bg-teal-600 text-white font-bold text-xs rounded-full hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20"
                >
                  {t.configureNow}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  {activeCartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 hover:border-teal-200/80 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                          <div 
                            onClick={() => setActiveTab('product')}
                            className="relative group cursor-pointer flex-shrink-0"
                            title="Click to view Product Details"
                          >
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-200 group-hover:opacity-85 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-slate-900/30 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h2 
                              onClick={() => setActiveTab('product')}
                              className="text-base font-bold text-slate-900 hover:text-teal-600 cursor-pointer transition-colors flex items-center gap-1.5"
                              title="Click to view Product Details"
                            >
                              <span>{item.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-teal-600" />
                              {t.fabricProvided}
                            </p>
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[11px] text-slate-700 font-medium">
                              <Scissors className="w-3.5 h-3.5 text-teal-600" />
                              <span>{item.tailorName} ({item.tailorExperience})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block">{t.quantity} Total</span>
                            <span className="text-xl font-extrabold text-teal-700">
                              ₹{calculateItemTotal(item)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          onClick={() => handleOpenQuotationPage(item)}
                          className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-teal-700" />
                          <span>{t.viewQuotationBtn}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                        </button>

                        <div className="flex items-center gap-4 text-xs">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t.deleteItem}
                          </button>
                          <button
                            onClick={() => toggleSaveForLater(item.id)}
                            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                          >
                            {t.saveForLater}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-4 space-y-5 sticky top-24">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                      {t.orderSummary}
                    </h2>

                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <label className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-teal-600" />
                        {t.promoLabel}
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="FESTIVETHY15"
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-teal-600"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-slate-800 text-xs font-bold text-white rounded-xl hover:bg-slate-900 transition-colors"
                        >
                          {t.applyBtn}
                        </button>
                      </div>
                      {couponMsg.text && (
                        <p className={`text-[11px] font-semibold ${couponMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {couponMsg.text}
                        </p>
                      )}
                    </form>

                    <div className="space-y-2.5 text-xs text-slate-600 border-t border-b border-slate-200 py-4">
                      <div className="flex justify-between">
                        <span>{t.subtotal}:</span>
                        <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
                      </div>
                      
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>{t.discount}:</span>
                          <span>- ₹{discountAmount.toFixed(0)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>{t.pickupFee}:</span>
                        <span className="font-bold text-slate-900">₹{fittingFee}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>{t.estimatedTax}:</span>
                        <span className="font-bold text-slate-900">₹{estimatedTax.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">{t.grandTotal}</span>
                        <span className="text-2xl font-extrabold text-teal-700">₹{grandTotal.toFixed(0)}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-bold">
                        {t.guaranteedPricing}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('checkout')}
                      className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 text-xs transition-all transform hover:scale-[1.01]"
                    >
                      <span>{t.proceedToCheckout}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}