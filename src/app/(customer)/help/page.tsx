import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';

export default function HelpPage() {
  return (
    <CustomerPage titleKey="pageHelp">
      <p className="text-sm text-thy-muted">Get help with designs, orders, and your THY account.</p>
    </CustomerPage>
  );
}
