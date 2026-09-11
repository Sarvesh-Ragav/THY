'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TailorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/tailor-dashboard' },
    { name: 'New Requests', href: '/tailor-dashboard/new-requests' },
    { name: 'Active Orders', href: '/tailor-dashboard/active-orders' },
    { name: 'Availability', href: '/tailor-dashboard/availability' },
    { name: 'Chat', href: '/tailor-dashboard/chat' },
    { name: 'Notifications', href: '/tailor-dashboard/notifications' },
    { name: 'Portfolio', href: '/tailor-dashboard/portfolio' },
    { name: 'Earnings & Reports', href: '/tailor-dashboard/earnings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Unified Global Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <Link href="/tailor-dashboard" className="text-xl font-black tracking-wider text-[#00c9b7]">
              THY
            </Link>
            <span className="bg-teal-50 text-[#00c9b7] text-[10px] font-bold px-2 py-0.5 rounded-md">
              kavs thy
            </span>
          </div>

          {/* Single Main Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-[#00c9b7]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Controls */}
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
            <span>kavs</span>
            <button className="text-gray-400 hover:text-red-500 font-normal">Log out</button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}