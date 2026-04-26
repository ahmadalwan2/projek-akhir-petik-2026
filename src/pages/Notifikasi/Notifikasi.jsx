import React, { useState, useEffect } from "react";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";
import axiosIntance from "../../utils/axiosIntance.jsx";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("nexora_read_notifications");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("nexora_read_notifications", JSON.stringify(readIds));
  }, [readIds]);

  const fetchData = async () => {
    try {
      const [actRes, finRes] = await Promise.all([
        axiosIntance.get("/activities").catch(() => ({ data: [] })),
        axiosIntance.get("/finance").catch(() => ({ data: [] }))
      ]);

      const activities = Array.isArray(actRes.data) ? actRes.data : (actRes.data.data || []);
      const finances = Array.isArray(finRes.data) ? finRes.data : (finRes.data.data || []);

      generateNotifications(activities, finances);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const timeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  const generateNotifications = (activities, finances) => {
    const notifs = [];
    const now = new Date();

    if (finances && finances.length > 0) {
      finances.forEach((fin) => {
        const isPemasukan = fin.type === 'pemasukan';
        const finDate = new Date(fin.createdAt);
        notifs.push({
          id: `fin-${fin.id}`,
          title: isPemasukan ? "Pemasukan Baru" : "Pengeluaran Baru",
          message: `Terdapat ${fin.type} sebesar Rp ${Number(fin.amount).toLocaleString('id-ID')} dengan kategori ${fin.category || '-'}.`,
          time: timeAgo(finDate),
          createdAt: finDate.getTime(),
          type: isPemasukan ? 'success' : 'warning',
        });
      });
    }

    if (activities && activities.length > 0) {
      activities.forEach((act) => {
        const actDate = new Date(act.createdAt);
        
        notifs.push({
          id: `act-cre-${act.id}`,
          title: "Aktifitas Berhasil Dibuat",
          message: `Aktifitas '${act.title}' telah berhasil ditambahkan.`,
          time: timeAgo(actDate),
          createdAt: actDate.getTime(),
          type: 'info',
        });

        const diffInHours = (now - actDate) / (1000 * 60 * 60);
        if (act.status !== 3 && diffInHours >= 24) {
          const warningDate = new Date(actDate.getTime() + 24 * 60 * 60 * 1000);
          notifs.push({
            id: `act-late-${act.id}`,
            title: "Aktifitas Belum Terlaksana",
            message: `Aktifitas '${act.title}' sudah melewati 24 jam dan belum selesai.`,
            time: timeAgo(warningDate), 
            createdAt: warningDate.getTime(),
            type: 'warning',
          });
        }
      });
    }

    notifs.sort((a, b) => b.createdAt - a.createdAt);
    setNotifications(notifs);
  };

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(newReadIds);
  };

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
    }
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
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Belum ada notifikasi.</div>
            ) : null}
            {notifications.map((notif) => {
              const isRead = readIds.includes(notif.id);
              return (
              <div 
                key={notif.id} 
                onClick={() => markAsRead(notif.id)}
                className={`p-5 flex gap-4 transition-colors cursor-pointer ${isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
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
                    <h4 className={`text-base ${isRead ? 'font-medium text-gray-800' : 'font-bold text-gray-900'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className={`mt-1 text-sm ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notif.message}
                  </p>
                </div>

                {/* UNREAD DOT */}
                {!isRead && (
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>
                )}
                
              </div>
            )})}
          </div>
        </div>

      </div>
    </div>
  );
}

