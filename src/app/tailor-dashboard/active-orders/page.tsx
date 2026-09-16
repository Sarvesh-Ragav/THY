'use client';

import React, { useMemo, useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { ORDER_STAGES, activeOrders, completedOrders, payoutsFromOrders } from '@/lib/tailor-studio';
import { applyStageNotifications } from '@/lib/notifications';

export default function ActiveOrdersPage() {
  const { session, updateSession } = useTailorSession();
  const [showCompleted, setShowCompleted] = useState(false);
  const open = useMemo(() => activeOrders(session.orders), [session.orders]);
  const done = useMemo(() => completedOrders(session.orders), [session.orders]);
  const orders = showCompleted ? done : open;
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || orders[0];

  const updateStage = (orderId: string, stage: number) => {
    const order = session.orders.find((item) => item.id === orderId);
    if (!order) return;
    updateSession((current) => {
      const patch = applyStageNotifications(current, order, stage);
      return {
        ...patch,
        payouts: payoutsFromOrders(patch.orders || current.orders, current.payouts),
      };
    });
  };

  return (
    <TailorPage
      title="Active Orders"
      description="Manage ongoing orders and update live stitching progress."
      actions={
        <div className="flex items-center gap-2 bg-thy-mist p-1.5">
          <button
            type="button"
            onClick={() => {
              setShowCompleted(false);
              setSelectedOrderId(open[0]?.id || '');
            }}
            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
              !showCompleted ? 'bg-thy-burgundy text-white' : 'text-thy-muted hover:text-thy-ink'
            }`}
          >
            In Progress ({open.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCompleted(true);
              setSelectedOrderId(done[0]?.id || '');
            }}
            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
              showCompleted ? 'bg-thy-burgundy text-white' : 'text-thy-muted hover:text-thy-ink'
            }`}
          >
            Completed ({done.length})
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-thy-ink">
        {orders.length === 0 || !selectedOrder ? (
          <div className="thy-card p-12 text-center text-sm text-thy-muted">
            {showCompleted ? 'No completed orders yet.' : 'No active orders. Quoted requests appear here.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-bold text-thy-subtle uppercase tracking-wider block px-1">
                Order Pipeline
              </span>
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    selectedOrder.id === ord.id
                      ? 'bg-thy-surface border-thy-burgundy ring-2 ring-thy-burgundy/20 shadow-sm'
                      : 'bg-thy-surface border-thy-burgundy/15 hover:border-thy-burgundy/20'
                  }`}
                >
                  <div className="flex justify-between items-center text-[11px] text-thy-subtle font-bold">
                    <span>{ord.id}</span>
                    <span>Due: {ord.expectedCompletion}</span>
                  </div>
                  <h3 className="text-sm font-bold text-thy-ink mt-1">{ord.garmentType}</h3>
                  <p className="text-xs text-thy-muted mt-0.5">Customer: {ord.customerName}</p>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-thy-burgundy/10 text-xs">
                    <span className="text-thy-burgundy font-bold">Stage {ord.currentStage || 1} of 5</span>
                    <span className="font-extrabold text-thy-ink">₹{ord.price || 0}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="thy-card p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-thy-burgundy/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-thy-ink">{selectedOrder.garmentType}</h2>
                      <span className="bg-thy-mist text-thy-muted text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                        {selectedOrder.id}
                      </span>
                    </div>
                    <p className="text-xs text-thy-muted mt-0.5">
                      Customer: <span className="font-bold text-thy-ink">{selectedOrder.customerName}</span>
                      {selectedOrder.orderedDate ? ` • Ordered: ${selectedOrder.orderedDate}` : ''}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-thy-ink uppercase tracking-wider text-[11px]">
                      Update live stage
                    </span>
                    <span className="text-thy-burgundy font-bold">
                      Stage {selectedOrder.currentStage || 1} - {ORDER_STAGES[(selectedOrder.currentStage || 1) - 1]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {ORDER_STAGES.map((stg, idx) => {
                      const current = selectedOrder.currentStage || 1;
                      const isCompleted = idx < current;
                      const isCurrent = idx === current - 1;
                      return (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => updateStage(selectedOrder.id, idx + 1)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-thy-burgundy text-white border-thy-burgundy font-bold'
                              : isCompleted
                                ? 'bg-thy-mist text-thy-burgundy border-thy-burgundy/20 font-semibold'
                                : 'bg-thy-surface text-thy-muted border-thy-burgundy/15'
                          }`}
                        >
                          <div className="text-[10px] opacity-80 uppercase font-bold">Step {idx + 1}</div>
                          <div className="text-xs mt-0.5 truncate">{stg}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-amber-900">Measurements & notes</span>
                  <p className="text-amber-800">{selectedOrder.measurements}</p>
                  {selectedOrder.specialNotes ? <p className="text-amber-800">{selectedOrder.specialNotes}</p> : null}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-thy-burgundy/10 text-xs text-center">
                  <div className="p-3 bg-thy-mist rounded-xl border border-thy-burgundy/10">
                    <span className="text-thy-subtle block text-[10px] uppercase font-bold">Target delivery</span>
                    <span className="font-extrabold text-thy-ink">{selectedOrder.expectedCompletion}</span>
                  </div>
                  <div className="p-3 bg-thy-mist rounded-xl border border-thy-burgundy/10">
                    <span className="text-thy-subtle block text-[10px] uppercase font-bold">Quote</span>
                    <span className="font-extrabold text-thy-burgundy">₹{selectedOrder.price || 0}</span>
                  </div>
                  <div className="p-3 bg-thy-mist rounded-xl border border-thy-burgundy/10">
                    <span className="text-thy-subtle block text-[10px] uppercase font-bold">Status</span>
                    <span className="font-extrabold text-thy-ink">{selectedOrder.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TailorPage>
  );
}
