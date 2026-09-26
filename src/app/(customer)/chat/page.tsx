'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { CustomerChatInbox } from '@/components/chat/CustomerChatInbox';
import { CustomerChatView } from '@/components/chat/CustomerChatView';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import type { ChatEntry } from '@/lib/c31';

export default function CustomerChatPage() {
  return (
    <RequireCustomerAuth>
      <Suspense fallback={<div className="p-8 text-sm text-thy-subtle" suppressHydrationWarning>Loading chat...</div>}>
        <ChatRoute />
      </Suspense>
    </RequireCustomerAuth>
  );
}

function ChatRoute() {
  const searchParams = useSearchParams();
  const { session } = useTailorSession();
  const tailorId = searchParams.get('tailor');
  const from = (searchParams.get('from') as ChatEntry | null) ?? 'profile';

  if (!tailorId) {
    return <CustomerChatInbox />;
  }

  return (
    <CustomerChatView
      tailorId={tailorId}
      from={from}
      designs={session.customerDesigns}
    />
  );
}
