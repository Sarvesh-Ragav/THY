'use client';

import React from 'react';
import Link from 'next/link';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { WORKING_DAYS, WorkingDay } from '@/lib/tailor-session';

export default function AvailabilityPage() {
  const { session, updateSession } = useTailorSession();
  const { isAvailable, vacationMode, workingDays } = session.availability;

  const updateAvailability = (partial: Partial<typeof session.availability>) => {
    updateSession({
      availability: {
        ...session.availability,
        ...partial,
      },
    });
  };

  const toggleDay = (day: WorkingDay) => {
    updateAvailability({
      workingDays: {
        ...workingDays,
        [day]: !workingDays[day],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-thy-ink">Availability Management</h1>
          <p className="text-sm text-thy-muted">Control when your studio accepts incoming stitching requests.</p>
        </div>
        <Link
          href="/tailor-dashboard"
          className="text-sm font-semibold text-thy-brand hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-thy-surface p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-thy-ink">Instant Order Reception</h2>
          <p className="text-xs text-thy-muted">
            {isAvailable && !vacationMode
              ? 'You are currently visible to customers and receiving new order requests.'
              : 'You are marked as unavailable. New customers cannot send order requests.'}
          </p>
        </div>

        <button
          onClick={() => updateAvailability({ isAvailable: !isAvailable, vacationMode: !isAvailable ? false : vacationMode })}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isAvailable && !vacationMode
              ? 'bg-thy-brand text-white hover:bg-thy-brand-hover'
              : 'bg-thy-mist text-thy-muted hover:bg-thy-mist'
          }`}
        >
          {isAvailable && !vacationMode ? '● Status: Available' : '○ Status: Unavailable'}
        </button>
      </div>

      <div className="bg-thy-surface p-6 rounded-2xl shadow-sm border border-thy-ink/10 space-y-4">
        <h2 className="text-lg font-bold text-thy-ink">Weekly Schedule</h2>
        <p className="text-xs text-thy-muted">Select the days your tailoring studio operates:</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {WORKING_DAYS.map((day) => {
            const active = workingDays[day];
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  active
                    ? 'border-thy-brand bg-thy-mist text-thy-brand font-bold'
                    : 'border-thy-ink/10 bg-thy-bg text-thy-subtle font-medium'
                }`}
              >
                <div className="text-xs">{day}</div>
                <div className="text-[10px] mt-1">{active ? 'Open' : 'Closed'}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-thy-surface p-6 rounded-2xl shadow-sm border border-thy-ink/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-thy-ink">Vacation Mode</h2>
          <p className="text-xs text-thy-muted">Temporarily pause all store interactions for extended periods.</p>
        </div>

        <input
          type="checkbox"
          checked={vacationMode}
          onChange={(e) => updateAvailability({ vacationMode: e.target.checked })}
          className="w-5 h-5 accent-thy-brand cursor-pointer"
        />
      </div>
    </div>
  );
}
