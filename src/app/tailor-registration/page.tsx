import React from 'react';

export default function TailorRegistration() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      {/* Main Container - Full width on mobile, centered card on desktop */}
      <div className="w-full max-w-md md:max-w-3xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tailor Registration
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Fill in your details to get started
          </p>
        </div>

        {/* Form Grid - 1 column on mobile, 2 columns on desktop */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input 
              type="tel" 
              placeholder="Enter phone number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input 
              type="text" 
              placeholder="Enter shop name" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input 
              type="number" 
              placeholder="e.g. 5" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          {/* Full-width address field across both columns on desktop */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Address
            </label>
            <textarea 
              rows={3} 
              placeholder="Enter complete shop address" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          {/* Full-width button */}
          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-[#00c9b7] hover:bg-[#00b5a4] text-white font-semibold rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}