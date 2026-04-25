import React, { useState, useEffect } from "react";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("nexora_notifications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: "Aktifitas Selesai",
        message: "Bagus! Kamu telah menyelesaikan 'Olahraga Pagi'.",
        time: "2 jam yang lalu",
        type: "success",
        read: false
      },
      {
        id: 2,
        title: "Pengingat Aktifitas",
        message: "Waktunya bersiap! 'Meeting Project Nexora' akan dimulai dalam 30 menit.",
        time: "4 jam yang lalu",
        type: "warning",
        read: false
      },
      {
        id: 3,
        title: "Laporan Mingguan",
        message: "Laporan aktifitas dan produktifitas mingguanmu sudah tersedia.",
        time: "Kemarin",
        type: "info",
        read: true
      },
      {
        id: 4,
        title: "Sistem",
        message: "Akun Bejo Palkor berhasil diperbarui pada pengaturan keamanan.",
        time: "2 hari yang lalu",
        type: "system",
        read: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("nexora_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="ml-[240px] p-6 transition-all duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifikasi</h2>
            <p className="text-sm text-gray-500 mt-1">Pantau pembaruan dan pengingat aktifitasmu di sini.</p>
          </div>
          <button 
            onClick={markAllRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            Tandai semua dibaca
          </button>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => markAsRead(notif.id)}
                className={`p-5 flex gap-4 transition-colors cursor-pointer ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
              >
                
                {/* ICON */}
                <div className="flex-shrink-0 mt-1">
                  {notif.type === 'success' && (
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                  {notif.type === 'warning' && (
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 900 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  )}
                  {notif.type === 'info' && (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  )}
                  {notif.type === 'system' && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-base ${notif.read ? 'font-medium text-gray-800' : 'font-bold text-gray-900'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className={`mt-1 text-sm ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notif.message}
                  </p>
                </div>

                {/* UNREAD DOT */}
                {!notif.read && (
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>
                )}
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
