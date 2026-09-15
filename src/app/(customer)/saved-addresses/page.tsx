'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';

export default function SavedAddressesPage() {
  return (
    <RequireCustomerAuth>
      <SavedAddressesContent />
    </RequireCustomerAuth>
  );
}

function SavedAddressesContent() {
  const { session } = useTailorSession();
  const { label, detecting } = useCustomerLocation();
  const address = session.customerProfile?.address;

  return (
    <CustomerPage titleKey="pageAddresses">
      {address ? (
        <div className="max-w-lg border border-thy-ink/10 bg-thy-surface/80 p-5 text-sm text-thy-muted">
          <p>{session.customerProfile?.fullName}</p>
          <p>{address}</p>
          <p>{label || (detecting ? 'Detecting location…' : session.customerProfile?.city)}</p>
        </div>
      ) : (
        <p className="text-sm text-thy-muted">No saved addresses yet.</p>
      )}
    </CustomerPage>
  );
}
