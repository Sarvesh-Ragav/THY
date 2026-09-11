'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability & Slots</h1>
          <p className="text-xs text-gray-600">Control active order capacity, store status, and daily working hours.</p>
        </div>
        <Link href="/tailor-dashboard" className="text-sm font-semibold text-[#00c9b7] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-teal-50 border border-[#00c9b7] text-teal-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-teal-600 font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Master Order Intake Switch */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Accepting New Orders</h3>
            <p className="text-xs text-gray-500">
              When turned off, customers will see your studio as temporarily booked/unavailable.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isAcceptingOrders ? 'bg-[#00c9b7] justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>

        {/* Capacity Limits */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900">Active Order Capacity Threshold</h3>
          <p className="text-xs text-gray-500">
            Set the maximum number of concurrent active stitching orders your studio can handle.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="50"
              value={maxActiveCapacity}
              onChange={(e) => setMaxActiveCapacity(Number(e.target.value))}
              className="w-32 px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
            />
            <span className="text-xs text-gray-500">concurrent orders max</span>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Weekly Operating Hours</h3>
          <div className="space-y-3">
            {schedule.map((dayItem, index) => (
              <div
                key={dayItem.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100 gap-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={dayItem.isOpen}
                    onChange={() => handleToggleDay(index)}
                    className="w-4 h-4 text-[#00c9b7] accent-[#00c9b7] rounded cursor-pointer"
                  />
                  <span className={`text-xs font-bold w-24 ${dayItem.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                    {dayItem.day}
                  </span>
                </div>

                {dayItem.isOpen ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={dayItem.openTime}
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className="px-2 py-1 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#00c9b7]"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={dayItem.closeTime}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      className="px-2 py-1 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#00c9b7]"
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
            className="px-6 py-2.5 bg-[#00c9b7] text-white text-xs font-bold rounded-xl hover:bg-[#00b5a4] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving Changes...' : 'Save Availability Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}