'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Scissors,
  Tag,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';
import { placeCustomerWorkspaceOrder } from '@/lib/notifications';

const INITIAL_CART = [
  {
    id: 'cart-item-1',
    title: 'Hand-Embroidered Velvet Bridal Blouse',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    tailorName: 'Aarav Sharma',
    tailorExperience: '12+ yrs · Chennai',
    quantity: 1,
    stitchingCost: 1500,
    customizations: [
      { name: 'Heavy hand zardosi border', cost: 850 },
      { name: 'Cotton lining', cost: 250 },
    ],
    savedForLater: false,
  },
];

const ghostBtn =
  'inline-flex items-center justify-center min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] border border-thy-burgundy/20 bg-thy-cream text-thy-ink transition-colors hover:border-thy-burgundy/40 hover:text-thy-burgundy cursor-pointer';

const leatherBtn =
  'hero-leather-btn inline-flex items-center justify-center min-h-11 px-5 text-[11px] font-semibold uppercase tracking-[0.16em]';

type CartItem = (typeof INITIAL_CART)[number];
type Step = 'cart' | 'quotation' | 'checkout' | 'done';

export default function StitchCartPage() {
  const { session, updateSession } = useTailorSession();
  const { label } = useCustomerLocation();
  const [step, setStep] = useState<Step>('cart');
  const [cart, setCart] = useState(INITIAL_CART);
  const [quoteItem, setQuoteItem] = useState<CartItem | null>(INITIAL_CART[0] ?? null);
  const [couponCode, setCouponCode] = useState('FESTIVETHY15');
  const [appliedDiscount, setAppliedDiscount] = useState(0.15);
  const [couponMsg, setCouponMsg] = useState({ text: 'FESTIVETHY15 · 15% off', type: 'success' });
  const [pickupOption, setPickupOption] = useState('morning');
  const [measurementOption, setMeasurementOption] = useState('visit');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [pickupAddress, setPickupAddress] = useState('');

  useEffect(() => {
    const saved = [session.customerProfile?.address, label || session.customerProfile?.city]
      .filter(Boolean)
      .join(', ');
    if (saved) setPickupAddress((current) => current || saved);
  }, [session.customerProfile, label]);

  const activeCartItems = cart.filter((item) => !item.savedForLater);
  const savedCartItems = cart.filter((item) => item.savedForLater);

  const itemTotal = (item: CartItem) => {
    const extras = item.customizations.reduce((sum, c) => sum + c.cost, 0);
    return (item.stitchingCost + extras) * item.quantity;
  };

  const cartSubtotal = activeCartItems.reduce((acc, item) => acc + itemTotal(item), 0);
  const discountAmount = cartSubtotal * appliedDiscount;
  const fittingFee = activeCartItems.length > 0 ? 150 : 0;
  const estimatedTax = (cartSubtotal - discountAmount) * 0.05;
  const grandTotal = cartSubtotal - discountAmount + fittingFee + estimatedTax;

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
    );
  };

  const applyCoupon = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = couponCode.trim().toUpperCase();
    if (cleaned === 'FESTIVETHY15') {
      setAppliedDiscount(0.15);
      setCouponMsg({ text: 'FESTIVETHY15 · 15% off', type: 'success' });
    } else if (cleaned === 'TAILOR10') {
      setAppliedDiscount(0.1);
      setCouponMsg({ text: 'TAILOR10 · 10% off', type: 'success' });
    } else {
      setAppliedDiscount(0);
      setCouponMsg({ text: 'That code is not valid', type: 'error' });
    }
  };

  const steps = [
    { id: 'cart' as const, label: 'Cart' },
    { id: 'quotation' as const, label: 'Quote' },
    { id: 'checkout' as const, label: 'Checkout' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-thy-burgundy font-semibold">Bespoke</p>
      <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl leading-[0.95] text-thy-ink"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            {step === 'done' ? 'Order placed' : step === 'checkout' ? 'Checkout' : step === 'quotation' ? 'Quotation' : 'Cart'}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-thy-muted">
            Review the stitch, open the quotation, then confirm pickup and payment.
          </p>
        </div>
        <Link href="/stitch-your-outfit" className={`${ghostBtn} shrink-0 self-start`}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Keep customizing
        </Link>
      </div>
      <div className="thy-divider-glow mt-4 max-w-md" />

      {step !== 'done' && (
        <ol className="mt-8 flex gap-2 overflow-x-auto thy-scroll-x">
          {steps.map((entry, index) => {
            const current = step === entry.id;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (entry.id === 'checkout' && activeCartItems.length === 0) return;
                    if (entry.id === 'quotation' && !quoteItem && activeCartItems[0]) {
                      setQuoteItem(activeCartItems[0]);
                    }
                    setStep(entry.id);
                  }}
                  className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] border whitespace-nowrap ${
                    current
                      ? 'bg-thy-burgundy text-white border-thy-burgundy'
                      : 'border-thy-burgundy/20 bg-thy-cream text-thy-ink hover:border-thy-burgundy/40'
                  }`}
                >
                  {index + 1}. {entry.label}
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {step === 'cart' && (
        <div className="mt-8">
          {activeCartItems.length === 0 ? (
            <div className="thy-card p-10 text-center max-w-lg mx-auto space-y-3">
              <ShoppingBag className="w-8 h-8 mx-auto text-thy-burgundy" />
              <h2 className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Your cart is empty
              </h2>
              <p className="text-sm text-thy-muted">Build a custom look, then it will appear here with the quotation.</p>
              <Link href="/stitch-your-outfit" className={`${leatherBtn} mt-2`}>
                Stitch an outfit
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-4">
                {activeCartItems.map((item) => (
                  <article key={item.id} className="thy-card p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img src={item.image} alt="" className="w-full sm:w-28 h-36 sm:h-28 object-cover bg-thy-mist" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <h2 className="text-xl leading-tight text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                          {item.title}
                        </h2>
                        <p className="text-xs text-thy-muted flex items-center gap-1.5">
                          <Scissors className="w-3.5 h-3.5" />
                          {item.tailorName} · {item.tailorExperience}
                        </p>
                        <p className="text-xs text-thy-muted flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          Doorstep fabric pickup
                        </p>
                        <ul className="text-xs text-thy-muted space-y-0.5">
                          {item.customizations.map((extra) => (
                            <li key={extra.name}>
                              {extra.name} · ₹{extra.cost}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                        <div className="inline-flex items-center border border-thy-burgundy/20">
                          <button type="button" className="w-9 h-9 inline-flex items-center justify-center" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button type="button" className="w-9 h-9 inline-flex items-center justify-center" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xl text-thy-burgundy" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                          ₹{itemTotal(item)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-thy-burgundy/10 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        className={ghostBtn}
                        onClick={() => {
                          setQuoteItem(item);
                          setStep('quotation');
                        }}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        View quotation
                      </button>
                      <div className="flex gap-4 text-xs">
                        <button
                          type="button"
                          className="text-rose-700 font-semibold inline-flex items-center gap-1"
                          onClick={() => setCart((prev) => prev.filter((entry) => entry.id !== item.id))}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                        <button
                          type="button"
                          className="text-thy-muted hover:text-thy-ink"
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((entry) =>
                                entry.id === item.id ? { ...entry, savedForLater: !entry.savedForLater } : entry
                              )
                            )
                          }
                        >
                          Save for later
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {savedCartItems.length > 0 && (
                  <div className="thy-card p-5 space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-thy-burgundy">Saved for later</p>
                    {savedCartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                        <p className="text-thy-ink">{item.title}</p>
                        <button
                          type="button"
                          className="text-[11px] uppercase tracking-[0.14em] font-semibold text-thy-burgundy"
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((entry) => (entry.id === item.id ? { ...entry, savedForLater: false } : entry))
                            )
                          }
                        >
                          Move to cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="lg:col-span-4 lg:sticky lg:top-24">
                <div className="thy-card p-5 sm:p-6 space-y-4">
                  <h2 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    Order summary
                  </h2>
                  <form onSubmit={applyCoupon} className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.14em] font-semibold text-thy-muted flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Promo code
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="thy-input uppercase"
                        placeholder="FESTIVETHY15"
                      />
                      <button type="submit" className={ghostBtn}>
                        Apply
                      </button>
                    </div>
                    {couponMsg.text && (
                      <p className={`text-xs ${couponMsg.type === 'error' ? 'text-rose-700' : 'text-thy-burgundy'}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </form>
                  <dl className="space-y-2 text-sm border-t border-b border-thy-burgundy/10 py-4">
                    <div className="flex justify-between text-thy-muted">
                      <dt>Subtotal</dt>
                      <dd className="text-thy-ink font-semibold">₹{cartSubtotal}</dd>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-thy-burgundy">
                        <dt>Discount</dt>
                        <dd>- ₹{discountAmount.toFixed(0)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-thy-muted">
                      <dt>Pickup & fitting</dt>
                      <dd className="text-thy-ink font-semibold">₹{fittingFee}</dd>
                    </div>
                    <div className="flex justify-between text-thy-muted">
                      <dt>GST (5%)</dt>
                      <dd className="text-thy-ink font-semibold">₹{estimatedTax.toFixed(0)}</dd>
                    </div>
                  </dl>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">Total</p>
                      <p className="text-3xl text-thy-burgundy" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                        ₹{grandTotal.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <button type="button" className={`${leatherBtn} w-full`} onClick={() => setStep('checkout')}>
                    Continue to checkout
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      )}

      {step === 'quotation' && quoteItem && (
        <section className="mt-8 max-w-2xl space-y-4">
          <article className="thy-card p-6 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-thy-burgundy">Quotation</p>
            <h2 className="text-2xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {quoteItem.title}
            </h2>
            <p className="text-sm text-thy-muted">
              {quoteItem.tailorName} · {quoteItem.tailorExperience}
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-thy-muted">Base stitching</dt>
                <dd className="font-semibold">₹{quoteItem.stitchingCost}</dd>
              </div>
              {quoteItem.customizations.map((extra) => (
                <div key={extra.name} className="flex justify-between">
                  <dt className="text-thy-muted">{extra.name}</dt>
                  <dd className="font-semibold">₹{extra.cost}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-thy-burgundy/10 pt-3">
                <dt className="font-semibold">Unit total × {quoteItem.quantity}</dt>
                <dd className="text-xl text-thy-burgundy" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                  ₹{itemTotal(quoteItem)}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-thy-muted">Estimated turnaround 4–6 days, including fabric pickup.</p>
          </article>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={ghostBtn} onClick={() => setStep('cart')}>
              Back to cart
            </button>
            <button type="button" className={leatherBtn} onClick={() => setStep('checkout')}>
              Proceed to checkout
            </button>
          </div>
        </section>
      )}

      {step === 'checkout' && (
        <form
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          onSubmit={(event) => {
            event.preventDefault();
            const first = quoteItem || activeCartItems[0];
            if (first) {
              updateSession((current) =>
                placeCustomerWorkspaceOrder(current, {
                  title: first.title,
                  tailorName: first.tailorName,
                  location: first.tailorExperience,
                  total: Math.round(grandTotal),
                  paymentMode:
                    paymentMethod === 'cash' ? 'Cash on fabric pickup' : paymentMethod === 'card' ? 'Card' : 'UPI / GPay',
                  deliveryAddress: pickupAddress || current.customerProfile?.address || current.selectedLocation || '',
                  fabric: first.customizations.map((extra) => extra.name).join(', '),
                  pickupSlot: pickupOption,
                })
              );
            }
            setStep('done');
          }}
        >
          <div className="lg:col-span-8 space-y-4">
            <section className="thy-card p-5 sm:p-6 space-y-4">
              <h2 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Fabric pickup
              </h2>
              <label className="block text-sm text-thy-ink">
                Address
                <textarea
                  required
                  className="thy-input mt-1 min-h-24"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Street, city, pincode"
                />
              </label>
              <div className="grid sm:grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Morning 9–12' },
                  { id: 'afternoon', label: 'Afternoon 12–4' },
                  { id: 'evening', label: 'Evening 4–8' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPickupOption(slot.id)}
                    className={`min-h-11 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] border ${
                      pickupOption === slot.id
                        ? 'bg-thy-burgundy text-white border-thy-burgundy'
                        : 'border-thy-burgundy/20 text-thy-ink hover:border-thy-burgundy/40'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="thy-card p-5 sm:p-6 space-y-3">
              <h2 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Measurements
              </h2>
              {[
                { id: 'visit', label: 'Home visit', note: 'Tailor brings samples and tape.' },
                { id: 'sample', label: 'Mail a sample garment', note: 'Clone a piece that already fits.' },
                { id: 'saved', label: 'Use saved profile', note: 'Chest 36", waist 30" from order THY-8842.' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMeasurementOption(option.id)}
                  className={`w-full text-left p-4 border ${
                    measurementOption === option.id ? 'border-thy-burgundy bg-thy-mist/50' : 'border-thy-burgundy/15 hover:border-thy-burgundy/35'
                  }`}
                >
                  <p className="text-sm font-semibold text-thy-ink">{option.label}</p>
                  <p className="text-xs text-thy-muted mt-0.5">{option.note}</p>
                </button>
              ))}
            </section>

            <section className="thy-card p-5 sm:p-6 space-y-3">
              <h2 className="text-xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                Payment
              </h2>
              {[
                { id: 'gpay', label: 'Google Pay / UPI' },
                { id: 'card', label: 'Credit or debit card' },
                { id: 'cash', label: 'Cash on fabric pickup' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full text-left px-4 py-3 border text-sm font-semibold ${
                    paymentMethod === method.id ? 'border-thy-burgundy bg-thy-mist/50' : 'border-thy-burgundy/15 hover:border-thy-burgundy/35'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </section>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="thy-card p-6 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-thy-subtle">Payable now</p>
              <p className="text-3xl text-thy-burgundy" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                ₹{grandTotal.toFixed(0)}
              </p>
              <p className="text-xs text-thy-muted">{activeCartItems.length} garment{activeCartItems.length === 1 ? '' : 's'} · {pickupOption} pickup</p>
              <button type="submit" className={`${leatherBtn} w-full`}>
                Place order
              </button>
              <button type="button" className={`${ghostBtn} w-full`} onClick={() => setStep('cart')}>
                Back to cart
              </button>
            </div>
          </aside>
        </form>
      )}

      {step === 'done' && (
        <section className="mt-8 max-w-lg thy-card p-8 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-thy-burgundy">Confirmed</p>
          <h2 className="text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Your stitch is in motion
          </h2>
          <p className="text-sm text-thy-muted">
            Pickup is scheduled for the {pickupOption} slot. Follow progress and alerts from My Orders and Notifications.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/my-orders" className={leatherBtn}>
              My orders
            </Link>
            <Link href="/" className={ghostBtn}>
              Back home
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
