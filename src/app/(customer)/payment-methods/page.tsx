'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';

export default function PaymentMethodsPage() {
  return (
    <RequireCustomerAuth>
      <CustomerPage title="Payment Methods">
        <p className="text-sm text-[#5C5146]">No payment methods saved yet.</p>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
