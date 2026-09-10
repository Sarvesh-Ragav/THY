'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);
  const [workingDays, setWorkingDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: false,
  });

  const toggleDay = (day: keyof typeof workingDays) => {
    setWorkingDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
          <p className="text-sm text-gray-600">Control when your studio accepts incoming stitching requests.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-[#00c9b7] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Status Toggle Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Instant Order Reception</h2>
          <p className="text-xs text-gray-600">
            {isAvailable 
              ? 'You are currently visible to customers and receiving new order requests.' 
              : 'You are marked as unavailable. New customers cannot send order requests.'}
          </p>
        </div>

        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isAvailable 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {isAvailable ? '● Status: Available' : '○ Status: Unavailable'}
        </button>
      </div>

      {/* Working Days & Schedule */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
        <p className="text-xs text-gray-600">Select the days your tailoring studio operates:</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {Object.entries(workingDays).map(([day, active]) => (
            <button
              key={day}
              onClick={() => toggleDay(day as keyof typeof workingDays)}
              className={`p-3 rounded-xl border text-center transition-all ${
                active 
                  ? 'border-[#00c9b7] bg-teal-50 text-[#00c9b7] font-bold' 
                  : 'border-gray-200 bg-gray-50 text-gray-400 font-medium'
              }`}
            >
              <div className="text-xs">{day}</div>
              <div className="text-[10px] mt-1">{active ? 'Open' : 'Closed'}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vacation Mode Toggle */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Vacation Mode</h2>
          <p className="text-xs text-gray-600">Temporarily pause all store interactions for extended periods.</p>
        </div>

        <input
          type="checkbox"
          checked={vacationMode}
          onChange={(e) => setVacationMode(e.target.checked)}
          className="w-5 h-5 accent-[#00c9b7] cursor-pointer"
        />
      </div>
    </div>
  );
}