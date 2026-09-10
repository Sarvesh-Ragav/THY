'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { NOTIFICATION_STATES } from '@/lib/customer-home-data';

export default function NotificationsPage() {
  return (
    <RequireCustomerAuth>
      <CustomerPage title="Notifications">
        <ul className="space-y-3">
          {NOTIFICATION_STATES.map((item) => (
            <li key={item.id} className="border border-thy-ink/10 bg-thy-surface/80 p-4">
              <p className="text-sm font-medium">{item.type}</p>
              <p className="text-sm text-thy-muted mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
