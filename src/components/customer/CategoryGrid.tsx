import React from 'react';
import Link from 'next/link';
import { GARMENT_CATEGORIES } from '@/lib/customer-home-data';

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {GARMENT_CATEGORIES.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`} className="relative min-h-[180px] overflow-hidden">
          <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#2C2418]/40" />
          <h3 className="relative z-10 p-4 text-2xl text-[#F3EEE4]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {category.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
