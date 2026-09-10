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
            <li key={item.id} className="border border-[#2C2418]/10 bg-white/40 p-4">
              <p className="text-sm font-medium">{item.type}</p>
              <p className="text-sm text-[#5C5146] mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </CustomerPage>
    </RequireCustomerAuth>
  );
}
