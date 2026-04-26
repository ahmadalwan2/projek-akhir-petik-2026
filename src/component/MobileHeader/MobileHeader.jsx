import React from "react";
import { FaBars } from "react-icons/fa";

export default function MobileHeader({ onOpenSidebar }) {
  return (
    <div className="lg:hidden sticky top-4 left-0 right-0 z-40 px-4 mb-2">
      <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg shadow-blue-900/5 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-nexora.png" className="h-7 w-auto" alt="logo" />
        </div>
        
        <button 
          onClick={onOpenSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
        >
          <FaBars size={20} />
        </button>
      </div>
    </div>
  );
}
