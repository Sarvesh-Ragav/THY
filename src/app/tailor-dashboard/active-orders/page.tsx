'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  garmentType: string;
  category: string;
  orderDate: string;
  expectedCompletion: string;
  status: 'Accepted' | 'Stitching' | 'Ready for Delivery' | 'Completed';
  paymentStatus: 'Paid' | 'Advance Paid' | 'Pending';
  fabricDetails: string;
  measurements: string;
  quotationAmount: string;
  designPreview: string;
}

const initialActiveOrders: Order[] = [
  {
    id: 'ORD-8091',
    customerName: 'Priya Verma',
    garmentType: 'Embroidered Lehenga Choli',
    category: 'Bridalwear',
    orderDate: '2026-09-02',
    expectedCompletion: '2026-09-18',
    status: 'Stitching',
    paymentStatus: 'Advance Paid',
    fabricDetails: 'Velvet & Raw Silk',
    measurements: 'Bust: 36", Waist: 30", Choli Length: 15", Lehenga Length: 42"',
    quotationAmount: '₹8,500',
    designPreview: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop',
  },
  {
    id: 'ORD-8095',
    customerName: 'Vikram Mehta',
    garmentType: '3-Piece Tuxedo Suit',
    category: 'Formalwear',
    orderDate: '2026-09-05',
    expectedCompletion: '2026-09-14',
    status: 'Accepted',
    paymentStatus: 'Paid',
    fabricDetails: 'Italian Wool Blend',
    measurements: 'Chest: 40", Waist: 34", Shoulder: 18.5", Trouser Length: 40"',
    quotationAmount: '₹12,000',
    designPreview: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&auto=format&fit=crop',
  },
  {
    id: 'ORD-8102',
    customerName: 'Sneha Reddy',
    garmentType: 'Designer Anarkali Suit',
    category: 'Ethnicwear',
    orderDate: '2026-09-07',
    expectedCompletion: '2026-09-12',
    status: 'Ready for Delivery',
    paymentStatus: 'Paid',
    fabricDetails: 'Georgette with Gold Zari',
    measurements: 'Bust: 34", Waist: 28", Sleeve Length: 22", Total Length: 54"',
    quotationAmount: '₹4,800',
    designPreview: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&auto=format&fit=crop',
  },
];

