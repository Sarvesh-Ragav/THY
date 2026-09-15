'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';

export default function WishlistPage() {
  return (
    <RequireCustomerAuth>
      <CustomerPage title="Wishlist">
        <div className="space-y-4">
          <p className="text-sm text-thy-muted">No saved pieces yet. Browse designs and heart the ones you love.</p>
          <Link
            href="/explore"
            className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.18em]"
          >
            Explore designs
          </Link>
        </div>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
