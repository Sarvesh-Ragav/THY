'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useC31 } from '@/hooks/useC31';
import { chatHref } from '@/lib/c31';

export default function MyOrdersPage() {
  return (
    <RequireCustomerAuth>
      <MyOrdersContent />
    </RequireCustomerAuth>
  );
}

function MyOrdersContent() {
  const { session } = useTailorSession();
  const { state } = useC31();
  const orders = [
    ...state.orders.map((order) => ({
      id: order.id,
      title: order.title,
      status: order.status,
      threadId: order.threadId,
      tailorName: order.tailorName,
    })),
    ...session.customerOrders
      .filter((order) => !state.orders.some((item) => item.id === order.id))
      .map((order) => ({
        id: order.id,
        title: order.title,
        status: order.status,
        threadId: '',
        tailorName: '',
      })),
  ];

  return (
    <CustomerPage title="My Orders">
      {orders.length === 0 ? (
        <p className="text-sm text-thy-muted">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const thread = state.threads.find((item) => item.id === order.threadId);
            return (
              <li key={order.id} className="thy-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p>{order.title}</p>
                  <p className="text-sm text-thy-subtle">{order.status}</p>
                  {order.tailorName && <p className="text-xs text-thy-muted">{order.tailorName}</p>}
                </div>
                {thread && (
                  <Link
                    href={chatHref(thread.tailorId, 'order')}
                    className="inline-flex items-center justify-center min-h-11 px-4 border border-thy-ink/15 text-sm"
                  >
                    Chat
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </CustomerPage>
  );
}
