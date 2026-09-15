import React from 'react';
import Link from 'next/link';
import { GARMENT_CATEGORIES, type GarmentCategory } from '@/lib/customer-home-data';

export function CategoryGrid({
  hrefFor,
}: {
  hrefFor?: (category: GarmentCategory) => string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {GARMENT_CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={hrefFor ? hrefFor(category) : `/categories/${category.id}`}
          className="relative min-h-[150px] sm:min-h-[180px] overflow-hidden"
        >
          <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-thy-deep/45" />
          <h3 className="relative z-10 p-3 sm:p-4 text-xl sm:text-2xl text-thy-canvas" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            {category.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
