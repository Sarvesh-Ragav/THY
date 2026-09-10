'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';

export default function MyOrdersPage() {
  return (
    <RequireCustomerAuth>
      <MyOrdersContent />
    </RequireCustomerAuth>
  );
}

function MyOrdersContent() {
  const { session } = useTailorSession();

  return (
    <CustomerPage title="My Orders">
      {session.customerOrders.length === 0 ? (
        <p className="text-sm text-thy-muted">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {session.customerOrders.map((order) => (
            <li key={order.id} className="border border-thy-ink/10 bg-thy-surface/80 p-4">
              <p>{order.title}</p>
              <p className="text-sm text-thy-subtle">{order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </CustomerPage>
  );
}
