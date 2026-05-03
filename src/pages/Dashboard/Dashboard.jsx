import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area
} from "recharts";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import axiosInstance from "../../utils/axiosInstance.jsx";
import { getAuthUser } from "../../utils/authHelper";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const getCache = (key, defaultVal) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch(e) {
      return defaultVal;
    }
  };

  const [profileName, setProfileName] = useState(getAuthUser().name);
  const [profileAvatar, setProfileAvatar] = useState(getAuthUser().avatar);

  const [completedTasks, setCompletedTasks] = useState(() => getCache("dash_completed", 0));
  const [mode, setMode] = useState("harian");
  const [chartData, setChartData] = useState(() => getCache("dash_chart", []));
  const [totalActivities, setTotalActivities] = useState(() => localStorage.getItem("dash_totalAct") || "0/0");
  const [productivity, setProductivity] = useState(() => localStorage.getItem("dash_prod") || "0%");
  const [activitiesData, setActivitiesData] = useState(() => getCache("dash_activities", []));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsDataLoading(true);
      try {
        const res = await axiosInstance.get("/dashboard");
        const userData = res.data.data;
        
        if (userData) {
          const authUser = getAuthUser();
          setProfileName(authUser.name);
          setProfileAvatar(authUser.avatar);

          const ringkasanAktifitas = userData.ringkasanAktivitas || {};
          const totalTugas = ringkasanAktifitas.total_tugas || 0;
          const completed = ringkasanAktifitas.detail_status?.completed || 0;
          
          const actString = `${completed}/${totalTugas}`;
          setCompletedTasks(completed);
          setTotalActivities(actString);
          
          const prodPercentage = totalTugas > 0 ? Math.round((completed / totalTugas) * 100) : 0;
          setProductivity(`${prodPercentage}%`);
          
          const activities = ringkasanAktifitas.daftar_activities || [];
          setActivitiesData(activities);

          // Logika Grafik Dinamis: Jika total tugas 0, maka grafik flat di 0.
          if (mode === "harian") {
            const chartValue = totalTugas > 0 ? prodPercentage : 0;
            const dailyData = [
              { name: "00:00", value: 0 },
              { name: "06:00", value: chartValue * 0.2 },
              { name: "12:00", value: chartValue * 0.5 },
              { name: "18:00", value: chartValue * 0.8 },
              { name: "23:59", value: chartValue },
            ];
            setChartData(dailyData);
          } else {
            const chartValue = totalTugas > 0 ? prodPercentage : 0;
            const weeklyData = [
              { name: "Sen", value: chartValue * 0.6 },
              { name: "Sel", value: chartValue * 0.4 },
              { name: "Rab", value: chartValue * 0.8 },
              { name: "Kam", value: chartValue },
              { name: "Jum", value: chartValue * 0.7 },
              { name: "Sab", value: chartValue * 0.9 },
              { name: "Min", value: chartValue * 0.8 },
            ];
            setChartData(weeklyData);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDashboardData();

    const handleUpdate = () => {
      const updatedUser = getAuthUser();
      setProfileName(updatedUser.name);
      setProfileAvatar(updatedUser.avatar);
    };

    window.addEventListener("userUpdate", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("userUpdate", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [mode]);

  const todayDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const filteredActivities = activitiesData.filter(activity => {
    const title = activity.title || activity.nama_aktifitas || "Aktifitas";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <style>{`
        .recharts-surface:focus {
          outline: none;
        }
        .recharts-wrapper:focus {
          outline: none;
        }
      `}</style>
      <div className="bg-gray-50 min-h-screen">

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 min-h-screen relative`}>
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {isDataLoading && <Spinner sidebarOpen={sidebarOpen} />}

        <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profileAvatar}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight">Halo, {profileName}! 👋</h1>
              <p className="text-gray-400 text-xs font-medium tracking-wide mt-0.5">{todayDate}</p>
            </div>
          </div>
          
          <div className="relative group flex-1 max-w-sm">
            <input 
              type="text" 
              placeholder="Cari aktifitas..."
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs focus:outline-none focus:border-blue-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="relative overflow-hidden bg-[#0052FF] p-4 rounded-2xl border-2 border-slate-100 group transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-indigo-900/40"></div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-[60px] animate-pulse"></div>
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-[50px]"></div>
             
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
             
             <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold tracking-wide mb-1">Status Utama</p>
                  <p className="text-blue-100/80 text-[10px] font-medium tracking-wide leading-none">Aktifitas Hari Ini</p>
                  <h2 className="text-4xl font-semibold text-white mt-1.5 flex items-baseline gap-1.5">
                    {totalActivities.split('/')[0]}
                    <span className="text-lg font-bold text-white/40">/ {totalActivities.split('/')[1] || '0'}</span>
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/20 shadow-2xl">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                     </svg>
                  </div>
                </div>
             </div>
          </div>

          <div className="relative overflow-hidden bg-white p-4 rounded-2xl border-2 border-slate-100 transition-all duration-300">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold tracking-wide">Tugas Selesai</p>
                  <h2 className="text-3xl font-semibold text-slate-900 mt-1">{completedTasks}</h2>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-100 blur-lg rounded-full opacity-40"></div>
                  <div className="relative bg-emerald-50 p-3 rounded-xl text-emerald-600 border border-emerald-100/50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
             </div>
          </div>

          <div className="relative overflow-hidden bg-white p-4 rounded-2xl border-2 border-slate-100 transition-all duration-300">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold tracking-wide">Produktifitas</p>
                  <h2 className="text-3xl font-semibold text-slate-900 mt-1">{productivity}</h2>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 blur-lg rounded-full opacity-40"></div>
                  <div className="relative bg-blue-50 p-3 rounded-xl text-blue-600 border border-blue-100/50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border-2 border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Ringkasan Progres</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Perkembangan Produktifitasmu</p>
              </div>
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 origin-right">
                <button
                  onClick={() => setMode("harian")}
                  className={`py-1.5 px-4 rounded-lg text-xs font-medium transition-all duration-300 ${mode === "harian" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setMode("mingguan")}
                  className={`py-1.5 px-4 rounded-lg text-xs font-medium transition-all duration-300 ${mode === "mingguan" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Mingguan
                </button>
              </div>
            </div>

            <div className="w-full h-[200px]">
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValueDashUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" strokeWidth={1} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }}
                      dy={5}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }}
                      tickFormatter={(value) => `${Math.round(value)}%`}
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      width={45}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#071B4A', borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px -5px rgba(7, 27, 74, 0.4)', padding: '10px 14px' }}
                      labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '2px' }}
                      itemStyle={{ fontSize: '12px', padding: '0', color: '#ffffff', fontWeight: '600' }}
                      formatter={(value) => [`${Math.round(value)}%`, 'Progres']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorValueDashUnique)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-[10px] font-black text-slate-300 tracking-wide">Menyiapkan Grafik...</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col items-center">
            <div className="w-full mb-1">
              <h3 className="text-base font-semibold text-gray-900">Productivity</h3>
            </div>
            
            <div className="relative w-full h-[150px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="70%" 
                  outerRadius="100%" 
                  barSize={10} 
                  data={[{value: parseInt(productivity) || 0}]} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={20}
                    fill="#3b82f6"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-semibold text-gray-900">{productivity}</span>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">Growth</p>
              </div>
            </div>

             <div className="mt-2 grid grid-cols-2 gap-2 w-full">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                <p className="text-[10px] text-gray-400 font-semibold tracking-wide">Done</p>
                <p className="text-base font-semibold text-gray-900">{completedTasks}</p>
              </div>
              <div className="bg-blue-50/30 p-2.5 rounded-xl border border-blue-100/30">
                <p className="text-[10px] text-blue-400 font-semibold tracking-wide">Prod</p>
                <p className="text-base font-semibold text-blue-600">{productivity}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Aktifitas Terakhir</h3>
            <button 
              onClick={() => navigate("/aktifitas")} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActivities && filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => {
                let progressValue = 0;
                if (activity.progress !== undefined) {
                  progressValue = activity.progress;
                } else if (String(activity.status).toUpperCase() === "SELESAI" || String(activity.status) === "3" || activity.status === 3) {
                  progressValue = 100;
                } else if (String(activity.status).toUpperCase() === "PROSES" || String(activity.status) === "2" || activity.status === 2) {
                  progressValue = 50;
                }

                const cat = (activity.categories || activity.category || "").toLowerCase();
                const isHealth = cat.includes("sehat") || cat.includes("olahraga");
                const isProductive = cat.includes("pro") || cat.includes("kerja");
                
                return (
                  <div 
                    key={index} 
                    onClick={() => progressValue === 100 ? null : navigate("/aktifitas", { state: { openId: activity.id } })}
                    className={`relative p-4 rounded-xl border-2 border-slate-100 transition-all duration-300 overflow-hidden ${
                      progressValue === 100 ? 'bg-slate-50/50 opacity-70 cursor-default' : 
                      isHealth ? 'bg-rose-50/10' : 
                      isProductive ? 'bg-blue-50/10' : 'bg-white'
                    } ${progressValue !== 100 ? 'cursor-pointer' : ''}`}
                  >
                    <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-8 -mt-8 ${
                      progressValue === 100 ? 'bg-emerald-100/50' : 
                      isHealth ? 'bg-rose-100/50' : 
                      isProductive ? 'bg-blue-100/50' : 'bg-gray-100/50'
                    }`}></div>

                    <div className="relative flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border flex items-center justify-center ${
                          progressValue === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          isHealth ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          isProductive ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                          {isHealth ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          ) : isProductive ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-base font-semibold tracking-tight ${progressValue === 100 ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {activity.title || activity.nama_aktifitas || "Aktifitas"}
                          </h4>
                          <p className="text-[11px] font-medium text-gray-400 tracking-wide capitalize">{activity.categories || activity.category || "General"}</p>
                        </div>
                      </div>
                      <div className={`text-[10px] font-semibold px-3 py-1 rounded-full tracking-wide capitalize border shadow-sm ${
                        progressValue === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        progressValue === 50 ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {progressValue === 100 ? 'Selesai' : progressValue === 50 ? 'Progress' : 'Pending'}
                      </div>
                    </div>
                    
                    <div className="relative space-y-2 pt-2 border-t border-slate-50">
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-400 font-semibold tracking-wide">Progress Pelaksanaan</span>
                        <span className={`font-semibold ${progressValue === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{progressValue}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                            progressValue === 100 ? 'from-emerald-400 to-emerald-600' : 
                            isHealth ? 'from-rose-400 to-rose-600' : 
                            'from-blue-400 to-blue-600'
                          }`} 
                          style={{ width: `${progressValue}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full bg-white p-10 rounded-2xl shadow-sm border border-dashed border-gray-200 text-gray-400 text-center flex flex-col items-center gap-3">
                <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm">Tidak ada aktifitas yang ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}