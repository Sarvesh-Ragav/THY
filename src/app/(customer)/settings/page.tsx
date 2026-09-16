'use client';

import React from 'react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { useAppearance } from '@/components/providers/AppearanceProvider';

export default function CustomerSettingsPage() {
  const { t } = useAppearance();
  return (
    <CustomerPage titleKey="menuSettings">
      <p className="text-sm text-thy-muted -mt-2 mb-6">{t('settingsSub')}</p>
      <AccountSettings />
    </CustomerPage>
  );
}
