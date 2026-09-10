import React from 'react';
import Link from 'next/link';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { TAILORS } from '@/lib/customer-home-data';

export default function TailorsPage() {
  return (
    <CustomerPage title="Tailors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TAILORS.map((tailor) => (
          <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="thy-card overflow-hidden hover:border-thy-brand/40 transition-colors">
            <img src={tailor.image} alt="" className="h-36 sm:h-40 w-full object-cover" />
            <div className="p-4">
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{tailor.name}</h2>
              <p className="text-sm text-thy-muted">{tailor.studio}</p>
              <p className="text-sm text-thy-muted">{tailor.city} · {tailor.specialty}</p>
            </div>
          </Link>
        ))}
      </div>
    </CustomerPage>
  );
}
