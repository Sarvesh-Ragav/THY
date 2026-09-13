import React from 'react';
import { notFound } from 'next/navigation';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { TAILORS } from '@/lib/customer-home-data';
import { chatHref } from '@/lib/c31';
import Link from 'next/link';

export default async function TailorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tailor = TAILORS.find((item) => item.id === id);
  if (!tailor) notFound();

  return (
    <CustomerPage title={tailor.name}>
      <div className="max-w-xl thy-card overflow-hidden">
        <img src={tailor.image} alt="" className="h-56 w-full object-cover" />
        <div className="p-5 space-y-4 text-sm text-thy-muted">
          <p>{tailor.studio}</p>
          <p>{tailor.city}</p>
          <p>{tailor.specialty}</p>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              href={chatHref(tailor.id, 'profile')}
              className="hero-leather-btn inline-flex items-center justify-center min-h-11 px-4 text-[11px] uppercase tracking-[0.16em]"
            >
              Chat
            </Link>
            <Link
              href={`/request-estimate?tailor=${encodeURIComponent(tailor.id)}`}
              className="inline-flex items-center justify-center min-h-11 px-4 text-sm border border-thy-ink/15"
            >
              Request estimate
            </Link>
          </div>
        </div>
      </div>
    </CustomerPage>
  );
}
