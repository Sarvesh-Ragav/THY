'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { asFabricTreatments, getStudioGarment, studioPreviewHref } from '@/lib/design-studio';
import { GarmentVisualization } from '@/components/studio/GarmentVisualization';

export default function MyDesignsPage() {
  return (
    <RequireCustomerAuth>
      <MyDesignsContent />
    </RequireCustomerAuth>
  );
}

function MyDesignsContent() {
  const { session } = useTailorSession();

  return (
    <CustomerPage title="My Designs">
      {session.customerDesigns.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-thy-muted">No saved designs yet.</p>
          <Link
            href="/stitch-your-outfit"
            className="hero-leather-btn inline-flex px-6 py-3 text-[11px] uppercase tracking-[0.18em]"
          >
            Stitch Your Outfit
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {session.customerDesigns.map((design) => {
            const preset = design.categoryId ? getStudioGarment(design.categoryId) : null;
            return (
              <li key={design.id} className="thy-card overflow-hidden">
                {preset && (
                  <div className="h-40 bg-thy-mist">
                    <GarmentVisualization
                      silhouette={preset.silhouette}
                      treatments={asFabricTreatments(design.treatments)}
                      fabricImage={design.fabricImage || preset.fabricImage}
                      patternId={`saved-${design.id}`}
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <p className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{design.title}</p>
                  {design.fabric && <p className="text-sm text-thy-muted">{design.fabric}</p>}
                  {design.treatments && design.treatments.length > 0 && (
                    <p className="text-xs text-thy-subtle">{design.treatments.join(' · ')}</p>
                  )}
                  {design.categoryId && (
                    <Link
                      href={studioPreviewHref(design.categoryId)}
                      className="inline-block text-[11px] uppercase tracking-[0.16em] text-thy-brand border-b border-thy-brand"
                    >
                      Open visualization
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </CustomerPage>
  );
}
