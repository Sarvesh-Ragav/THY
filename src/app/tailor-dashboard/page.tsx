'use client';

import React from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { TailorPage } from '@/components/tailor/TailorPage';
import { getTailorFirstName, hasSubmittedVerification, isTailorVerified } from '@/lib/tailor-session';
import { updateTailorAccount } from '@/lib/auth-api';
import {
  activeOrders,
  completedOrders,
  earningsSummary,
  formatRupee,
  hoursSummary,
  pendingRequests,
  schedulePayload,
} from '@/lib/tailor-studio';

export default function TailorDashboardPage() {
  const { session, updateSession, accessToken } = useTailorSession();
  const displayName = getTailorFirstName(session);
  const incoming = pendingRequests(session.requests);
  const openOrders = activeOrders(session.orders);
  const doneOrders = completedOrders(session.orders);
  const earnings = earningsSummary(session.payouts, session.orders);
  const available = session.availability.isAvailable && !session.availability.vacationMode;
  const recentNotes = session.notifications.slice(0, 3);
  const portfolio = session.tailorPortfolio.slice(0, 5);
  const verified = isTailorVerified(session);
  const verificationPending = hasSubmittedVerification(session) && !verified;

  return (
    <TailorPage
      title={`Welcome back, ${displayName}`}
      description="Manage your tailoring orders and grow your business with THY."
      actions={
        <p className="hidden lg:block text-xs font-semibold text-thy-burgundy italic tracking-wide max-w-xs text-right">
          Your Skill, Our Support — A More Stylish Tomorrow
        </p>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            label="New Order Requests"
            value={String(incoming.length)}
            href="/tailor-dashboard/new-requests"
            linkLabel="View Requests →"
            image="https://images.unsplash.com/photo-1584208124888-3a20b9c799e2?auto=format&fit=crop&w=150&q=80"
            alt="Design Sketch"
          />
          <MetricCard
            label="Active Orders"
            value={String(openOrders.length)}
            href="/tailor-dashboard/active-orders"
            linkLabel="View Orders →"
            image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=150&q=80"
            alt="Sewing Machine"
          />
          <div className="thy-card p-4 flex items-center gap-4">
            <Thumb src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=150&q=80" alt="Finished Garments" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-thy-muted">Completed Orders</p>
              <p className="text-xl font-black text-thy-ink">{doneOrders.length}</p>
              <span className="text-[10px] text-thy-subtle font-medium">This Month</span>
            </div>
          </div>
          <MetricCard
            label="Total Earnings"
            value={formatRupee(earnings.netEarnings)}
            href="/tailor-dashboard/earnings"
            linkLabel="View Reports →"
            image="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=150&q=80"
            alt="Shopping Bags"
          />
          <div className="thy-card p-4 flex items-center gap-4">
            <Thumb src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=150&q=80" alt="Fashion Scissors" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-thy-muted">Verification Status</p>
              <span className="bg-thy-mist/80 text-thy-ink text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                {verified
                  ? '✓ Verified Tailor'
                  : session.verification?.status === 'rejected'
                    ? 'Verification rejected'
                    : verificationPending
                      ? 'Pending admin review'
                      : 'Verification required'}
              </span>
              <p className="text-[10px] text-thy-subtle block pt-0.5">
                {session.profile?.shopName || 'Your atelier'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ListCard
                title="New Order Requests"
                count={incoming.length}
                href="/tailor-dashboard/new-requests"
                empty="No new requests right now."
              >
                {incoming.slice(0, 3).map((request) => (
                  <WorkRow
                    key={request.id}
                    id={request.id}
                    name={request.customerName}
                    title={request.garmentType}
                    meta={request.requestDate ? `Requested ${request.requestDate}` : request.budgetEstimate || ''}
                    image={request.designPreview}
                    badge="New Request"
                    href="/tailor-dashboard/new-requests"
                  />
                ))}
              </ListCard>

              <ListCard
                title="Active Orders"
                count={openOrders.length}
                href="/tailor-dashboard/active-orders"
                empty="No active orders."
              >
                {openOrders.slice(0, 3).map((order) => (
                  <WorkRow
                    key={order.id}
                    id={order.id}
                    name={order.customerName}
                    title={order.garmentType}
                    meta={`Due ${order.expectedCompletion}`}
                    image={order.designPreview}
                    badge={order.status}
                    href="/tailor-dashboard/active-orders"
                  />
                ))}
              </ListCard>
            </div>

            <div
              className="rounded-2xl border border-thy-mist/70 p-5 shadow-xs relative overflow-hidden bg-cover bg-center text-white"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(63, 18, 24, 0.92), rgba(92, 26, 36, 0.75)), url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80')`,
              }}
            >
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="bg-thy-surface/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/30 uppercase tracking-wider">
                    Portfolio
                  </span>
                  <h3 className="text-base font-bold mt-2">
                    {session.profile?.shopName || `${displayName}'s atelier`}
                  </h3>
                  <p className="text-xs text-thy-cream mt-1 max-w-xl font-medium leading-relaxed">
                    {portfolio.length
                      ? `${portfolio.length} pieces published to your public preview.`
                      : 'Add work so customers see your public preview portfolio.'}
                  </p>
                </div>
                <Link
                  href="/tailor-dashboard/portfolio"
                  className="px-4 py-2 bg-thy-surface text-thy-ink text-xs font-extrabold rounded-xl hover:bg-thy-mist transition-colors shadow-sm shrink-0"
                >
                  {portfolio.length ? 'Manage Work' : 'Upload Work'}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="thy-card p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                  <h3 className="text-xs font-bold text-thy-ink">Recent Notifications</h3>
                  <Link href="/tailor-dashboard/notifications" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                    View All →
                  </Link>
                </div>
                {recentNotes.length === 0 ? (
                  <p className="text-xs text-thy-muted">No notifications yet.</p>
                ) : (
                  recentNotes.map((note) => (
                    <Link
                      key={note.id}
                      href={note.linkUrl || '/tailor-dashboard/notifications'}
                      className="flex justify-between text-thy-muted text-[11px] gap-3 hover:text-thy-burgundy"
                    >
                      <span className="font-medium">• {note.title}</span>
                      <span className="text-thy-subtle text-[10px] shrink-0">{note.timestamp}</span>
                    </Link>
                  ))
                )}
              </div>

              <div className="thy-card p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                  <h3 className="text-xs font-bold text-thy-ink">Recent customers</h3>
                  <Link href="/tailor-dashboard/chat" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                    Open Chat →
                  </Link>
                </div>
                {[...incoming, ...openOrders].slice(0, 3).length === 0 ? (
                  <p className="text-xs text-thy-muted">Customer chats will appear here.</p>
                ) : (
                  [...incoming, ...openOrders].slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[11px] gap-3">
                      <div>
                        <p className="font-bold text-thy-ink">{item.customerName}</p>
                        <p className="text-thy-muted truncate">{item.garmentType}</p>
                      </div>
                      <Link href="/tailor-dashboard/chat" className="text-thy-burgundy font-bold">
                        Chat
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="thy-card p-5 space-y-4">
              <h3 className="text-xs font-bold text-thy-ink">Your Availability</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-thy-ink">{available ? 'Available' : 'Busy'}</p>
                  <p className="text-[10px] text-thy-subtle font-medium">
                    {available ? hoursSummary(session.availability) : 'Currently paused for new orders.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = {
                      ...session.availability,
                      isAvailable: !session.availability.isAvailable,
                      vacationMode: session.availability.isAvailable,
                    };
                    updateSession({ availability: next });
                    if (accessToken) {
                      void updateTailorAccount(
                        {
                          fullName: session.profile?.fullName,
                          shopName: session.profile?.shopName,
                          shopAddress: session.profile?.shopAddress,
                          city: session.profile?.city,
                          yearsOfExperience: Number.parseInt(session.profile?.yearsOfExperience || '0', 10) || 0,
                          availability: {
                            isAvailable: next.isAvailable,
                            vacationMode: next.vacationMode,
                            maxActiveCapacity: next.maxActiveCapacity,
                            schedule: schedulePayload(next.schedule ?? []),
                          },
                        },
                        accessToken
                      ).catch(() => undefined);
                    }
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    available ? 'bg-thy-burgundy' : 'bg-thy-mist'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-thy-surface transition-transform shadow-xs ${
                      available ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <Link
                href="/tailor-dashboard/availability"
                className="block w-full text-center py-2.5 border border-thy-burgundy/15 rounded-xl text-xs font-bold text-thy-muted hover:bg-thy-mist/80 transition-colors"
              >
                Manage Availability →
              </Link>
            </div>

            <div className="thy-card p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                <h3 className="text-xs font-bold text-thy-ink">Earnings & Reports</h3>
                <Link href="/tailor-dashboard/earnings" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                  View Reports →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <p className="text-sm font-black text-thy-ink">{formatRupee(earnings.netEarnings)}</p>
                  <p className="text-[10px] text-thy-subtle font-medium">Net earnings</p>
                </div>
                <div>
                  <p className="text-sm font-black text-thy-ink">{doneOrders.length}</p>
                  <p className="text-[10px] text-thy-subtle font-medium">Completed</p>
                </div>
                <div>
                  <p className="text-sm font-black text-thy-ink">{formatRupee(earnings.averageOrder)}</p>
                  <p className="text-[10px] text-thy-subtle font-medium">Avg. order</p>
                </div>
              </div>
            </div>

            <div className="thy-card p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
                <h3 className="text-xs font-bold text-thy-ink">Your Portfolio</h3>
                <Link href="/tailor-dashboard/portfolio" className="text-[11px] font-bold text-thy-burgundy hover:underline">
                  View Portfolio →
                </Link>
              </div>
              {portfolio.length === 0 ? (
                <p className="text-xs text-thy-muted">Add pieces to show on your public preview.</p>
              ) : (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {portfolio.map((item) => (
                    <img
                      key={item.id}
                      src={item.image}
                      alt={item.title}
                      className="w-full h-16 object-cover rounded-xl border border-thy-burgundy/10 shadow-2xs"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TailorPage>
  );
}

function Thumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-12 h-12 rounded-2xl bg-thy-mist/80 border border-thy-mist text-thy-burgundy flex items-center justify-center shrink-0 overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

function MetricCard({
  label,
  value,
  href,
  linkLabel,
  image,
  alt,
}: {
  label: string;
  value: string;
  href: string;
  linkLabel: string;
  image: string;
  alt: string;
}) {
  return (
    <div className="thy-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <Thumb src={image} alt={alt} />
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-thy-muted">{label}</p>
        <p className="text-xl font-black text-thy-ink">{value}</p>
        <Link href={href} className="text-[11px] font-bold text-thy-burgundy hover:underline block">
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}

function ListCard({
  title,
  count,
  href,
  empty,
  children,
}: {
  title: string;
  count: number;
  href: string;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <div className="thy-card p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-thy-burgundy/10 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-thy-ink">{title}</h2>
          <span className="bg-thy-burgundy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{count}</span>
        </div>
        <Link href={href} className="text-xs font-bold text-thy-burgundy hover:underline">
          View All →
        </Link>
      </div>
      <div className="space-y-3">{count === 0 ? <p className="text-xs text-thy-muted">{empty}</p> : children}</div>
    </div>
  );
}

function WorkRow({
  id,
  name,
  title,
  meta,
  image,
  badge,
  href,
}: {
  id: string;
  name: string;
  title: string;
  meta: string;
  image?: string;
  badge: string;
  href: string;
}) {
  return (
    <div className="p-3 bg-thy-mist/70 rounded-2xl flex items-center justify-between gap-3 border border-thy-burgundy/10">
      <div className="flex items-center gap-3 min-w-0">
        {image ? (
          <img src={image} alt={title} className="w-14 h-16 object-cover rounded-xl shrink-0 border border-thy-burgundy/15" />
        ) : (
          <div className="w-14 h-16 rounded-xl bg-thy-mist shrink-0" />
        )}
        <div className="space-y-0.5 text-xs min-w-0">
          <p className="font-extrabold text-thy-ink">{id}</p>
          <p className="font-bold text-thy-ink truncate">{name}</p>
          <p className="text-thy-muted text-[11px] truncate">{title}</p>
          <p className="text-[10px] text-thy-subtle font-medium">{meta}</p>
        </div>
      </div>
      <div className="text-right space-y-2 shrink-0">
        <span className="bg-thy-mist text-thy-burgundy font-bold px-2 py-0.5 rounded-md text-[9px] inline-block">
          {badge}
        </span>
        <Link
          href={href}
          className="px-3 py-1.5 bg-thy-burgundy text-white rounded-xl text-xs font-bold hover:bg-thy-brand-active block text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
