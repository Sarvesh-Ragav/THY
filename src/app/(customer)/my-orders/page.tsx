'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  X, 
  FileText, 
  AlertCircle,
  Package,
  Sparkles
} from 'lucide-react';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  fabric: string;
}

interface TimelineStep {
  title: string;
  time: string;
  completed: boolean;
  active?: boolean;
}

interface Order {
  id: string;
  boutique: string;
  rating: number;
  location: string;
  status: 'In Progress' | 'Completed' | 'Cancelled';
  statusStage: number;
  currentStageText: string;
  date: string;
  total: number;
  paymentMode: string;
  deliveryAddress: string;
  items: OrderItem[];
  timeline: TimelineStep[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "THY-89241",
    boutique: "Royal Stitch Atelier",
    rating: 4.9,
    location: "T. Nagar, Chennai",
    status: "In Progress",
    statusStage: 3,
    currentStageText: "Cutting & Stitching",
    date: "14 Sep 2026, 10:30 AM",
    total: 11900,
    paymentMode: "UPI / GPay (Paid)",
    deliveryAddress: "Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020",
    items: [
      { name: "Custom 3-Piece Tuxedo Blazer", qty: 1, price: 8500, fabric: "Italian Navy Wool" },
      { name: "Slim Fit Formal Trousers", qty: 2, price: 3400, fabric: "Premium Cotton Twill" }
    ],
    timeline: [
      { title: "Order Confirmed", time: "14 Sep, 10:30 AM", completed: true },
      { title: "Fabric Picked Up", time: "14 Sep, 03:15 PM", completed: true },
      { title: "Measurements Verified", time: "15 Sep, 11:00 AM", completed: true },
      { title: "Cutting & Stitching", time: "In Progress", completed: false, active: true },
      { title: "Quality Check & Ironing", time: "Pending", completed: false },
      { title: "Delivered to Doorstep", time: "Estimated 19 Sep", completed: false }
    ]
  },
  {
    id: "THY-87102",
    boutique: "Vogue Custom Design Studio",
    rating: 4.8,
    location: "Nungambakkam, Chennai",
    status: "Completed",
    statusStage: 5,
    currentStageText: "Delivered on 11 Sep 2026",
    date: "06 Sep 2026, 02:20 PM",
    total: 4200,
    paymentMode: "Credit Card (Paid)",
    deliveryAddress: "Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020",
    items: [
      { name: "Silk Embroidered Anarkali Kurti", qty: 1, price: 4200, fabric: "Pure Kanchipuram Silk with Zari" }
    ],
    timeline: [
      { title: "Order Confirmed", time: "06 Sep, 02:20 PM", completed: true },
      { title: "Fabric Picked Up", time: "06 Sep, 05:00 PM", completed: true },
      { title: "Measurements Verified", time: "07 Sep, 10:00 AM", completed: true },
      { title: "Cutting & Stitching", time: "09 Sep, 01:00 PM", completed: true },
      { title: "Quality Check & Ironing", time: "10 Sep, 04:00 PM", completed: true },
      { title: "Delivered to Doorstep", time: "11 Sep, 01:30 PM", completed: true }
    ]
  },
  {
    id: "THY-85409",
    boutique: "Thread & Tailor Co.",
    rating: 4.7,
    location: "Velachery, Chennai",
    status: "Cancelled",
    statusStage: -1,
    currentStageText: "Cancelled by Customer",
    date: "01 Sep 2026, 09:15 AM",
    total: 2800,
    paymentMode: "Refunded via UPI",
    deliveryAddress: "Flat 4B, Ceebros Apartments, Adyar, Chennai - 600020",
    items: [
      { name: "Mandarin Collar Nehru Jacket", qty: 1, price: 2800, fabric: "Raw Khadi Silk" }
    ],
    timeline: [
      { title: "Order Confirmed", time: "01 Sep, 09:15 AM", completed: true },
      { title: "Order Cancelled", time: "01 Sep, 10:00 AM", completed: false, active: true }
    ]
  }
];

