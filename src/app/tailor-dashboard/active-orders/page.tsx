'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock active orders matching HLD workflow specifications
const initialActiveOrders = [
  {
    id: 'ORD-8091',
    customerName: 'Priya Verma',
    garmentType: 'Embroidered Lehenga Choli',
    status: 'In Progress', // 'In Progress' | 'Fitting Scheduled' | 'Ready to Stitch/Deliver'
    expectedCompletion: '2026-09-18',
    fabricDetails: 'Velvet & Raw Silk',
    measurements: 'Standard Size M (Customized Waist)',
  },
  {
    id: 'ORD-8095',
    customerName: 'Vikram Mehta',
    garmentType: 'Tuxedo Jacket & Trousers',
    status: 'Fitting Scheduled',
    expectedCompletion: '2026-09-14',
    fabricDetails: 'Italian Wool',
    measurements: 'Custom Fitted',
  },
];

export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState(initialActiveOrders);
  const [selectedOrder, setSelectedOrder] = useState<typeof initialActiveOrders[0] | null>(null);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Orders</h1>
          <p className="text-sm text-gray-600">Track and manage current tailoring jobs from cutting to final delivery.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-[#00c9b7] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Active Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400">{order.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : order.status === 'Fitting Scheduled'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {order.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{order.garmentType}</h3>
              <p className="text-xs text-gray-600">
                Customer: <span className="font-semibold text-gray-800">{order.customerName}</span> | Fabric: {order.fabricDetails}
              </p>
              <p className="text-xs text-gray-500">
                📅 Target Delivery: <span className="font-medium text-gray-700">{order.expectedCompletion}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                View Details
              </button>
              
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                className="px-3 py-2 border rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
              >
                <option value="In Progress">In Progress</option>
                <option value="Fitting Scheduled">Fitting Scheduled</option>
                <option value="Ready to Stitch/Deliver">Ready for Delivery</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-gray-900 text-lg">Order Details - {selectedOrder.id}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Garment:</strong> {selectedOrder.garmentType}</p>
              <p><strong>Fabric:</strong> {selectedOrder.fabricDetails}</p>
              <p><strong>Measurements:</strong> {selectedOrder.measurements}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Expected Date:</strong> {selectedOrder.expectedCompletion}</p>
            </div>

            <div className="pt-3 border-t text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-semibold hover:bg-[#00b5a4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}