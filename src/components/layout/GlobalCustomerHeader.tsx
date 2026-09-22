'use client';

import { usePathname } from 'next/navigation';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';

const HIDE_NAV_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/customer-registration',
  '/customer-preferences',
  '/tailor-registration',
  '/tailor-verification',
  '/tailor-dashboard',
  '/admin',
];

export function GlobalCustomerHeader() {
  const pathname = usePathname() || '';
  if (HIDE_NAV_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }
  return <CustomerNavbar />;
}