export default function MyOrdersPage() {
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedOrderTracking, setSelectedOrderTracking] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesTab = 
      activeTab === 'All' ? true :
      activeTab === 'In Progress' ? order.status === 'In Progress' :
      activeTab === 'Completed' ? order.status === 'Completed' :
      activeTab === 'Cancelled' ? order.status === 'Cancelled' : true;
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.boutique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.fabric.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Header & Search Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#26988a] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#26988a]/30">
                thy
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">THY</span>
                <span className="text-xs text-[#26988a] font-medium tracking-wide">Custom Tailoring</span>
              </div>
            </div>

            <div className="flex bg-[#26988a]/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#26988a] items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{orders.length} Orders</span>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders, boutiques, fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26988a] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Swiggy/Zomato Style Filter Tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-1">
          {[
            { id: 'All', count: orders.length },
            { id: 'In Progress', count: orders.filter(o => o.status === 'In Progress').length },
            { id: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
            { id: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-[#26988a] text-white shadow-sm shadow-[#26988a]/30' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.id} Orders ({tab.count})
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track live tailor progress, review stitching details, and manage past fits.</p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-2xs">
            <div className="w-16 h-16 bg-[#26988a]/10 text-[#26988a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No Orders Found</h3>
            <p className="text-slate-500 text-sm mb-6">No orders match your selected filter or search query.</p>
            <button 
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-[#26988a] text-white font-medium text-sm rounded-xl hover:bg-[#22877b] transition-all shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div 
                key={order.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all"
              >
                {/* Order Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{order.boutique}</h3>
                      <span className="flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                        {order.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {order.location}
                      </span>
                      <span>•</span>
                      <span className="font-mono font-medium text-slate-700">ID: {order.id}</span>
                    </div>
                  </div>

                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                      order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                      'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}>
                      {order.status === 'In Progress' && <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
                      {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
                      {order.status === 'Cancelled' && <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
                      {order.currentStageText}
                    </span>
                  </div>
                </div>

                {/* Garments List */}
                <div className="py-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#26988a] mt-2 shrink-0"></div>
                        <div>
                          <span className="font-semibold text-slate-800">{item.qty}x {item.name}</span>
                          <p className="text-xs text-slate-500">Fabric: <span className="text-slate-700 font-medium">{item.fabric}</span></p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ordered on {order.date}</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-bold text-slate-900">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => setSelectedOrderDetails(order)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#26988a]" />
                      View Details
                    </button>
                    
                    {order.status !== 'Cancelled' && (
                      <button 
                        onClick={() => setSelectedOrderTracking(order)}
                        className="px-4 py-2 bg-[#26988a] hover:bg-[#22877b] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Track Order
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* Track Order Modal */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedOrderTracking(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#26988a]/10 rounded-xl flex items-center justify-center text-[#26988a]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Live Stitching Tracker</h3>
                <p className="text-xs text-slate-500">Order ID: <span className="font-mono font-semibold text-slate-700">{selectedOrderTracking.id}</span> • {selectedOrderTracking.boutique}</p>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 mb-6">
              {selectedOrderTracking.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                    step.completed ? 'bg-[#26988a] text-white' : 
                    step.active ? 'bg-amber-500 text-white animate-pulse' : 
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block mb-0.5">Estimated Doorstep Delivery</span>
                <span>By Friday, 19 Sep 2026 (Evening Slot)</span>
              </div>
              <Sparkles className="w-6 h-6 text-[#26988a]" />
            </div>

            <button 
              onClick={() => setSelectedOrderTracking(null)}
              className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}

      {/* View Details / Invoice Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#26988a]/10 rounded-xl flex items-center justify-center text-[#26988a]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Order Tax Invoice & Summary</h3>
                <p className="text-xs text-slate-500">Order ID: <span className="font-mono font-semibold text-slate-700">{selectedOrderDetails.id}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tailoring Boutique:</span>
                <span className="font-semibold text-slate-800">{selectedOrderDetails.boutique}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-800">{selectedOrderDetails.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment Address:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[240px]">{selectedOrderDetails.deliveryAddress}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
              <div className="bg-slate-100 px-4 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider flex justify-between">
                <span>Garment Specification</span>
                <span>Amount</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.qty}x {item.name}</span>
                      <span className="text-slate-500">Fabric: {item.fabric}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Total Amount Paid</span>
                <span className="text-[#26988a]">₹{selectedOrderDetails.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2.5 bg-[#26988a] hover:bg-[#22877b] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}