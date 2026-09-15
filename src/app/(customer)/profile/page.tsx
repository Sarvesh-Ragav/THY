'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';

export default function ProfilePage() {
  return (
    <RequireCustomerAuth>
      <ProfileContent />
    </RequireCustomerAuth>
  );
}

function ProfileContent() {
  const { session } = useTailorSession();
  const { label, detecting } = useCustomerLocation();
  const profile = session.customerProfile;

  return (
    <CustomerPage titleKey="pageProfile">
      <div className="max-w-lg border border-thy-ink/10 bg-thy-surface/80 p-5 space-y-2 text-sm text-thy-muted">
        <p>{profile?.fullName || 'Your profile'}</p>
        <p>{profile?.phone}</p>
        <p>{profile?.email || session.identifier}</p>
        <p>{label || (detecting ? 'Detecting location…' : profile?.city)}</p>
        <p>{profile?.address}</p>
      </div>
    </CustomerPage>
  );
}
