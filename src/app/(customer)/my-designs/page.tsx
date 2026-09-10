'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function MyDesignsPage() {
  return (
    <RequireCustomerAuth>
      <MyDesignsContent />
    </RequireCustomerAuth>
  );
}

function MyDesignsContent() {
  const { session } = useTailorSession();

  return (
    <CustomerPage title="My Designs">
      {session.customerDesigns.length === 0 ? (
        <p className="text-sm text-[#5C5146]">No saved designs yet.</p>
      ) : (
        <ul className="space-y-3">
          {session.customerDesigns.map((design) => (
            <li key={design.id} className="border border-[#2C2418]/10 bg-white/40 p-4">
              {design.title}
            </li>
          ))}
        </ul>
      )}
    </CustomerPage>
  );
}
