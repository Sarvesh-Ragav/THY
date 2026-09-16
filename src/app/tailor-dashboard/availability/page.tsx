'use client';

import React, { useEffect, useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';
import { useTailorSession } from '@/components/providers/TailorSessionProvider';
import { updateTailorAccount } from '@/lib/auth-api';
import { normalizeAvailability, schedulePayload } from '@/lib/tailor-studio';
import type { DayHours } from '@/lib/tailor-session';

export default function AvailabilityPage() {
  const { session, updateSession, accessToken } = useTailorSession();
  const current = normalizeAvailability(session.availability);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(current.isAvailable && !current.vacationMode);
  const [maxActiveCapacity, setMaxActiveCapacity] = useState(current.maxActiveCapacity);
  const [schedule, setSchedule] = useState<DayHours[]>(current.schedule);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const next = normalizeAvailability(session.availability);
    setIsAcceptingOrders(next.isAvailable && !next.vacationMode);
    setMaxActiveCapacity(next.maxActiveCapacity);
    setSchedule(next.schedule);
  }, [session.availability]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  const persist = async (nextSchedule: DayHours[], accepting: boolean, capacity: number) => {
    const availability = normalizeAvailability({
      isAvailable: accepting,
      vacationMode: !accepting,
      maxActiveCapacity: capacity,
      schedule: nextSchedule,
    });
    updateSession({ availability });
    if (accessToken) {
      await updateTailorAccount(
        {
          fullName: session.profile?.fullName,
          shopName: session.profile?.shopName,
          shopAddress: session.profile?.shopAddress,
          city: session.profile?.city,
          yearsOfExperience: Number.parseInt(session.profile?.yearsOfExperience || '0', 10) || 0,
          availability: {
            isAvailable: availability.isAvailable,
            vacationMode: availability.vacationMode,
            maxActiveCapacity: availability.maxActiveCapacity,
            schedule: schedulePayload(availability.schedule),
          },
        },
        accessToken
      ).catch(() => undefined);
    }
  };

  const handleToggleDay = (index: number) => {
    setSchedule((prev) => prev.map((item, i) => (i === index ? { ...item, isOpen: !item.isOpen } : item)));
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await persist(schedule, isAcceptingOrders, maxActiveCapacity);
      showToast('Availability settings & working hours updated successfully.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TailorPage title="Availability" description="Control order capacity, studio status, and daily working hours.">
      <div className="space-y-6">
        {toastMessage ? (
          <div className="bg-thy-mist border border-thy-burgundy text-thy-ink px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>{toastMessage}</span>
            <button type="button" onClick={() => setToastMessage(null)} className="text-thy-burgundy font-bold">
              ✕
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="thy-card p-5 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-thy-ink">Accepting New Orders</h3>
              <p className="text-xs text-thy-subtle">
                When turned off, customers will see your studio as temporarily booked/unavailable.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAcceptingOrders((value) => !value)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                isAcceptingOrders ? 'bg-thy-burgundy justify-end' : 'bg-thy-mist justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-thy-canvas/90 shadow-md" />
            </button>
          </div>

          <div className="thy-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-thy-ink">Active Order Capacity Threshold</h3>
            <p className="text-xs text-thy-subtle">
              Set the maximum number of concurrent active stitching orders your studio can handle.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="50"
                value={maxActiveCapacity}
                onChange={(event) => setMaxActiveCapacity(Number(event.target.value))}
                className="w-32 px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
              />
              <span className="text-xs text-thy-subtle">concurrent orders max</span>
            </div>
          </div>

          <div className="thy-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-thy-ink">Weekly Operating Hours</h3>
            <div className="space-y-3">
              {schedule.map((dayItem, index) => (
                <div
                  key={dayItem.day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-thy-mist/70 border border-thy-burgundy/10 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={dayItem.isOpen}
                      onChange={() => handleToggleDay(index)}
                      className="w-4 h-4 text-thy-burgundy accent-thy-burgundy rounded cursor-pointer"
                    />
                    <span className={`text-xs font-bold w-24 ${dayItem.isOpen ? 'text-thy-ink' : 'text-thy-subtle'}`}>
                      {dayItem.day}
                    </span>
                  </div>
                  {dayItem.isOpen ? (
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="time"
                        value={dayItem.openTime}
                        onChange={(event) => handleTimeChange(index, 'openTime', event.target.value)}
                        className="px-2 py-1 border rounded-lg bg-thy-canvas/90 focus:outline-none focus:ring-1 focus:ring-thy-burgundy"
                      />
                      <span className="text-thy-subtle">to</span>
                      <input
                        type="time"
                        value={dayItem.closeTime}
                        onChange={(event) => handleTimeChange(index, 'closeTime', event.target.value)}
                        className="px-2 py-1 border rounded-lg bg-thy-canvas/90 focus:outline-none focus:ring-1 focus:ring-thy-burgundy"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-100">
                      Closed / Off Day
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="thy-btn px-6 py-3 text-[11px] uppercase tracking-[0.16em] disabled:opacity-50"
            >
              {isLoading ? 'Saving Changes...' : 'Save Availability Settings'}
            </button>
          </div>
        </form>
      </div>
    </TailorPage>
  );
}
