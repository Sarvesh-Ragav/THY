'use client';

import React, { useState } from 'react';
import { TailorPage } from '@/components/tailor/TailorPage';

interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const initialSchedule: DaySchedule[] = [
  { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '17:00' },
  { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '17:00' },
];

export default function AvailabilityPage() {
  const [isAcceptingOrders, setIsAcceptingOrders] = useState<boolean>(true);
  const [maxActiveCapacity, setMaxActiveCapacity] = useState<number>(10);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isOpen: !item.isOpen } : item))
    );
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Availability settings & working hours updated successfully.');
    }, 400);
  };

  return (
    <TailorPage
      title="Availability"
      description="Control order capacity, studio status, and daily working hours."
    >
      <div className="space-y-6">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-thy-mist border border-thy-burgundy text-thy-ink px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-thy-burgundy font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Master Order Intake Switch */}
        <div className="thy-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-thy-ink">Accepting New Orders</h3>
            <p className="text-xs text-thy-subtle">
              When turned off, customers will see your studio as temporarily booked/unavailable.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isAcceptingOrders ? 'bg-thy-burgundy justify-end' : 'bg-thy-mist justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-thy-canvas/90 shadow-md transform transition-transform" />
          </button>
        </div>

        {/* Capacity Limits */}
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
              onChange={(e) => setMaxActiveCapacity(Number(e.target.value))}
              className="w-32 px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-thy-burgundy"
            />
            <span className="text-xs text-thy-subtle">concurrent orders max</span>
          </div>
        </div>

        {/* Weekly Schedule */}
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
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className="px-2 py-1 border rounded-lg bg-thy-canvas/90 focus:outline-none focus:ring-1 focus:ring-thy-burgundy"
                    />
                    <span className="text-thy-subtle">to</span>
                    <input
                      type="time"
                      value={dayItem.closeTime}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
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

        {/* Save Button */}
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