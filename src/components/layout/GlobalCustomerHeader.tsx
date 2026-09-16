'use client';

import { usePathname } from 'next/navigation';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';

export function GlobalCustomerHeader() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/tailor-dashboard')) return null;
  return <CustomerNavbar />;
}
