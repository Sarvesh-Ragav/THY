'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { TailorOrderRequest } from '@/lib/tailor-session';

export default function NewOrderRequestsPage() {
  const { session, updateSession } = useTailorSession();
  const [selectedRequest, setSelectedRequest] = useState<TailorOrderRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenQuoteModal = (req: TailorOrderRequest) => {
    setSelectedRequest(req);
    setQuotePrice(req.quote?.price ?? '');
    setEstimatedDays(req.quote?.estimatedDays ?? '');
    setNotes(req.quote?.notes ?? '');
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    updateSession({
      requests: session.requests.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: 'Quotation Submitted',
              quote: {
                price: quotePrice,
                estimatedDays,
                notes,
              },
            }
          : request
      ),
    });
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Order Requests</h1>
          <p className="text-sm text-gray-600">Review incoming customer requirements and submit tailored price quotes.</p>
        </div>
        <Link
          href="/tailor-dashboard"
          className="text-sm font-semibold text-[#00c9b7] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {session.requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-semibold text-gray-400">{req.id}</span>
                  <h3 className="text-lg font-bold text-gray-900">{req.garmentType}</h3>
                  <p className="text-sm text-gray-600">Customer: <span className="font-medium text-gray-800">{req.customerName}</span></p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  req.status === 'Pending Quotation'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                <p><strong>Fabric Info:</strong> {req.fabricProvided}</p>
                <p><strong>Measurements:</strong> {req.measurements}</p>
                <p><strong>Special Notes:</strong> {req.requirements}</p>
                {req.quote && (
                  <p><strong>Quoted:</strong> ₹{req.quote.price} · {req.quote.estimatedDays} days</p>
                )}
              </div>
            </div>

            {req.status === 'Pending Quotation' ? (
              <button
                onClick={() => handleOpenQuoteModal(req)}
                className="w-full py-2.5 bg-[#00c9b7] text-white font-semibold rounded-xl text-sm hover:bg-[#00b5a4] transition-colors"
              >
                Review & Provide Quotation
              </button>
            ) : (
              <div className="w-full py-2 bg-gray-50 text-gray-500 text-center font-medium rounded-xl text-xs">
                Quotation Sent – Awaiting Customer Response
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-gray-900 text-lg">Provide Quotation - {selectedRequest.id}</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimated Price (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimated Completion (Days)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes for Customer
                </label>
                <textarea
                  rows={3}
                  placeholder="Include details on fabric sourcing, stitching timeline, fittings, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4]"
                >
                  Submit Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
