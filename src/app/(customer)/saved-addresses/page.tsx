'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function SavedAddressesPage() {
  return (
    <RequireCustomerAuth>
      <SavedAddressesContent />
    </RequireCustomerAuth>
  );
}

function SavedAddressesContent() {
  const { session } = useTailorSession();
  const address = session.customerProfile?.address;

  return (
    <CustomerPage title="Saved Addresses">
      {address ? (
        <div className="max-w-lg border border-[#2C2418]/10 bg-white/40 p-5 text-sm text-[#5C5146]">
          <p>{session.customerProfile?.fullName}</p>
          <p>{address}</p>
          <p>{session.customerProfile?.city}</p>
        </div>
      ) : (
        <p className="text-sm text-[#5C5146]">No saved addresses yet.</p>
      )}
    </CustomerPage>
  );
}
