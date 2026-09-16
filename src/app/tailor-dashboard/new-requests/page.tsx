'use client';

import React, { useMemo, useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import type { TailorOrderRequest } from '@/lib/tailor-session';
import { requestToOrder, visibleRequests } from '@/lib/tailor-studio';
import { recordQuotationForCustomer } from '@/lib/notifications';
import { addStudioNotification } from '@/lib/tailor-studio';

export default function NewRequestsPage() {
  const { session, updateSession } = useTailorSession();
  const requests = useMemo(() => visibleRequests(session.requests), [session.requests]);
  const [selectedRequest, setSelectedRequest] = useState<TailorOrderRequest | null>(null);
  const [quotedAmount, setQuotedAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  const persistRequests = (next: TailorOrderRequest[], extra?: Partial<typeof session>) => {
    updateSession({ requests: next, ...extra });
  };

  const handleSendQuotation = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRequest || !quotedAmount || !estimatedDays) return;
    const price = Number(quotedAmount);
    const days = Number(estimatedDays);
    const nextRequest: TailorOrderRequest = {
      ...selectedRequest,
      status: 'Quotation Submitted',
      quote: { price: quotedAmount, estimatedDays, notes: quoteNotes },
    };
    const alreadyOrdered = session.orders.some((order) => order.customerName === selectedRequest.customerName && order.garmentType === selectedRequest.garmentType);
    const nextOrders = alreadyOrdered
      ? session.orders
      : [requestToOrder(selectedRequest, price, days), ...session.orders];
    persistRequests(
      session.requests.map((request) => (request.id === selectedRequest.id ? nextRequest : request)),
      {
        orders: nextOrders,
        ...recordQuotationForCustomer(session, {
          garmentType: selectedRequest.garmentType,
          customerName: selectedRequest.customerName,
          amount: quotedAmount,
        }),
      }
    );
    showToast(`Quotation sent to ${selectedRequest.customerName} (₹${quotedAmount})`);
    setSelectedRequest(null);
    setQuotedAmount('');
    setEstimatedDays('');
    setQuoteNotes('');
  };

  const handleRejectRequest = (requestId: string) => {
    const request = session.requests.find((item) => item.id === requestId);
    persistRequests(
      session.requests.map((item) => (item.id === requestId ? { ...item, status: 'Declined' } : item)),
      {
        notifications: addStudioNotification(session.notifications, {
          type: 'system',
          title: 'Request declined',
          description: request ? `${request.garmentType} from ${request.customerName} was declined.` : `Request ${requestId} declined.`,
          linkUrl: '/tailor-dashboard/new-requests',
        }),
      }
    );
    setSelectedRequest(null);
    showToast(`Request ${requestId} has been declined.`);
  };

  return (
    <TailorPage
      title="New Order Requests"
      description="Review incoming custom tailoring requests and send price quotations."
    >
      <div className="space-y-6">
        {toastMessage ? (
          <div className="bg-thy-mist border border-thy-burgundy text-thy-ink px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>{toastMessage}</span>
            <button type="button" onClick={() => setToastMessage(null)} className="text-thy-burgundy font-bold">
              ✕
            </button>
          </div>
        ) : null}

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="thy-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  {req.designPreview ? (
                    <img
                      src={req.designPreview}
                      alt={req.garmentType}
                      className="w-16 h-16 rounded-xl object-cover border border-thy-burgundy/10"
                    />
                  ) : null}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-thy-subtle">{req.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Quotation Submitted'
                            ? 'bg-thy-mist text-thy-burgundy border border-thy-burgundy/20'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-thy-ink">{req.garmentType}</h3>
                    <p className="text-xs text-thy-muted">
                      Customer: <span className="font-semibold text-thy-ink">{req.customerName}</span>
                      {req.budgetEstimate ? (
                        <>
                          {' '}
                          | Budget: <span className="font-semibold text-thy-ink">{req.budgetEstimate}</span>
                        </>
                      ) : null}
                    </p>
                    {req.requestDate ? <p className="text-[11px] text-thy-subtle">Requested on: {req.requestDate}</p> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {req.status === 'Pending Quotation' ? (
                    <button
                      type="button"
                      onClick={() => handleRejectRequest(req.id)}
                      className="px-3 py-2 bg-thy-mist text-thy-muted rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-600"
                    >
                      Decline
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRequest(req);
                      setQuotedAmount(req.quote?.price || '');
                      setEstimatedDays(req.quote?.estimatedDays || '');
                      setQuoteNotes(req.quote?.notes || '');
                    }}
                    className="px-4 py-2 bg-thy-burgundy text-white rounded-xl text-xs font-semibold hover:bg-thy-brand-active"
                  >
                    {req.status === 'Quotation Submitted' ? 'View Sent Quote' : 'Create Quotation'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="thy-card p-12 text-center space-y-2">
            <h3 className="text-base font-bold text-thy-ink">No new request inquiries</h3>
            <p className="text-xs text-thy-subtle max-w-sm mx-auto">
              New customer tailoring requests will show up here for price quotes.
            </p>
          </div>
        )}

        {selectedRequest ? (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="thy-card p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold text-thy-subtle">{selectedRequest.id}</span>
                  <h2 className="font-bold text-thy-ink text-base">Send Quotation to {selectedRequest.customerName}</h2>
                </div>
                <button type="button" onClick={() => setSelectedRequest(null)} className="text-thy-subtle font-bold text-lg">
                  ✕
                </button>
              </div>
              <div className="bg-thy-mist p-4 rounded-xl space-y-2 text-xs text-thy-muted">
                <p>
                  <strong>Garment:</strong> {selectedRequest.garmentType}
                  {selectedRequest.category ? ` (${selectedRequest.category})` : ''}
                </p>
                <p>
                  <strong>Fabric Details:</strong> {selectedRequest.fabricDetails || selectedRequest.fabricProvided}
                </p>
                <p>
                  <strong>Measurements:</strong> {selectedRequest.measurements}
                </p>
                <p>
                  <strong>Customer Notes:</strong> {selectedRequest.requirements}
                </p>
              </div>
              <form onSubmit={handleSendQuotation} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-thy-muted mb-1">Quoted Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={quotedAmount}
                    onChange={(event) => setQuotedAmount(event.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-thy-muted mb-1">Estimated Days to Complete</label>
                  <input
                    type="number"
                    required
                    value={estimatedDays}
                    onChange={(event) => setEstimatedDays(event.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-thy-muted mb-1">Notes / Terms for Customer</label>
                  <textarea
                    rows={3}
                    value={quoteNotes}
                    onChange={(event) => setQuoteNotes(event.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setSelectedRequest(null)} className="px-4 py-2 bg-thy-mist text-thy-muted rounded-xl font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-thy-burgundy text-white rounded-xl font-semibold hover:bg-thy-brand-active">
                    Send Formal Quote
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </TailorPage>
  );
}
