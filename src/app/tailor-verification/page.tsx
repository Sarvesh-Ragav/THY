"use client";

import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight, Scissors } from "lucide-react";

export default function TailorVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Brand Teal Header Banner */}
        <div className="bg-[#00c49f] p-8 text-white text-center flex flex-col items-center">
          <Scissors className="h-10 w-10 mb-2" />
          <h1 className="text-2xl font-bold tracking-wide">THY</h1>
          <p className="text-xs text-teal-100 mt-0.5">Tailoring, connected.</p>
        </div>

        {/* Card Content */}
        <div className="p-8 text-center">
          
          <h2 className="text-xl font-bold text-gray-900">Registration Submitted!</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Your profile details have been successfully saved and sent for verification.
          </p>

          {/* Verification Status Card */}
          <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100 text-left space-y-3.5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-700">Estimated Time</p>
                <p className="text-xs text-gray-500">Verification usually takes 24 – 48 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-[#00c49f] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-700">What happens next?</p>
                <p className="text-xs text-gray-500">
                  Our team will review your business details and services. You’ll receive an SMS/email notification once approved.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#00c49f] hover:bg-[#00b08f] text-white font-bold py-3 px-4 rounded-lg shadow-sm transition duration-200 text-sm"
            >
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}