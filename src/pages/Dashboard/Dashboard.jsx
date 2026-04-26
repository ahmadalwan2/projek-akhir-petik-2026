import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import axiosInstance from "../../utils/axiosIntance.jsx";
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsDataLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const getCache = (key, defaultVal) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch(e) {
      return defaultVal;
    }
  };
  const [profileName, setProfileName] = useState(() => localStorage.getItem("userName") || "Memuat...");
  const [profileAvatar, setProfileAvatar] = useState(() => `https://ui-avatars.com/api/?name=${localStorage.getItem("userName") || "M"}`);
  const [completedTasks, setCompletedTasks] = useState(() => getCache("dash_completed", 0));
  const [mode, setMode] = useState("harian");
  const [chartData, setChartData] = useState(() => getCache("dash_chart", []));
  const [totalActivities, setTotalActivities] = useState(() => localStorage.getItem("dash_totalAct") || "0/0");
  const [productivity, setProductivity] = useState(() => localStorage.getItem("dash_prod") || "0%");
  const [activitiesData, setActivitiesData] = useState(() => getCache("dash_activities", []));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsDataLoading(true);
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard");
        const resData = response.data.data || response.data;
        const data = resData || {};
        
        if (data) {

          const userData = data.user || {};
          const userName = userData.nama || userData.name || "User";
          localStorage.setItem("userName", userName);
          setProfileName(userName);
          setProfileAvatar(`https://ui-avatars.com/api/?name=${userName}`);

          const ringkasanAktifitas = data.ringkasanAktivitas || {};
          const totalTugas = ringkasanAktifitas.total_tugas || 0;
          const completed = ringkasanAktifitas.detail_status?.completed || 0;
          
          const actString = `${completed}/${totalTugas}`;
          setCompletedTasks(completed);
          localStorage.setItem("dash_completed", JSON.stringify(completed));
          
          setTotalActivities(actString);
          localStorage.setItem("dash_totalAct", actString);

          const prodPercentage = totalTugas > 0 ? Math.round((completed / totalTugas) * 100) : 0;
          const prodString = `${prodPercentage}%`;
          setProductivity(prodString);
          localStorage.setItem("dash_prod", prodString);
          
          const activities = ringkasanAktifitas.daftar_activities || [];
          setActivitiesData(activities);
          localStorage.setItem("dash_activities", JSON.stringify(activities));

          if (data.ringkasanProgres) {
              setChartData(data.ringkasanProgres);
              localStorage.setItem("dash_chart", JSON.stringify(data.ringkasanProgres));
          } else if (data.chartData) {
              setChartData(data.chartData);
              localStorage.setItem("dash_chart", JSON.stringify(data.chartData));
          } else {

             const mockData = [
               { name: "Sen", value: 10 },
               { name: "Sel", value: 30 },
               { name: "Rab", value: 20 },
               { name: "Kam", value: 60 },
               { name: "Jum", value: 40 },
               { name: "Sab", value: 80 },
               { name: "Min", value: 70 },
             ];
             setChartData(mockData);
             localStorage.setItem("dash_chart", JSON.stringify(mockData));
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="bg-gray-50 min-h-screen">

      {}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 relative`}>
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {isDataLoading && <Spinner />}

        {}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={profileAvatar}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">Hey, {profileName}</h2>
              <p className="text-xs text-gray-400">{todayDate}</p>
            </div>
          </div>

          <input
            placeholder="Cari aktifitas"
            className="px-4 py-2 rounded-lg border text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-t from-blue-400 to-blue-600 text-white p-5 rounded-xl">
            <p className="text-sm opacity-80">Aktifitas Hari ini</p>
            <h2 className="text-3xl font-bold mt-2">{totalActivities}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Aktifitas Selesai</p>
            <h2 className="text-3xl font-bold mt-2">{completedTasks}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Produktifitas</p>
            <h2 className="text-3xl font-bold mt-2">{productivity}</h2>
          </div>
        </div>

        {}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">

            <div>
              <h3 className="font-semibold">Ringkasan Progres</h3>
              <p className="text-xs text-gray-400">
                {mode === "harian"
                  ? "Perkembangan hari ini"
                  : "Perkembangan minggu ini"}
              </p>
            </div>

            {}
            <div className="flex gap-2">
              <button
                onClick={() => setMode("harian")}
                className={`cursor-pointer text-xs px-3 py-1 rounded-lg transition
                ${mode === "harian"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"}`}
              >
                Harian
              </button>

              <button
                onClick={() => setMode("mingguan")}
                className={`cursor-pointer text-xs px-3 py-1 rounded-lg transition
                ${mode === "mingguan"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"}`}
              >
                Mingguan
              </button>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="url(#colorBlue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {}
        <div className="mt-6 space-y-4">
          {filteredActivities && filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => {
              let progressValue = 0;
              if (activity.progress !== undefined) {
                progressValue = activity.progress;
              } else if (activity.status === "Selesai" || String(activity.status) === "3") {
                progressValue = 100;
              } else if (activity.status === "Proses" || String(activity.status) === "2") {
                progressValue = 50;
              }

              return (
              <div key={index} className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm">{activity.title || activity.nama_aktifitas || "Aktifitas"}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className={`h-2 rounded-full ${progressValue === 100 ? 'bg-green-500' : progressValue === 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            )})
          ) : (
            <>
              <div className="bg-white p-4 rounded-xl shadow text-gray-500 text-center text-sm">
                Tidak ada aktifitas yang sesuai dengan pencarian
              </div>
            </>
          )}
        </div>

      </div>
    </div>
    </>
  );
}