import React from 'react';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { CustomerPage } from '@/components/customer/CustomerPage';

export default function CategoriesPage() {
  return (
    <CustomerPage titleKey="pageCategories">
      <CategoryGrid />
    </CustomerPage>
  );
}
