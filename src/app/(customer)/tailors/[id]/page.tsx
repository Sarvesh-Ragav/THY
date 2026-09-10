import React from 'react';
import { notFound } from 'next/navigation';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { TAILORS } from '@/lib/customer-home-data';

export default async function TailorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tailor = TAILORS.find((item) => item.id === id);
  if (!tailor) notFound();

  return (
    <CustomerPage title={tailor.name}>
      <div className="max-w-xl border border-[#2C2418]/10 bg-white/40 overflow-hidden">
        <img src={tailor.image} alt="" className="h-56 w-full object-cover" />
        <div className="p-5 space-y-2 text-sm text-[#5C5146]">
          <p>{tailor.studio}</p>
          <p>{tailor.city}</p>
          <p>{tailor.specialty}</p>
        </div>
      </div>
    </CustomerPage>
  );
}
