import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* THY Website Header / Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#00c9b7]">THY</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">Tailor Studio</span>
            </div>

            {/* Main Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/tailor-dashboard" className="text-[#00c9b7] font-semibold">Dashboard</Link>
              <Link href="/tailor-dashboard/new-requests" className="hover:text-gray-900">New Requests</Link>
              <Link href="/tailor-dashboard/active-orders" className="hover:text-gray-900">Active Orders</Link>
              <Link href="/tailor-dashboard/portfolio" className="hover:text-gray-900">Portfolio</Link>
              <Link href="/tailor-dashboard/availability" className="hover:text-gray-900">Availability</Link>
              <Link href="/tailor-dashboard/earnings" className="hover:text-gray-900">Earnings & Reports</Link>
            </nav>

            {/* Right Action Icons (Chat, Notifications, Profile) */}
            <div className="flex items-center gap-4 text-gray-600">
              <Link href="/tailor-dashboard/chat" title="Chat" className="hover:text-[#00c9b7]">💬</Link>
              <Link href="/tailor-dashboard/notifications" title="Notifications" className="hover:text-[#00c9b7]">🔔</Link>
              <Link href="/tailor-dashboard/profile" title="Profile" className="hover:text-[#00c9b7] font-semibold">👤 Profile</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}