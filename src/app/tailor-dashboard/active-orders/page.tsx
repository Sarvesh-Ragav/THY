'use client';

import React, { useState } from 'react';

interface Order {
  id: string;
  title: string;
  customerName: string;
  orderedDate: string;
  dueDate: string;
  price: number;
  currentStage: number; // 1 to 5
  specialNotes: string;
}

const STAGES = [
  'Order Confirmed',
  'Material Received',
  'Stitching in Progress',
  'Quality Check',
  'Ready for Delivery',
];

export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'THY-8842',
      title: 'Bridal Designer Blouse (Silk)',
      customerName: 'Ananya Ramesh',
      orderedDate: '10 Sep 2026',
      dueDate: '16 Sep 2026',
      price: 1850,
      currentStage: 3,
      specialNotes: 'Piping in gold zardozi work. Customer requested extra margin of 1.5 inches.',
    },
    {
      id: 'THY-8845',
      title: 'Heavy Anarkali Suit Set',
      customerName: 'Meera K.',
      orderedDate: '11 Sep 2026',
      dueDate: '18 Sep 2026',
      price: 3200,
      currentStage: 2,
      specialNotes: 'Double inner lining required for net dupatta.',
    },
  ]);

  const [selectedOrderId, setSelectedOrderId] = useState<string>('THY-8842');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleStageSelect = (stageIndex: number) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrder.id ? { ...ord, currentStage: stageIndex + 1 } : ord
      )
    );
  };

  const handleAdvanceToNextStage = () => {
    if (selectedOrder.currentStage < STAGES.length) {
      handleStageSelect(selectedOrder.currentStage);
    }
  };

  const handleRevertToPreviousStage = () => {
    if (selectedOrder.currentStage > 1) {
      handleStageSelect(selectedOrder.currentStage - 2);
    }
  };

  return (
    <div className="space-y-6 text-thy-ink">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Active Orders & Production
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage ongoing orders and update live stitching progress stages.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button type="button" className="px-4 py-2 text-xs font-bold rounded-xl bg-[#5C1A24] text-white shadow-xs">
            In Progress ({orders.length})
          </button>
          <button type="button" className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900">
            Completed
          </button>
        </div>
      </div>

      {/* Main Grid: Pipeline vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Order Pipeline Selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Order Pipeline
          </span>

          {orders.map((ord) => (
            <button
              key={ord.id}
              type="button"
              onClick={() => setSelectedOrderId(ord.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                selectedOrderId === ord.id
                  ? 'bg-white border-[#5C1A24] ring-2 ring-[#5C1A24]/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                <span>{ord.id}</span>
                <span>Due: {ord.dueDate}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{ord.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Customer: {ord.customerName}</p>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100 text-xs">
                <span className="text-[#5C1A24] font-bold">
                  Stage {ord.currentStage} of 5
                </span>
                <span className="font-extrabold text-slate-900">₹{ord.price}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Selected Order Operations Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Header Details */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">{selectedOrder.title}</h2>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                    {selectedOrder.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer: <span className="font-bold text-slate-800">{selectedOrder.customerName}</span> • Ordered: {selectedOrder.orderedDate}
                </p>
              </div>

              <button type="button" className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors">
                📏 View Measurements
              </button>
            </div>

            {/* Stage Stepper & Stage Control Buttons */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  UPDATE CUSTOMER LIVE STAGE STATUS
                </span>
                <span className="text-[#5C1A24] font-bold">
                  Current: Stage {selectedOrder.currentStage} - {STAGES[selectedOrder.currentStage - 1]}
                </span>
              </div>

              {/* Stage Stepper Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STAGES.map((stg, idx) => {
                  const isCompleted = idx < selectedOrder.currentStage;
                  const isCurrent = idx === selectedOrder.currentStage - 1;
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => handleStageSelect(idx)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-[#5C1A24] text-white border-[#5C1A24] font-bold shadow-xs'
                          : isCompleted
                          ? 'bg-thy-mist text-thy-burgundy border-thy-burgundy/20 font-semibold'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[10px] opacity-80 uppercase font-bold">Step {idx + 1}</div>
                      <div className="text-xs mt-0.5 truncate">{stg}</div>
                    </button>
                  );
                })}
              </div>

              {/* Control Buttons: Revert Stage & Next Stage */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={selectedOrder.currentStage <= 1}
                  onClick={handleRevertToPreviousStage}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-colors flex items-center gap-1.5 ${
                    selectedOrder.currentStage <= 1
                      ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>← Move to Previous Stage ({STAGES[selectedOrder.currentStage - 2] || 'Initial'})</span>
                </button>

                <button
                  type="button"
                  disabled={selectedOrder.currentStage >= STAGES.length}
                  onClick={handleAdvanceToNextStage}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2 ${
                    selectedOrder.currentStage >= STAGES.length
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-[#5C1A24] hover:bg-[#4A1520] text-white'
                  }`}
                >
                  {selectedOrder.currentStage >= STAGES.length ? (
                    'Order Completed (Stage 5 of 5)'
                  ) : (
                    <>
                      <span>Update to Next Stage ({STAGES[selectedOrder.currentStage]})</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                📌 Special Instructions & Notes
              </span>
              <p className="text-amber-800">{selectedOrder.specialNotes}</p>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Delivery Date</span>
                <span className="font-extrabold text-slate-900">{selectedOrder.dueDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Stitching Quote Price</span>
                <span className="font-extrabold text-[#5C1A24]">₹{selectedOrder.price}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Overall Status</span>
                <span className="font-extrabold text-slate-900">
                  {selectedOrder.currentStage === 5 ? 'Ready to Deliver' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}