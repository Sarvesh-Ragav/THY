import React from 'react';
import Link from 'next/link';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { DESIGNS } from '@/lib/customer-home-data';

export default function ExplorePage() {
  const trending = DESIGNS.filter((design) => design.trending);

  return (
    <CustomerPage title="Explore">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trending.map((design) => (
          <Link key={design.id} href={`/categories/${design.categoryId}`} className="overflow-hidden border border-[#2C2418]/10">
            <img src={design.image} alt="" className="h-40 w-full object-cover" />
            <p className="p-3 text-sm">{design.title}</p>
          </Link>
        ))}
      </div>
    </CustomerPage>
  );
}