export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialActiveOrders);
  const [activeTab, setActiveTab] = useState<string>('All Active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // UI States matching flowchart
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeSubView, setActiveSubView] = useState<'details' | 'measurements'>('details');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<boolean>(false);

  // Show status update confirmation toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Status transition pipeline logic
  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setIsLoading(true);

    // Simulate API call and success flow
    setTimeout(() => {
      setIsLoading(false);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      triggerToast(`Order ${orderId} status updated to "${newStatus}"`);
    }, 400);
  };

  const handleMarkCompleted = (orderId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Remove from active orders list as specified in flowchart
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedOrder(null);
      triggerToast(`Order ${orderId} marked as Completed and moved to archive.`);
    }, 400);
  };

  // Filtered orders derivation
  const filteredOrders = orders.filter((order) => {
    // Tab Filter
    if (activeTab === 'Accepted' && order.status !== 'Accepted') return false;
    if (activeTab === 'Stitching' && order.status !== 'Stitching') return false;
    if (activeTab === 'Ready for Delivery' && order.status !== 'Ready for Delivery') return false;

    // Search Filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.garmentType.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Orders</h1>
          <p className="text-xs text-gray-600">Manage ongoing tailoring orders from stitching to delivery.</p>
        </div>
        <Link href="/tailor-dashboard" className="text-sm font-semibold text-[#00c9b7] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Inline Confirmation Toast Notification */}
      {toastMessage && (
        <div className="bg-teal-50 border border-[#00c9b7] text-teal-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-teal-600 font-bold">✕</button>
        </div>
      )}

      {/* Network Error / General Failure Banner */}
      {networkError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs space-y-2">
          <p className="font-bold">⚠️ General Failure: Something went wrong. Please try again.</p>
          <button
            onClick={() => setNetworkError(false)}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Retry Current Action
          </button>
        </div>
      )}

      {/* Status Filters / Tabs */}
      <div className="flex border-b border-gray-200 space-x-4 overflow-x-auto text-xs font-semibold">
        {['All Active', 'Accepted', 'Stitching', 'Ready for Delivery'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'border-[#00c9b7] text-[#00c9b7] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} ({tab === 'All Active' ? orders.length : orders.filter((o) => o.status === tab).length})
          </button>
        ))}
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
        >
          <option value="All">All Categories</option>
          <option value="Bridalwear">Bridalwear</option>
          <option value="Formalwear">Formalwear</option>
          <option value="Ethnicwear">Ethnicwear</option>
        </select>
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="py-8 text-center text-xs text-[#00c9b7] font-semibold animate-pulse">
          ⏳ Updating order pipeline state...
        </div>
      )}

      {/* Active Order List OR Empty State */}
      {!isLoading && filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-all"
            >
              {/* Order Info & Preview */}
              <div className="flex items-center gap-4">
                <img
                  src={order.designPreview}
                  alt={order.garmentType}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">{order.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Accepted'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : order.status === 'Stitching'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{order.garmentType}</h3>
                  <p className="text-xs text-gray-600">
                    Customer: <span className="font-semibold text-gray-800">{order.customerName}</span>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Ordered: {order.orderDate} | Target Completion: <span className="font-medium text-gray-700">{order.expectedCompletion}</span>
                  </p>
                </div>
              </div>

              {/* Actions & Status Pipeline Dropdown */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setActiveSubView('details');
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  Order Details
                </button>

                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                  className="px-3 py-2 border rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Stitching">Stitching</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                </select>

                {order.status === 'Ready for Delivery' && (
                  <button
                    onClick={() => handleMarkCompleted(order.id)}
                    className="px-3 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4] transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State as defined in Flowchart */
        !isLoading && (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-2">
            <div className="text-3xl">🪡</div>
            <h3 className="text-base font-bold text-gray-800">No active orders right now.</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Accepted customer quotations and ongoing stitching orders will appear here when you start stitching.
            </p>
          </div>
        )
      )}

      {/* ORDER DETAILS & STATUS MANAGEMENT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400">{selectedOrder.id}</span>
                <h2 className="font-bold text-gray-900 text-base">{selectedOrder.garmentType}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b text-xs font-semibold space-x-4">
              <button
                onClick={() => setActiveSubView('details')}
                className={`pb-2 ${activeSubView === 'details' ? 'border-b-2 border-[#00c9b7] text-[#00c9b7]' : 'text-gray-400'}`}
              >
                Review Overview
              </button>
              <button
                onClick={() => setActiveSubView('measurements')}
                className={`pb-2 ${activeSubView === 'measurements' ? 'border-b-2 border-[#00c9b7] text-[#00c9b7]' : 'text-gray-400'}`}
              >
                Customer Measurements
              </button>
            </div>

            {/* View 1: Review Customer / Design / Fabric / Quotation */}
            {activeSubView === 'details' && (
              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl">
                  <img src={selectedOrder.designPreview} className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Category:</strong> {selectedOrder.category}</p>
                    <p><strong>Fabric:</strong> {selectedOrder.fabricDetails}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p><strong>Quotation Amount:</strong> {selectedOrder.quotationAmount}</p>
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                  <p><strong>Expected Delivery:</strong> {selectedOrder.expectedCompletion}</p>
                  <p><strong>Current Status:</strong> {selectedOrder.status}</p>
                </div>
              </div>
            )}

            {/* View 2: Detailed Customer Measurements */}
            {activeSubView === 'measurements' && (
              <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-teal-900">Recorded Measurements</h4>
                <p className="text-gray-700 leading-relaxed">{selectedOrder.measurements}</p>
              </div>
            )}

            {/* Modal Workflow Actions (Chat / Update Status / Mark Completed) */}
            <div className="pt-3 border-t flex flex-wrap gap-2 justify-between items-center">
              <Link
                href="/tailor-dashboard/chat"
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
              >
                💬 Open Chat
              </Link>

              <div className="flex gap-2">
                {selectedOrder.status === 'Ready for Delivery' ? (
                  <button
                    onClick={() => handleMarkCompleted(selectedOrder.id)}
                    className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4]"
                  >
                    Mark Order Completed
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        selectedOrder.status === 'Accepted' ? 'Stitching' : 'Ready for Delivery'
                      )
                    }
                    className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4]"
                  >
                    Advance to {selectedOrder.status === 'Accepted' ? "'Stitching'" : "'Ready for Delivery'"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}