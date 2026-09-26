'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, LogOut } from 'lucide-react';
import { CustomerPage } from '@/components/customer/CustomerPage';
import { RequireCustomerAuth } from '@/components/customer/RequireCustomerAuth';
import { useAppearance } from '@/components/providers/AppearanceProvider';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';
import { PROFILE_MENU } from '@/lib/customer-home-data';
import { PROFILE_I18N } from '@/lib/i18n';

export default function ProfilePage() {
  return (
    <RequireCustomerAuth>
      <ProfileContent />
    </RequireCustomerAuth>
  );
}

function ProfileContent() {
  const { session, logout } = useTailorSession();
  const { t } = useAppearance();
  const { label, detecting } = useCustomerLocation();
  const pathname = usePathname();
  const router = useRouter();
  const profile = session.customerProfile;
  const location = label || (detecting ? 'Detecting location…' : profile?.city || '');

  const details = [
    { label: 'Name', value: profile?.fullName || 'Your profile' },
    { label: 'Phone', value: profile?.phone || '' },
    { label: 'Email', value: profile?.email || session.identifier || '' },
    { label: 'Location', value: location },
    { label: 'Address', value: profile?.address || '' },
  ].filter((item) => item.value);

  const handleLogout = () => {
    logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <CustomerPage titleKey="pageProfile">
      <div className="max-w-lg space-y-6">
        <div className="border border-thy-ink/10 bg-thy-surface/80 p-5 space-y-3">
          {details.map((item) => (
            <div key={item.label}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-thy-subtle">{item.label}</p>
              <p className="mt-0.5 text-sm text-thy-ink break-words">{item.value}</p>
            </div>
          ))}
        </div>

        <nav className="border border-thy-ink/10 bg-thy-surface/80 divide-y divide-thy-ink/10" aria-label="Account">
          {PROFILE_MENU.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 px-4 min-h-12 text-sm ${
                  active ? 'text-thy-brand font-semibold bg-thy-mist' : 'text-thy-ink hover:bg-thy-mist'
                }`}
              >
                <span>{t(PROFILE_I18N[item.href])}</span>
                <ChevronRight size={16} className="text-thy-subtle shrink-0" />
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between gap-3 px-4 min-h-12 text-sm font-semibold text-thy-brand hover:bg-thy-mist"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut size={14} />
              {t('navLogout')}
            </span>
            <ChevronRight size={16} className="text-thy-subtle shrink-0" />
          </button>
        </nav>
      </div>
    </CustomerPage>
  );
}
