'use client';

import React from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { useAppearance } from '@/components/providers/AppearanceProvider';

export default function TailorSettingsPage() {
  const { t } = useAppearance();
  return (
    <TailorPage title={t('menuSettings')} description={t('settingsSub')}>
      <AccountSettings />
    </TailorPage>
  );
}
