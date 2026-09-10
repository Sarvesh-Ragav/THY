import React from 'react';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { studioPreviewHref } from '@/lib/design-studio';

export default function StitchYourOutfitPage() {
  return (
    <CustomerPage title="Dress Category Selection">
      <p className="text-sm text-thy-muted mb-6">
        Choose a garment. We will visualize it on your uploaded fabric.
      </p>
      <CategoryGrid hrefFor={(category) => studioPreviewHref(category.id)} />
    </CustomerPage>
  );
}
