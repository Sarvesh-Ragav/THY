'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';

export default function SettingsPage() {
  return (
    <RequireCustomerAuth>
      <CustomerPage title="Settings">
        <p className="text-sm text-thy-muted">Account settings.</p>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
