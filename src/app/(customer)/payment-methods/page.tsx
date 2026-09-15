'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';

export default function PaymentMethodsPage() {
  return (
    <RequireCustomerAuth>
      <CustomerPage titleKey="pagePayments">
        <p className="text-sm text-thy-muted">No payment methods saved yet.</p>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
