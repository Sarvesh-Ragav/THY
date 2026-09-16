'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useSavedMeasurements } from '@/hooks/useSavedMeasurements';

export default function MyMeasurementsPage() {
  return (
    <RequireCustomerAuth>
      <MeasurementsContent />
    </RequireCustomerAuth>
  );
}

function MeasurementsContent() {
  const { measurements } = useSavedMeasurements();

  return (
    <CustomerPage titleKey="pageMeasurements">
      {measurements.length === 0 ? (
        <p className="text-sm text-thy-muted">No saved measurements yet. Add them from the stitching measurements step.</p>
      ) : (
        <ul className="space-y-3 max-w-lg">
          {measurements.map((item) => (
            <li key={item.id} className="thy-card p-4">
              <p>{item.label}</p>
              <p className="text-sm text-thy-muted">{item.details}</p>
            </li>
          ))}
        </ul>
      )}
    </CustomerPage>
  );
}
