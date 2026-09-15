import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';

export default function AboutPage() {
  return (
    <CustomerPage titleKey="pageAbout">
      <p className="text-sm text-thy-muted">Your Fabric. Your Style. Your Tailor.</p>
    </CustomerPage>
  );
}
