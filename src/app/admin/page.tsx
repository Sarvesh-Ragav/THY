'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AdminApiError, getAdminOverview, type AdminOverview } from '@/lib/admin-api';

export default function AdminOverviewPage() {
  const { accessToken } = useTailorSession();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    getAdminOverview(accessToken)
      .then((overview) => {
        if (!cancelled) setData(overview);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof AdminApiError ? err.message : 'Unable to load overview.');
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const cards = [
    { label: 'Tailors', value: data?.tailors ?? '—', href: '/admin/tailors' },
    { label: 'Pending verifications', value: data?.pendingVerifications ?? '—', href: '/admin/tailors' },
    { label: 'Customers', value: data?.customers ?? '—', href: '/admin/customers' },
    { label: 'Orders', value: data?.orders ?? '—', href: '/admin/orders' },
  ];

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">Dashboard</p>
      <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Admin overview
      </h1>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="thy-card p-5 hover:border-thy-burgundy/40 transition-colors">
            <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">{card.label}</p>
            <p className="mt-3 text-3xl text-thy-ink" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
