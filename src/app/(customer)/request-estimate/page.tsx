'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RequestEstimatePage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading...</p>}>
      <RequestEstimateContent />
    </Suspense>
  );
}

function RequestEstimateContent() {
  const searchParams = useSearchParams();
  const tailorName = searchParams.get('tailor') || searchParams.get('shop') || 'your selected tailor';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState('Saree Blouse');
  const [garmentType, setGarmentType] = useState('Bridal Blouse');
  const [urgency, setUrgency] = useState('Standard (5-7 days)');
  const [description, setDescription] = useState('');
  const [measurementType, setMeasurementType] = useState<'profile' | 'manual'>('profile');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sample Saved Measurements from Customer Profile
  const savedMeasurements = {
    bust: '36 in',
    waist: '30 in',
    shoulder: '14.5 in',
    armLength: '10 in',
    neckDepth: '7 in',
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep((prev) => (prev + 1) as 2 | 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-dvh bg-transparent flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-thy-mist text-thy-burgundy rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Estimate Request Sent!</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your request for <span className="font-bold text-slate-800">{garmentType}</span> has been submitted to <span className="font-bold text-slate-800">{tailorName}</span>. You will receive an estimate update in your active requests within 24 hours.
          </p>
          <div className="pt-2">
            <Link
              href="/chat?tailor=t1&from=estimate"
              className="inline-block px-6 py-3 bg-[#5C1A24] text-white font-extrabold text-xs rounded-2xl hover:bg-[#4A1520] transition-all"
            >
              Open chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-transparent text-thy-ink p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Request Custom Garment Estimate</h1>
          <p className="text-xs text-slate-500">Provide design specifications and measurements to receive a precise quote from {tailorName}.</p>
          
          {/* Progress Tracker */}
          <div className="flex items-center gap-2 pt-4">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-[#5C1A24]' : 'bg-slate-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-[#5C1A24]' : 'bg-slate-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-[#5C1A24]' : 'bg-slate-200'}`} />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
            <span className={step >= 1 ? 'text-[#5C1A24]' : ''}>1. Service Details</span>
            <span className={step >= 2 ? 'text-[#5C1A24]' : ''}>2. Measurements</span>
            <span className={step >= 3 ? 'text-[#5C1A24]' : ''}>3. Review & Submit</span>
          </div>
        </div>

        {/* STEP 1: Garment & Service Details */}
        {step === 1 && (
          <form onSubmit={handleNext} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Step 1: Garment & Design Specs</h2>
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Service Category</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#5C1A24]"
              >
                <option value="Saree Blouse">Saree Blouse (₹800 - ₹2500)</option>
                <option value="Salwar / Kurti">Salwar / Kurti (₹600 - ₹1800)</option>
                <option value="Anarkali">Anarkali (₹1500 - ₹4500)</option>
                <option value="Lehenga">Lehenga (₹3000 - ₹12000)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Specific Design Title</label>
              <input
                type="text"
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                placeholder="e.g. Deep Neck Velvet Bridal Blouse"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#5C1A24]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Expected Delivery Timeline</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#5C1A24]"
              >
                <option value="Standard (5-7 days)">Standard (5-7 business days)</option>
                <option value="Express (2-3 days)">Express Delivery (2-3 business days)</option>
                <option value="Flexible (7+ days)">Flexible (7+ days)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customization Instructions & Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Mention preferred piping work, lining materials, back hook vs side zip preference..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#5C1A24]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5C1A24] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#4A1520]"
              >
                Next: Measurements →
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Measurements */}
        {step === 2 && (
          <form onSubmit={handleNext} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Step 2: Provide Body Measurements</h2>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMeasurementType('profile')}
                className={`flex-1 p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                  measurementType === 'profile' ? 'border-[#5C1A24] bg-thy-mist/50 text-[#5C1A24]' : 'border-slate-200 text-slate-600'
                }`}
              >
                <p className="font-extrabold text-slate-900">👤 Saved Profile</p>
                <p className="text-[10px] text-slate-500 font-normal">Use your saved THY size profile</p>
              </button>

              <button
                type="button"
                onClick={() => setMeasurementType('manual')}
                className={`flex-1 p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                  measurementType === 'manual' ? 'border-[#5C1A24] bg-thy-mist/50 text-[#5C1A24]' : 'border-slate-200 text-slate-600'
                }`}
              >
                <p className="font-extrabold text-slate-900">✏️ Custom Input</p>
                <p className="text-[10px] text-slate-500 font-normal">Enter specific dimensions now</p>
              </button>
            </div>

            {measurementType === 'profile' ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-800">Attached Profile Measurements:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-100"><span className="text-slate-400">Bust:</span> {savedMeasurements.bust}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100"><span className="text-slate-400">Waist:</span> {savedMeasurements.waist}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100"><span className="text-slate-400">Shoulder:</span> {savedMeasurements.shoulder}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100"><span className="text-slate-400">Arm Length:</span> {savedMeasurements.armLength}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100"><span className="text-slate-400">Neck Depth:</span> {savedMeasurements.neckDepth}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bust (in inches)</label>
                  <input type="text" placeholder="e.g. 36" className="w-full p-2.5 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Waist (in inches)</label>
                  <input type="text" placeholder="e.g. 30" className="w-full p-2.5 border rounded-xl bg-slate-50" />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5C1A24] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#4A1520]"
              >
                Next: Review Request →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Summary & Final Submission */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Step 3: Review & Send Request</h2>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Garment Type</span>
                <span className="font-bold text-slate-900">{garmentType} ({selectedService})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Timeline</span>
                <span className="font-bold text-slate-900">{urgency}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Measurement Source</span>
                <span className="font-bold text-[#5C1A24]">{measurementType === 'profile' ? 'Saved Size Profile' : 'Custom Input'}</span>
              </div>
              {description && (
                <div className="pt-1">
                  <span className="text-slate-500 font-medium block mb-0.5">Custom Notes:</span>
                  <p className="text-slate-800 italic bg-white p-2 rounded-xl border border-slate-100">{description}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5C1A24] text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-[#4A1520]"
              >
                Submit Estimate Request
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}