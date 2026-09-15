'use client';

import React, { Suspense, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, CreditCard, Lock, ArrowRight, AlertCircle, Loader2, MapPin, Scissors, ShoppingBag } from 'lucide-react';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { findThread } from '@/lib/c31';
import { createPaymentOrder, formatPaise, loadRazorpayCheckout, quoteToPaise, verifyPayment } from '@/lib/payment-api';

export default function CheckoutPaymentPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-center text-xs text-slate-500 font-medium">Loading checkout summary...</p>}>
        <PaymentStep />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function PaymentStep() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, accessToken } = useTailorSession();
  const { state } = useC31();
  
  const threadParam = searchParams.get('thread') || '';
  const thread = findThread(state, threadParam);
  
  const [status, setStatus] = useState<'idle' | 'opening' | 'verifying' | 'failed' | 'cancelled'>('idle');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [message, setMessage] = useState<string | null>(null);
  
  const checkoutKeyRef = useRef<string | null>(null);
  const amountPaise = quoteToPaise(thread?.quotation?.price);

  const handleProceedToPayment = async () => {
    if (!accessToken) { 
      setStatus('failed'); 
      setMessage('Your session has expired. Please log in again.'); 
      return; 
    }
    if (!thread || !amountPaise || !state.checkoutAddress) { 
      setStatus('failed'); 
      setMessage('A fixed quotation and delivery address are required before payment.'); 
      return; 
    }
    
    setStatus('opening'); 
    setMessage(null);
    
    try {
      const checkoutKey = checkoutKeyRef.current ?? crypto.randomUUID();
      checkoutKeyRef.current = checkoutKey;
      
      const { order, checkout } = await createPaymentOrder(accessToken, { 
        checkoutKey, 
        sourceThreadId: thread.id, 
        tailorName: thread.tailorName, 
        garmentName: thread.request?.garment || 'Custom outfit', 
        deliveryAddress: state.checkoutAddress, 
        amountPaise 
      });
      
      await loadRazorpayCheckout();
      if (!window.Razorpay) throw new Error('Razorpay Checkout did not load.');
      
      new window.Razorpay({
        key: checkout.keyId, 
        amount: checkout.amountPaise, 
        currency: checkout.currency, 
        name: 'THY Tailoring Hub', 
        description: order.garmentName, 
        order_id: checkout.razorpayOrderId,
        prefill: { 
          contact: session.identifier, 
          email: session.customerProfile?.email, 
          name: session.customerProfile?.fullName 
        }, 
        theme: { color: '#26988a' },
        modal: { 
          ondismiss: () => { 
            setStatus('cancelled'); 
            setMessage('Payment was cancelled. Your order remains pending and has not been marked paid.'); 
          } 
        },
        handler: async (response) => { 
          setStatus('verifying'); 
          try { 
            const verified = await verifyPayment(accessToken, order.id, response); 
            router.push(`/checkout/confirmation?order=${encodeURIComponent(verified.order.id)}`); 
          } catch (error) { 
            setStatus('failed'); 
            setMessage(error instanceof Error ? error.message : 'Payment could not be verified. Your order remains pending.'); 
          } 
        },
      }).open();
    } catch (error) { 
      setStatus('failed'); 
      setMessage(error instanceof Error ? error.message : 'Unable to start payment.'); 
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-slate-800 font-sans">
      
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <span className="text-[11px] uppercase tracking-widest text-[#26988a] font-extrabold flex items-center gap-1">
          <Lock className="w-3 h-3" /> Step 3 of 3 • Review & Payment
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Order Summary & Payment
        </h1>
        <p className="text-xs text-slate-500">
          Review your bespoke tailoring quotation and select your preferred payment mode.
        </p>
      </div>

      {/* Order Summary Breakdown Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShoppingBag className="w-4 h-4 text-[#26988a]" /> Custom Outfit Breakdown
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold text-slate-900 block text-sm">{thread?.request?.garment || 'Custom Bespoke Outfit'}</span>
              <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                <Scissors className="w-3.5 h-3.5 text-[#26988a]" /> Tailor: {thread?.tailorName || 'Master Craftsman'}
              </span>
            </div>
            <span className="font-extrabold text-slate-900 text-sm">{formatPaise(amountPaise ?? 0)}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Delivery Address</span>
            <p className="text-slate-700 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#26988a] shrink-0 mt-0.5" />
              <span>{state.checkoutAddress || 'No address specified'}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-black">
            <span className="text-slate-800">Total Quotation Amount</span>
            <span className="text-[#26988a] text-lg">{formatPaise(amountPaise ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-4 h-4 text-[#26988a]" /> Select Payment Gateway Mode
        </h3>

        <div className="space-y-2.5">
          <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedMethod === 'upi' ? 'border-[#26988a] bg-teal-50/40 ring-1 ring-[#26988a]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="accent-[#26988a]" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">UPI / Google Pay / PhonePe / Paytm</span>
                <span className="text-[11px] text-slate-500">Instant transfer with zero convenience fees</span>
              </div>
            </div>
          </label>

          <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedMethod === 'card' ? 'border-[#26988a] bg-teal-50/40 ring-1 ring-[#26988a]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="accent-[#26988a]" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Credit / Debit Card</span>
                <span className="text-[11px] text-slate-500">Visa, MasterCard, RuPay, and American Express</span>
              </div>
            </div>
          </label>

          <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedMethod === 'netbanking' ? 'border-[#26988a] bg-teal-50/40 ring-1 ring-[#26988a]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" checked={selectedMethod === 'netbanking'} onChange={() => setSelectedMethod('netbanking')} className="accent-[#26988a]" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Net Banking</span>
                <span className="text-[11px] text-slate-500">All major Indian banks supported</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 flex items-center gap-2 text-xs text-teal-800">
        <ShieldCheck className="w-5 h-5 text-[#26988a] shrink-0" />
        <span>THY Secure Guarantee: 100% fitting adjustment support included with every confirmed order.</span>
      </div>

      {/* Error or Cancelled Status Messages */}
      {message && (
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 ${
          status === 'failed' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Proceed to Payment Button */}
      <button 
        type="button" 
        disabled={status === 'opening' || status === 'verifying'} 
        onClick={() => void handleProceedToPayment()} 
        className="w-full py-4 bg-[#26988a] hover:bg-[#22877b] disabled:bg-slate-300 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        {status === 'opening' || status === 'verifying' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{status === 'opening' ? 'Opening Secure Payment...' : 'Verifying Payment...'}</span>
          </>
        ) : (
          <>
            <span>Proceed to Payment • {formatPaise(amountPaise ?? 0)}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

    </main>
  );
}