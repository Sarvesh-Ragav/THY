'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function ProfilePage() {
  return (
    <RequireCustomerAuth>
      <ProfileContent />
    </RequireCustomerAuth>
  );
}

function ProfileContent() {
  const { session } = useTailorSession();
  const profile = session.customerProfile;

  return (
    <CustomerPage title="My Profile">
      <div className="max-w-lg border border-[#2C2418]/10 bg-white/40 p-5 space-y-2 text-sm text-[#5C5146]">
        <p>{profile?.fullName}</p>
        <p>{profile?.phone}</p>
        <p>{profile?.email}</p>
        <p>{profile?.city}</p>
        <p>{profile?.address}</p>
      </div>
    </CustomerPage>
  );
}
