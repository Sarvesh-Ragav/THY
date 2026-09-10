import React from 'react';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { CustomerPage } from '@/components/customer/CustomerPage';

export default function StitchYourOutfitPage() {
  return (
    <CustomerPage title="Dress Category Selection">
      <CategoryGrid />
    </CustomerPage>
  );
}
