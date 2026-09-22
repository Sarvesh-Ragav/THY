'use client';

import React from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { TailorPage } from '@/components/tailor/TailorPage';
import { PublicTailorProfile } from '@/components/tailor/PublicTailorProfile';
import type { PublicDirectoryTailor } from '@/lib/directory';

export default function TailorProfilePreviewPage() {
  const { session } = useTailorSession();

  const displayName = session.profile?.fullName || 'Tailor';
  const displayBusinessName = session.profile?.shopName || (displayName !== 'Tailor' ? `${displayName}'s Boutique` : 'Your atelier');
  const displayLocation = session.profile?.city || session.profile?.shopAddress || session.selectedLocation || 'India';
  const years = Number.parseInt(session.profile?.yearsOfExperience || '0', 10) || 0;
  const specialties = ['Custom stitching'];

  const tailor: PublicDirectoryTailor = {
    id: 'preview',
    name: displayName,
    studio: displayBusinessName,
    city: displayLocation,
    shopAddress: session.profile?.shopAddress || displayLocation,
    image: session.tailorPortfolio[0]?.image || '/hero/fabric-charcoal.png',
    bio: 'Specializing in designer blouses, custom Anarkalis, lehengas, and precision-fit alterations.',
    specialty: specialties[0],
    specialties,
    yearsExperience: years,
    rating: 0,
    reviewCount: 0,
    verified: session.verification?.status === 'approved',
    pricingStartingAt: 800,
    turnaroundDays: 5,
    acceptingOrders: session.availability.isAvailable && !session.availability.vacationMode,
    schedule: session.availability.schedule,
    portfolio: (session.tailorPortfolio ?? []).map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      image: item.image,
      isFeatured: Boolean(item.isFeatured) || index < 2,
    })),
  };

  return (
    <TailorPage
      title="Public Profile"
      description="This is how customers view your atelier, services, and portfolio."
      actions={
        <div className="flex items-center gap-2 bg-thy-mist p-1.5 w-full sm:w-auto">
          <Link
            href="/tailor-dashboard/portfolio"
            className="flex-1 sm:flex-none px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-thy-muted hover:text-thy-ink text-center"
          >
            Management
          </Link>
          <span className="flex-1 sm:flex-none px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] bg-thy-burgundy text-white text-center">
            Preview
          </span>
        </div>
      }
    >
      <PublicTailorProfile tailor={tailor} />
    </TailorPage>
  );
}
