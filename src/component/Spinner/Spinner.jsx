import React from "react";

export default function Spinner({ sidebarOpen }) {
  
  const leftClass = sidebarOpen === undefined 
    ? "left-0" 
    : (sidebarOpen ? "lg:left-[240px]" : "lg:left-[80px]");

  return (
    <div className={`fixed top-0 right-0 bottom-0 ${leftClass} left-0 bg-white/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center transition-all duration-300`}>
      <div className="relative flex justify-center items-center">
        <div className="absolute w-20 h-20 rounded-full border-4 border-gray-100"></div>
        <div className="absolute w-20 h-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        <img src="/nexora-tab-logo.svg" className="w-8 h-8 animate-pulse" alt="spinner-logo" />
      </div>
      <p className="mt-6 text-sm font-bold text-blue-600 animate-pulse tracking-widest uppercase">
        Memuat Nexora...
      </p>
    </div>
  );
}
