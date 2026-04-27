import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

export default function NexoraAlert({ 
  isOpen, 
  onClose, 
  title = "Informasi", 
  message = "", 
  type = "success" 
}) {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: <FaCheckCircle className="text-green-500 w-12 h-12" />,
      buttonClass: "bg-green-600 hover:bg-green-700",
      accent: "border-green-100 bg-green-50/30"
    },
    error: {
      icon: <FaTimesCircle className="text-red-500 w-12 h-12" />,
      buttonClass: "bg-red-600 hover:bg-red-700",
      accent: "border-red-100 bg-red-50/30"
    },
    warning: {
      icon: <FaExclamationTriangle className="text-orange-500 w-12 h-12" />,
      buttonClass: "bg-orange-600 hover:bg-orange-700",
      accent: "border-orange-100 bg-orange-50/30"
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500 w-12 h-12" />,
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      accent: "border-blue-100 bg-blue-50/30"
    }
  };

  const style = config[type] || config.info;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className={`p-8 flex flex-col items-center text-center ${style.accent} border-b`}>
          <div className="mb-4">
            {style.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="p-4 bg-white">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-2xl text-white font-bold transition-all active:scale-95 cursor-pointer shadow-lg ${style.buttonClass}`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
