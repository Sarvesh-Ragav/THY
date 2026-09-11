'use client';

import React, { useState } from 'react';

interface CustomerOrder {
  id: string;
  customerName: string;
  garmentType: string;
  orderDate: string;
  dueDate: string;
  price: number;
  currentStep: number; // 1 to 5
  status: 'Pending' | 'In Progress' | 'Completed';
  measurements: { [key: string]: string };
  notes: string;
}

const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'THY-8842',
    customerName: 'Ananya Ramesh',
    garmentType: 'Bridal Designer Blouse (Silk)',
    orderDate: '10 Sep 2026',
    dueDate: '16 Sep 2026',
    price: 1850,
    currentStep: 3,
    status: 'In Progress',
    measurements: { Bust: '36 in', Waist: '30 in', Shoulder: '14.5 in', 'Arm Length': '10 in', 'Front Neck': '7 in' },
    notes: 'Piping in gold zardozi work. Customer requested extra margin of 1.5 inches.',
  },
  {
    id: 'THY-8845',
    customerName: 'Meera K.',
    garmentType: 'Heavy Anarkali Suit Set',
    orderDate: '11 Sep 2026',
    dueDate: '18 Sep 2026',
    price: 3200,
    currentStep: 2,
    status: 'In Progress',
    measurements: { Chest: '38 in', Waist: '32 in', Length: '52 in', 'Sleeve Length': '18 in' },
    notes: 'Can-can padding required for lower flare.',
  },
  {
    id: 'THY-8719',
    customerName: 'Pooja V.',
    garmentType: 'Lehenga Choli Alterations',
    orderDate: '01 Sep 2026',
    dueDate: '07 Sep 2026',
    price: 850,
    currentStep: 5,
    status: 'Completed',
    measurements: { Waist: '28 in', Hip: '36 in', Length: '40 in' },
    notes: 'Side zip replacement and waist fitting adjustment.',
  },
];

const STAGES = [
  'Order Confirmed',
  'Material Received',
  'Stitching in Progress',
  'Quality Check',
  'Ready for Delivery',
];

export default function TailorActiveOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder>(INITIAL_ORDERS[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('in_progress');
  const [isMeasurementsModalOpen, setIsMeasurementsModalOpen] = useState(false);

  // Update order stage
  const handleUpdateStage = (orderId: string, newStep: number) => {
    const updatedStatus = newStep === 5 ? 'Completed' : 'In Progress';
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, currentStep: newStep, status: updatedStatus } : o))
    );
    setSelectedOrder((prev) => (prev.id === orderId ? { ...prev, currentStep: newStep, status: updatedStatus } : prev));
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'in_progress') return o.status === 'In Progress';
    if (activeTab === 'completed') return o.status === 'Completed';
    return true;
  });

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 text-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Active Orders & Production</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage ongoing orders, update live stitching progress, and view customer measurements.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'in_progress' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({orders.filter((o) => o.status === 'In Progress').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'completed' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-[#00c9b7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order List Sidebar */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Order Pipeline</h2>
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              No orders found in this status.
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedOrder.id === ord.id
                    ? 'bg-white border-[#00c9b7] shadow-md ring-2 ring-[#00c9b7]/10'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{ord.id}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                    Due: {ord.dueDate}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">{ord.garmentType}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Customer: {ord.customerName}</p>
                <div className="mt-3 flex justify-between items-center text-[10px] font-semibold border-t border-slate-100 pt-2">
                  <span className="text-[#00c9b7]">Stage {ord.currentStep} of 5</span>
                  <span className="text-slate-800 font-extrabold">₹{ord.price}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Order Detail & Status Control */}
        {selectedOrder && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedOrder.garmentType}</h2>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Customer: <span className="font-bold text-slate-800">{selectedOrder.customerName}</span> • Ordered: {selectedOrder.orderDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMeasurementsModalOpen(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    📏 View Measurements
                  </button>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Update Customer Live Status</h3>
                  <span className="text-xs font-bold text-[#00c9b7]">
                    Current: Stage {selectedOrder.currentStep} - {STAGES[selectedOrder.currentStep - 1]}
                  </span>
                </div>

                {/* Stage Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {STAGES.map((stageName, index) => {
                    const stepNum = index + 1;
                    const isActive = selectedOrder.currentStep === stepNum;
                    const isPassed = selectedOrder.currentStep > stepNum;

                    return (
                      <button
                        key={stageName}
                        onClick={() => handleUpdateStage(selectedOrder.id, stepNum)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          isActive
                            ? 'bg-[#00c9b7] text-white border-[#00c9b7] shadow-sm'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold">Step {stepNum}</span>
                        <span className="text-[11px] font-extrabold leading-tight">{stageName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Notes */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-amber-900">📌 Special Instructions & Notes</p>
                <p className="text-xs text-amber-800 leading-relaxed">{selectedOrder.notes}</p>
              </div>

              {/* Order Info & Timeline Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-medium">Target Delivery Date</span>
                  <span className="font-extrabold text-slate-900">{selectedOrder.dueDate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-medium">Stitching Quote Price</span>
                  <span className="font-extrabold text-[#00c9b7]">₹{selectedOrder.price}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] font-medium">Overall Status</span>
                  <span className="font-extrabold text-slate-900">{selectedOrder.status}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MEASUREMENTS MODAL */}
      {isMeasurementsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Measurements for {selectedOrder.customerName}
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">{selectedOrder.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(selectedOrder.measurements).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span className="text-slate-500 font-medium">{key}:</span>
                  <span className="font-bold text-slate-900">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsMeasurementsModalOpen(false)}
                className="w-full py-2.5 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] transition-colors"
              >
                Close Measurements
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}