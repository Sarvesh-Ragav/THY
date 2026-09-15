'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/tailor-dashboard' },
  { label: 'New Requests', href: '/tailor-dashboard/new-requests' },
  { label: 'Active Orders', href: '/tailor-dashboard/active-orders' },
  { label: 'Portfolio', href: '/tailor-dashboard/portfolio' }, // 👈 Separated from Profile
  { label: 'Earnings', href: '/tailor-dashboard/earnings' },
  { label: 'Availability', href: '/tailor-dashboard/availability' },
  { label: 'Settings', href: '/tailor-dashboard/settings' },
];

export default function TailorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isReady, logout } = useTailorSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady && !session.isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, session.isAuthenticated, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isReady || !session.isAuthenticated) {
    return null;
  }

  const displayName = session.identifier || session.profile?.fullName || 'Tailor Account';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/tailor-dashboard" className="font-serif font-extrabold text-xl tracking-wider text-slate-900">
              THY
            </Link>
          </div>

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs px-3.5 py-1.5 rounded-full font-bold border border-teal-200/60 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{displayName}</span>
            </button>

            {/* Floating Dropdown Card */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-black text-slate-900 truncate">{displayName}</p>
                  <p className="text-[10px] font-semibold text-slate-400">Tailor Partner Account</p>
                </div>

                <div className="py-1 text-xs font-semibold text-slate-700">
                  <Link
                    href="/tailor-dashboard/profile-preview"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    My Atelier Profile
                  </Link>
                  <Link
                    href="/tailor-dashboard/portfolio"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    Work Portfolio
                  </Link>
                  <Link
                    href="/tailor-dashboard/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    Help & Support
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Navigation Bar */}
        <div className="border-t border-slate-100 bg-white px-6">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/tailor-dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#00c9b7] text-[#00c9b7] bg-teal-50/30'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}