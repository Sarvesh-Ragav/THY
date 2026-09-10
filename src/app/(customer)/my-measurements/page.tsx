'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';

export default function MyMeasurementsPage() {
  return (
    <RequireCustomerAuth>
      <CustomerPage title="My Measurements">
        <p className="text-sm text-[#5C5146]">No measurements saved yet.</p>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
