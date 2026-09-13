'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { CustomerChatView } from '@/components/chat/CustomerChatView';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import type { ChatEntry } from '@/lib/c31';

export default function CustomerChatPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<p className="p-8 text-sm text-thy-subtle">Loading chat...</p>}>
        <ChatRoute />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function ChatRoute() {
  const searchParams = useSearchParams();
  const { session } = useTailorSession();
  const from = (searchParams.get('from') as ChatEntry | null) ?? 'profile';

  return (
    <CustomerChatView
      tailorId={searchParams.get('tailor')}
      from={from}
      designs={session.customerDesigns}
    />
  );
}
