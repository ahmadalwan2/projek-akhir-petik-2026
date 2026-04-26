import React from "react";

export default function Spinner() {
  return (
    <div className="absolute inset-0 min-h-screen bg-white/70 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      {}
      <div className="relative flex justify-center items-center">
        <div className="absolute w-16 h-16 rounded-full border-4 border-gray-200"></div>
        <div className="absolute w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        <img src="/nexora-tab-logo.svg" className="w-6 h-6 animate-pulse" alt="spinner-logo" />
      </div>
      <p className="mt-4 text-sm font-medium text-blue-600 animate-pulse tracking-wide">
        Memuat Data...
      </p>
    </div>
  );
}
