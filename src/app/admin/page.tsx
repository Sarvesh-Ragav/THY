'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { AdminApiError, getAdminOverview, type AdminOverview } from '@/lib/admin-api';

function formatMoney(paise: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format((paise || 0) / 100);
}

function formatWhen(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function StatTile({
  label,
  value,
  hint,
  href,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block border p-4 transition-colors hover:border-thy-burgundy/45 ${
        accent ? 'border-thy-burgundy/35 bg-thy-burgundy text-white' : 'border-thy-burgundy/15 bg-thy-surface text-thy-ink'
      }`}
    >
      <p className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${accent ? 'text-white/75' : 'text-thy-subtle'}`}>
        {label}
      </p>
      <p className="mt-2 text-3xl leading-none" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        {value}
      </p>
      {hint ? <p className={`mt-2 text-xs ${accent ? 'text-white/80' : 'text-thy-muted'}`}>{hint}</p> : null}
    </Link>
  );
}

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

  const loading = !data && !error;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">Command center</p>
          <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            What needs attention
          </h1>
          <p className="mt-2 text-sm text-thy-muted max-w-2xl">
            Critical counts and live queues. Tap any block for the full list and actions.
          </p>
        </div>
        {data ? (
          <p className="text-xs uppercase tracking-[0.14em] text-thy-subtle">
            Paid revenue {formatMoney(data.paidRevenuePaise)}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-thy-muted">Loading live admin snapshot…</p> : null}

      {data ? (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile
              accent={data.pendingVerifications > 0}
              label="Pending verifications"
              value={data.pendingVerifications}
              hint="Review ID documents"
              href="/admin/tailors"
            />
            <StatTile
              accent={data.attentionCount > 0}
              label="Orders in delivery"
              value={data.attentionCount}
              hint="Paid · pending or stitching"
              href="/admin/orders"
            />
            <StatTile
              label="Verified tailors"
              value={data.verified}
              hint={`${data.directoryListed} listed publicly`}
              href="/admin/tailors"
            />
            <StatTile
              label="Active customers"
              value={data.activeCustomers}
              hint={`${data.disabledCustomers} disabled`}
              href="/admin/customers"
            />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Link
              href="/admin/tailors"
              className="xl:col-span-1 border border-thy-burgundy/15 bg-thy-surface p-5 hover:border-thy-burgundy/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-burgundy font-semibold">Tailors</p>
                  <h2 className="mt-1 text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {data.tailors} studios
                  </h2>
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-thy-subtle">Open →</span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Verified</dt>
                  <dd className="mt-1 text-lg font-semibold text-thy-ink">{data.verified}</dd>
                </div>
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Pending</dt>
                  <dd className="mt-1 text-lg font-semibold text-amber-800">{data.pendingVerifications}</dd>
                </div>
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Rejected</dt>
                  <dd className="mt-1 text-lg font-semibold text-rose-800">{data.rejected}</dd>
                </div>
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Not submitted</dt>
                  <dd className="mt-1 text-lg font-semibold text-thy-ink">{data.notSubmitted}</dd>
                </div>
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Directory on</dt>
                  <dd className="mt-1 text-lg font-semibold text-thy-ink">{data.directoryListed}</dd>
                </div>
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Disabled</dt>
                  <dd className="mt-1 text-lg font-semibold text-thy-ink">{data.disabledTailors}</dd>
                </div>
              </dl>
            </Link>

            <Link
              href="/admin/orders"
              className="xl:col-span-1 border border-thy-burgundy/15 bg-thy-surface p-5 hover:border-thy-burgundy/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-burgundy font-semibold">Orders</p>
                  <h2 className="mt-1 text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {data.orders} tracked
                  </h2>
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-thy-subtle">Open →</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-thy-subtle text-xs uppercase tracking-[0.12em] mb-2">Payment</p>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between gap-2"><span>Paid</span><strong>{data.payment.paid}</strong></li>
                    <li className="flex justify-between gap-2"><span>Pending</span><strong>{data.payment.pending}</strong></li>
                    <li className="flex justify-between gap-2"><span>Failed</span><strong>{data.payment.failed}</strong></li>
                    <li className="flex justify-between gap-2"><span>Cancelled</span><strong>{data.payment.cancelled}</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="text-thy-subtle text-xs uppercase tracking-[0.12em] mb-2">Delivery</p>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between gap-2"><span>Pending</span><strong>{data.fulfillment.pending}</strong></li>
                    <li className="flex justify-between gap-2"><span>In progress</span><strong>{data.fulfillment.in_progress}</strong></li>
                    <li className="flex justify-between gap-2"><span>Completed</span><strong>{data.fulfillment.completed}</strong></li>
                    <li className="flex justify-between gap-2"><span>Cancelled</span><strong>{data.fulfillment.cancelled}</strong></li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-xs text-thy-muted">Collected {formatMoney(data.paidRevenuePaise)} from paid orders.</p>
            </Link>

            <Link
              href="/admin/customers"
              className="xl:col-span-1 border border-thy-burgundy/15 bg-thy-surface p-5 hover:border-thy-burgundy/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-burgundy font-semibold">Customers</p>
                  <h2 className="mt-1 text-2xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {data.customers} profiles
                  </h2>
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-thy-subtle">Open →</span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Active</dt>
                  <dd className="mt-1 text-lg font-semibold">{data.activeCustomers}</dd>
                </div>
                <div>
                  <dt className="text-thy-subtle text-xs uppercase tracking-[0.12em]">Disabled</dt>
                  <dd className="mt-1 text-lg font-semibold">{data.disabledCustomers}</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-thy-burgundy/10 pt-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-thy-subtle mb-2">Recent signups</p>
                {data.recentCustomers.length === 0 ? (
                  <p className="text-sm text-thy-muted">No customers yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentCustomers.slice(0, 4).map((customer) => (
                      <li key={customer.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-medium">{customer.fullName}</span>
                        <span className="text-xs text-thy-subtle shrink-0">
                          {customer.city || '—'} · {formatWhen(customer.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-thy-burgundy/15 bg-thy-surface">
              <div className="px-5 py-4 border-b border-thy-burgundy/10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-burgundy font-semibold">Verification queue</p>
                  <h2 className="text-xl mt-1" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    Documents waiting review
                  </h2>
                </div>
                <Link href="/admin/tailors" className="text-[11px] uppercase tracking-[0.12em] text-thy-burgundy border-b border-thy-burgundy/40">
                  All tailors
                </Link>
              </div>
              {data.pendingQueue.length === 0 ? (
                <p className="px-5 py-6 text-sm text-thy-muted">No pending document reviews.</p>
              ) : (
                <ul className="divide-y divide-thy-burgundy/10">
                  {data.pendingQueue.map((item) => (
                    <li key={item.id}>
                      <Link
                        href="/admin/tailors"
                        className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-thy-mist/60 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{item.shopName}</p>
                          <p className="text-xs text-thy-muted truncate">
                            {item.fullName} · {item.city} · {item.documentCount} file{item.documentCount === 1 ? '' : 's'}
                          </p>
                        </div>
                        <span className="text-xs text-thy-subtle shrink-0">{formatWhen(item.submittedAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-thy-burgundy/15 bg-thy-surface">
              <div className="px-5 py-4 border-b border-thy-burgundy/10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-thy-burgundy font-semibold">Delivery queue</p>
                  <h2 className="text-xl mt-1" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    Paid orders to move
                  </h2>
                </div>
                <Link href="/admin/orders" className="text-[11px] uppercase tracking-[0.12em] text-thy-burgundy border-b border-thy-burgundy/40">
                  All orders
                </Link>
              </div>
              {data.attentionOrders.length === 0 ? (
                <p className="px-5 py-6 text-sm text-thy-muted">No paid orders waiting on delivery updates.</p>
              ) : (
                <ul className="divide-y divide-thy-burgundy/10">
                  {data.attentionOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        href="/admin/orders"
                        className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-thy-mist/60 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{order.garmentName}</p>
                          <p className="text-xs text-thy-muted truncate">
                            {order.tailorName} · {order.fulfillmentStatus.replace('_', ' ')} · {formatMoney(order.amountPaise)}
                          </p>
                        </div>
                        <span className="text-xs text-thy-subtle shrink-0">{formatWhen(order.createdAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
