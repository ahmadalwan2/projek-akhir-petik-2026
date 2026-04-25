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
import Sidebar from "../../component/Sidebar/Sidebar.jsx";

export default function Dashboard() {
  // =========================
  // 🔥 STATE MODE (HARIAN / MINGGUAN)
  // =========================
  const [mode, setMode] = useState("mingguan");
  const [profileName, setProfileName] = useState(() => {
    const saved = localStorage.getItem("nexora_profile");
    if (saved) return JSON.parse(saved).name?.split(" ")[0] || "Bejo";
    return "Bejo";
  });
  const [profileAvatar, setProfileAvatar] = useState(() => {
    const saved = localStorage.getItem("nexora_profile");
    if (saved) return JSON.parse(saved).avatar || "https://i.pravatar.cc/150?img=11";
    return "https://i.pravatar.cc/150?img=11";
  });
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem("nexora_activities");
    if (saved) return JSON.parse(saved).filter(a => a.status === 'Selesai').length;
    return 2;
  });


  // =========================
  // 🔥 DUMMY DATA MINGGUAN
  // =========================
  const weeklyData = [
    { name: "Sen", value: 20 },
    { name: "Sel", value: 45 },
    { name: "Rab", value: 30 },
    { name: "Kam", value: 60 },
    { name: "Jum", value: 40 },
    { name: "Sab", value: 70 },
    { name: "Min", value: 50 }
  ];

  // =========================
  // 🔥 DUMMY DATA HARIAN
  // =========================
  const dailyData = [
    { name: "08", value: 10 },
    { name: "10", value: 25 },
    { name: "12", value: 40 },
    { name: "14", value: 30 },
    { name: "16", value: 50 },
    { name: "18", value: 35 },
    { name: "20", value: 60 }
  ];

  // =========================
  // 🔥 PILIH DATA
  // =========================
  const chartData = mode === "harian" ? dailyData : weeklyData;

  // =========================
  // 🚀 NANTI TARO API DISINI
  // =========================

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="ml-[240px] p-6 transition-all duration-300">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={profileAvatar}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">Hey, {profileName}</h2>
              <p className="text-xs text-gray-400">Minggu, 14 Mei 2023</p>
            </div>
          </div>

          <input
            placeholder="Cari aktifitas"
            className="px-4 py-2 rounded-lg border text-sm"
          />
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-t from-blue-400 to-blue-600 text-white p-5 rounded-xl">
            <p className="text-sm opacity-80">Aktifitas Hari ini</p>
            <h2 className="text-3xl font-bold mt-2">2/6</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Aktifitas Selesai</p>
            <h2 className="text-3xl font-bold mt-2">{completedTasks}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Produktifitas</p>
            <h2 className="text-3xl font-bold mt-2">72%</h2>
          </div>
        </div>

        {/* CHART */}
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

            {/* 🔥 TOGGLE BUTTON */}
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

        {/* PROGRESS */}
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm">Minum air 8 gelas</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div className="w-[70%] h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm">Belajar React JS</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div className="w-[40%] h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}