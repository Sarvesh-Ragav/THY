'use client';

import React, { useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';

interface NewRequest {
  id: string;
  customerName: string;
  garmentType: string;
  category: string;
  requestDate: string;
  fabricProvided: boolean;
  fabricDetails: string;
  measurements: string;
  budgetEstimate: string;
  designPreview: string;
  notes: string;
  status: 'Pending Review' | 'Quoted' | 'Rejected';
}

const initialRequests: NewRequest[] = [
  {
    id: 'REQ-1042',
    customerName: 'Aarav Sharma',
    garmentType: 'Sherwani with Safa',
    category: 'Bridalwear',
    requestDate: '2026-09-10',
    fabricProvided: true,
    fabricDetails: 'Silk Brocade provided by customer',
    measurements: 'Chest: 38", Waist: 32", Shoulder: 17.5", Length: 44"',
    budgetEstimate: '₹10,000 - ₹14,000',
    designPreview: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&auto=format&fit=crop',
    notes: 'Needs heavy embroidery on collar and cuffs for wedding on Oct 5.',
    status: 'Pending Review',
  },
  {
    id: 'REQ-1045',
    customerName: 'Ananya Iyer',
    garmentType: 'Indo-Western Crop Top & Skirt',
    category: 'Ethnicwear',
    requestDate: '2026-09-11',
    fabricProvided: false,
    fabricDetails: 'Tailor to source organza & satin',
    measurements: 'Bust: 34", Waist: 28", Skirt Length: 40"',
    budgetEstimate: '₹6,000 - ₹8,000',
    designPreview: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop',
    notes: 'Pastel shade preference. Needs delivery before Sept 25.',
    status: 'Pending Review',
  },
];

export default function NewRequestsPage() {
  const [requests, setRequests] = useState<NewRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<NewRequest | null>(null);
  
  // Quotation form states
  const [quotedAmount, setQuotedAmount] = useState<string>('');
  const [estimatedDays, setEstimatedDays] = useState<string>('');
  const [quoteNotes, setQuoteNotes] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !quotedAmount || !estimatedDays) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: 'Quoted' } : req
        )
      );
      showToast(`Quotation sent to ${selectedRequest.customerName} (₹${quotedAmount})`);
      setSelectedRequest(null);
      setQuotedAmount('');
      setEstimatedDays('');
      setQuoteNotes('');
    }, 400);
  };

  const handleRejectRequest = (requestId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setSelectedRequest(null);
      showToast(`Request ${requestId} has been declined.`);
    }, 400);
  };

  return (
    <TailorPage
      title="New Order Requests"
      description="Review incoming custom tailoring requests and send price quotations."
    >
      <div className="space-y-6">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-thy-mist border border-thy-burgundy text-thy-ink px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-thy-burgundy font-bold">✕</button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-6 text-center text-xs text-thy-burgundy font-semibold animate-pulse">
          ⏳ Processing quotation update...
        </div>
      )}

      {/* Requests List */}
      {!isLoading && requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="thy-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-thy-burgundy/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={req.designPreview}
                  alt={req.garmentType}
                  className="w-16 h-16 rounded-xl object-cover border border-thy-burgundy/10"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-thy-subtle">{req.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Quoted'
                          ? 'bg-thy-mist text-thy-burgundy border border-thy-burgundy/20'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-thy-ink">{req.garmentType}</h3>
                  <p className="text-xs text-thy-muted">
                    Customer: <span className="font-semibold text-thy-ink">{req.customerName}</span> | Estimated Budget: <span className="font-semibold text-thy-ink">{req.budgetEstimate}</span>
                  </p>
                  <p className="text-[11px] text-thy-subtle">Requested on: {req.requestDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleRejectRequest(req.id)}
                  className="px-3 py-2 bg-thy-mist text-thy-muted rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="px-4 py-2 bg-thy-burgundy text-white rounded-xl text-xs font-semibold hover:bg-thy-brand-active transition-colors"
                >
                  {req.status === 'Quoted' ? 'View Sent Quote' : 'Create Quotation'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="thy-card p-12 text-center space-y-2">
            <div className="text-3xl">📋</div>
            <h3 className="text-base font-bold text-thy-ink">No new request inquiries</h3>
            <p className="text-xs text-thy-subtle max-w-sm mx-auto">
              New customer tailoring requests will show up here for price quotes.
            </p>
          </div>
        )
      )}

      {/* CREATE QUOTATION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="thy-card p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-thy-subtle">{selectedRequest.id}</span>
                <h2 className="font-bold text-thy-ink text-base">Send Quotation to {selectedRequest.customerName}</h2>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-thy-subtle hover:text-thy-muted font-bold text-lg">
                ✕
              </button>
            </div>

            {/* Request Summary */}
            <div className="bg-thy-mist p-4 rounded-xl space-y-2 text-xs text-thy-muted">
              <p><strong>Garment:</strong> {selectedRequest.garmentType} ({selectedRequest.category})</p>
              <p><strong>Fabric Details:</strong> {selectedRequest.fabricDetails}</p>
              <p><strong>Measurements:</strong> {selectedRequest.measurements}</p>
              <p><strong>Customer Notes:</strong> {selectedRequest.notes}</p>
            </div>

            {/* Quote Form */}
            <form onSubmit={handleSendQuotation} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-thy-muted mb-1">Quoted Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 8500"
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-thy-muted mb-1">Estimated Days to Complete</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-thy-muted mb-1">Notes / Terms for Customer (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Price includes fitting & alteration charges..."
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-thy-mist text-thy-muted rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-thy-burgundy text-white rounded-xl font-semibold hover:bg-thy-brand-active"
                >
                  Send Formal Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </TailorPage>
  );
}