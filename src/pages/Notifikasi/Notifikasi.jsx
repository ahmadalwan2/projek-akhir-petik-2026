import React, { useState, useEffect } from "react";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import axiosInstance from "../../utils/axiosInstance.jsx";

export default function Notifikasi() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
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
    setIsDataLoading(true);
    try {
      const [actRes, finRes] = await Promise.all([
        axiosInstance.get("/activities").catch(() => ({ data: [] })),
        axiosInstance.get("/finance").catch(() => ({ data: [] }))
      ]);

      const activities = Array.isArray(actRes.data) ? actRes.data : (actRes.data.data || []);
      const finances = Array.isArray(finRes.data) ? finRes.data : (finRes.data.data || []);

      generateNotifications(activities, finances);
    } catch (error) {

    }
  };

  useEffect(() => {
    setIsDataLoading(true);
    fetchData().finally(() => setIsDataLoading(false));
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
        const createDate = new Date(act.createdAt);
        const updateDate = new Date(act.updatedAt || act.updated_at || act.createdAt);
        
        // 1. Notifikasi: Berhasil Dibuat
        notifs.push({
          id: `act-cre-${act.id}`,
          title: "Aktifitas Dibuat",
          message: `Aktifitas '${act.title}' telah berhasil ditambahkan ke rencana harimu.`,
          time: timeAgo(createDate),
          createdAt: createDate.getTime(),
          type: 'info',
        });

        // 2. Notifikasi: Selesai (Jika status === 3)
        if (Number(act.status) === 3) {
          notifs.push({
            id: `act-fin-${act.id}`,
            title: "Aktifitas Selesai",
            message: `Hore! Kamu telah menyelesaikan aktifitas '${act.title}'. Terus pertahankan ritme ini!`,
            time: timeAgo(updateDate),
            createdAt: updateDate.getTime() + 1, // Agar urutan tampil di atas 'Created'
            type: 'success',
          });
        } 
        // 3. Notifikasi: Dalam Proses (Jika status === 2)
        else if (Number(act.status) === 2) {
          notifs.push({
            id: `act-prog-${act.id}`,
            title: "Aktifitas Diproses",
            message: `Status aktifitas '${act.title}' sekarang sedang dalam pengerjaan.`,
            time: timeAgo(updateDate),
            createdAt: updateDate.getTime() + 1,
            type: 'info',
          });
        }

        // 4. Pengingat Terlambat
        const diffInHours = (now - createDate) / (1000 * 60 * 60);
        if (Number(act.status) !== 3 && diffInHours >= 24) {
          const warningDate = new Date(createDate.getTime() + 24 * 60 * 60 * 1000);
          notifs.push({
            id: `act-late-${act.id}`,
            title: "Pengingat Penting",
            message: `Aktifitas '${act.title}' sudah lebih dari 24 jam belum selesai. Ayo segera tuntaskan!`,
            time: timeAgo(warningDate), 
            createdAt: warningDate.getTime() + 2,
            type: 'warning',
          });
        }
      });
    }

    // 3. Gabungkan dengan Data Event Log dari LocalStorage (Edit, Delete, Password, Profil)
    const eventLogs = JSON.parse(localStorage.getItem("nexora_event_logs") || "[]");
    eventLogs.forEach((log) => {
      const logDate = new Date(log.createdAt);
      notifs.push({
        id: log.id,
        title: log.title,
        message: log.message,
        time: timeAgo(logDate),
        createdAt: logDate.getTime(),
        type: log.type || 'info',
      });
    });

    const clearedAt = parseInt(localStorage.getItem("nexora_notifications_clear_at") || "0");
    const filteredNotifs = notifs.filter(n => n.createdAt > clearedAt);

    filteredNotifs.sort((a, b) => b.createdAt - a.createdAt);
    setNotifications(filteredNotifs);
  };

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(newReadIds);
  };

  const clearAllNotifications = () => {
    const now = new Date().getTime();
    localStorage.setItem("nexora_notifications_clear_at", now);
    localStorage.setItem("nexora_event_logs", "[]"); // Bersihkan log event juga
    setNotifications([]);
  };

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 min-h-screen relative`}>
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {isDataLoading && <Spinner sidebarOpen={sidebarOpen} />}
        

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kabar Terbaru</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Pantau setiap pembaruan dan pengingat aktifitasmu di sini.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={markAllRead}
                disabled={notifications.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
                  notifications.length === 0 
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed" 
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Tandai Dibaca
              </button>
              
              <button 
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  notifications.length === 0 
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Bersihkan Semua
              </button>
          </div>
        </div>


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
                

                <div className="flex-shrink-0 mt-1">
                  {notif.type === 'success' && (
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                  {notif.type === 'warning' && (
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
    </>
  );
}

