'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useC31 } from '@/hooks/useC31';

export default function MyMeasurementsPage() {
  return (
    <RequireCustomerAuth>
      <MeasurementsContent />
    </RequireCustomerAuth>
  );
}

function MeasurementsContent() {
  const { state } = useC31();

  return (
    <CustomerPage title="My Measurements">
      <ul className="space-y-3 max-w-lg">
        {state.measurements.map((item) => (
          <li key={item.id} className="thy-card p-4">
            <p>{item.label}</p>
            <p className="text-sm text-thy-muted">{item.details}</p>
          </li>
        ))}
      </ul>
    </CustomerPage>
  );
}
