'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import {
  AdminApiError,
  listAdminCustomers,
  setAdminUserActive,
  type AdminCustomer,
} from '@/lib/admin-api';

export default function AdminCustomersPage() {
  const { accessToken } = useTailorSession();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await listAdminCustomers(accessToken);
      setCustomers(data.customers);
      setError(null);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Unable to load customers.');
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-thy-burgundy font-semibold">Accounts</p>
      <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        Manage customers
      </h1>
      <p className="mt-2 text-sm text-thy-muted">View customer profiles and activate or deactivate accounts.</p>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {customers.length === 0 ? (
          <p className="text-sm text-thy-muted">No customer profiles yet.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="thy-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                  {customer.fullName}
                </h2>
                <p className="text-sm text-thy-muted">
                  {customer.email || 'No email'} · {customer.phone || 'No phone'} · {customer.city}
                </p>
                {customer.address ? <p className="text-xs text-thy-subtle mt-1">{customer.address}</p> : null}
                <p className="text-xs uppercase tracking-[0.14em] mt-2">
                  Status: <span className="font-semibold text-thy-burgundy">{customer.isActive ? 'active' : 'disabled'}</span>
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === customer.id || !accessToken}
                className="px-3 py-2 text-[11px] uppercase tracking-[0.12em] border border-thy-burgundy/30 disabled:opacity-50 shrink-0"
                onClick={async () => {
                  if (!accessToken) return;
                  setBusyId(customer.id);
                  try {
                    await setAdminUserActive(accessToken, customer.id, !customer.isActive);
                    await load();
                  } catch (err) {
                    setError(err instanceof AdminApiError ? err.message : 'Action failed.');
                  } finally {
                    setBusyId(null);
                  }
                }}
              >
                {customer.isActive ? 'Disable account' : 'Enable account'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
