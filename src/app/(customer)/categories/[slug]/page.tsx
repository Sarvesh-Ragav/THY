import React from 'react';
import { notFound } from 'next/navigation';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { designsByCategory, GARMENT_CATEGORIES } from '@/lib/customer-home-data';

export default async function CategoryResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = GARMENT_CATEGORIES.find((item) => item.id === slug);
  if (!category) notFound();
  const designs = designsByCategory(slug);

  return (
    <CustomerPage title={category.title}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {designs.map((design) => (
          <div key={design.id} className="overflow-hidden border border-[#2C2418]/10">
            <img src={design.image} alt="" className="h-40 w-full object-cover" />
            <p className="p-3 text-sm">{design.title}</p>
          </div>
        ))}
      </div>
    </CustomerPage>
  );
}
