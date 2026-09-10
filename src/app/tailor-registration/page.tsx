"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";

const tailorSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  gender: z.string().min(1, "Gender selection is required"),
  profilePhoto: z.any().optional(),
  shopName: z.string().min(1, "Shop / Business Name is required"),
  yearsOfExperience: z.string().min(1, "Years of Experience is required"),
  specialization: z.string().min(1, "Please select a Specialization"),
  servicesOffered: z.string().min(1, "Please select Services Offered"),
  shopLocation: z.string().min(1, "Shop / Service Location is required"),
  cityArea: z.string().min(1, "City / Area is required"),
});

type TailorFormData = z.infer<typeof tailorSchema>;

export default function TailorRegistration() {
  const router = useRouter();
  const [networkError, setNetworkError] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TailorFormData>({
    resolver: zodResolver(tailorSchema),
  });

  const handleBack = () => {
    window.history.back();
  };

  const onSubmit = async (data: TailorFormData) => {
    setNetworkError(false);
    setUnexpectedError(false);

    if (!navigator.onLine) {
      setNetworkError(true);
      return;
    }

    try {
      console.log("Submitted Data:", data);
      router.push("/tailor-verification");
    } catch {
      setUnexpectedError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Brand Teal Header Banner */}
        <div className="bg-[#00c49f] p-6 text-white text-center flex flex-col items-center relative">
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-4 top-4 text-xs bg-white/20 hover:bg-white/30 text-white font-medium px-2.5 py-1 rounded transition"
          >
            ← Back
          </button>
          
          <Scissors className="h-8 w-8 mb-1" />
          <h1 className="text-xl font-bold tracking-wide">THY</h1>
          <p className="text-xs text-teal-100 mt-0.5">Tailor Registration Flow</p>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Complete Profile</h2>
              <p className="text-xs text-gray-500">Provide details about your tailoring services</p>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full shrink-0">
              OTP Verified
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-left">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name *</label>
              <input
                {...register("fullName")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.fullName ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter full name"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Gender *</label>
              <select
                {...register("gender")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.gender ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Profile Photo (Optional)</label>
              <input
                type="file"
                {...register("profilePhoto")}
                className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg p-1.5"
              />
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Shop / Business Name *</label>
              <input
                {...register("shopName")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.shopName ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter shop name"
              />
              {errors.shopName && <p className="text-xs text-red-500 mt-1">{errors.shopName.message}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Years of Experience *</label>
              <input
                type="number"
                {...register("yearsOfExperience")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.yearsOfExperience ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="e.g. 5"
              />
              {errors.yearsOfExperience && (
                <p className="text-xs text-red-500 mt-1">{errors.yearsOfExperience.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Specialization *</label>
              <select
                {...register("specialization")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.specialization ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Select Specialization</option>
                <option value="suits">Suits & Formalwear</option>
                <option value="dresses">Dresses & Alterations</option>
                <option value="traditional">Traditional Wear</option>
              </select>
              {errors.specialization && (
                <p className="text-xs text-red-500 mt-1">{errors.specialization.message}</p>
              )}
            </div>

            {/* Services Offered */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Services Offered *</label>
              <select
                {...register("servicesOffered")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.servicesOffered ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Select Service</option>
                <option value="stitching">Custom Stitching</option>
                <option value="alterations">Alterations Only</option>
                <option value="both">Both Stitching & Alterations</option>
              </select>
              {errors.servicesOffered && (
                <p className="text-xs text-red-500 mt-1">{errors.servicesOffered.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Shop / Service Location *</label>
              <input
                {...register("shopLocation")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.shopLocation ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Street address or landmark"
              />
              {errors.shopLocation && (
                <p className="text-xs text-red-500 mt-1">{errors.shopLocation.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">City / Area *</label>
              <input
                {...register("cityArea")}
                className={`w-full rounded-lg border p-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#00c49f] ${
                  errors.cityArea ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="City or Area name"
              />
              {errors.cityArea && <p className="text-xs text-red-500 mt-1">{errors.cityArea.message}</p>}
            </div>

            {/* Network / Error States */}
            {networkError && (
              <div className="rounded-lg bg-orange-500 p-3 text-white text-xs flex items-center justify-between">
                <span>No Internet Connection. Retry?</span>
                <button type="submit" className="bg-white text-orange-600 px-2 py-0.5 rounded font-bold">Retry</button>
              </div>
            )}

            {unexpectedError && (
              <div className="rounded-lg bg-orange-500 p-3 text-white text-xs flex items-center justify-between">
                <span>Something went wrong. Please try again.</span>
                <button type="submit" className="bg-white text-orange-600 px-2 py-0.5 rounded font-bold">Retry</button>
              </div>
            )}

            {/* Submit Button in THY Teal */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00c49f] hover:bg-[#00b08f] text-white font-bold py-3 px-4 rounded-lg shadow-sm transition duration-200 text-sm mt-2"
            >
              {isSubmitting ? "Saving..." : "Save & Next Step"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}