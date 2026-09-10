import React from 'react';

export default function TailorVerification() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tailor Verification
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Upload your verification documents to complete setup
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Government ID Type
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
              <option>Aadhaar Card</option>
              <option>PAN Card</option>
              <option>Voter ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Number
            </label>
            <input 
              type="text" 
              placeholder="Enter ID number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document Photo
            </label>
            <input 
              type="file" 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#00c9b7] hover:file:bg-teal-100" 
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-[#00c9b7] hover:bg-[#00b5a4] text-white font-semibold rounded-lg transition-colors"
            >
              Submit Verification
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}