'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { searchCatalog } from '@/lib/customer-home-data';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { designs, tailors } = searchCatalog(query);

  return (
    <CustomerPage title="Search Results">
      {!query.trim() ? (
        <p className="text-sm text-thy-muted">Search designs, styles or tailors...</p>
      ) : designs.length === 0 && tailors.length === 0 ? (
        <p className="text-sm text-thy-muted">No results for “{query}”.</p>
      ) : (
        <div className="space-y-10">
          {designs.length > 0 && (
            <div>
              <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Designs</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {designs.map((design) => (
                  <Link key={design.id} href={`/categories/${design.categoryId}`} className="thy-card overflow-hidden">
                    <img src={design.image} alt="" className="h-32 sm:h-40 w-full object-cover" />
                    <p className="p-3 text-sm">{design.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {tailors.length > 0 && (
            <div>
              <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Tailors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {tailors.map((tailor) => {
                  const samples = [
                    ...tailor.portfolio.filter((item) => item.featured),
                    ...tailor.portfolio.filter((item) => !item.featured),
                  ].slice(0, 3);
                  return (
                    <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="thy-card overflow-hidden">
                      <img src={tailor.image} alt="" className="h-36 sm:h-40 w-full object-cover" />
                      <div className="p-4">
                        <p className="text-lg" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{tailor.name}</p>
                        <p className="text-sm text-thy-muted">{tailor.specialty}</p>
                        {samples.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-1.5">
                            {samples.map((item) => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.title}
                                className="h-12 w-full object-cover border border-thy-ink/10"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </CustomerPage>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<CustomerPage title="Search Results"><p className="text-sm text-thy-subtle">Loading...</p></CustomerPage>}>
      <SearchResults />
    </Suspense>
  );
}
