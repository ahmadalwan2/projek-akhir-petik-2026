import React, { useState, useEffect } from "react";
import {
  FaThLarge,
  FaFire,
  FaWallet,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaTimes
} from "react-icons/fa";
import { FaMinimize } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthUser, clearAuthData } from "../../utils/authHelper";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getAuthUser());

  useEffect(() => {
    const handleSync = () => setUser(getAuthUser());
    window.addEventListener("storage", handleSync);
    window.addEventListener("userUpdate", handleSync);
    
    const interval = setInterval(handleSync, 2000);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("userUpdate", handleSync);
      clearInterval(interval);
    };
  }, []);

  const menus = [
    { icon: <FaThLarge />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaFire />, label: "Aktifitas", path: "/aktifitas" },
    { icon: <FaBell />, label: "Notifikasi", path: "/notifikasi" },
    { icon: <FaWallet />, label: "Keuangan", path: "/keuangan" },
    { icon: <FaCog />, label: "Pengaturan", path: "/pengaturan" }
  ];

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-white lg:bg-gray-100 flex flex-col justify-between py-6 transition-all duration-300 z-50
        ${open 
          ? "w-[240px] px-6 translate-x-0 shadow-2xl lg:shadow-none" 
          : "w-[80px] -translate-x-full lg:translate-x-0 lg:items-center"
        }`}
      >
        <div>
          <div
            className={`flex items-center mb-6 px-1 ${
              open ? "justify-between" : "justify-center"
            }`}
          >
            {open ? (
              <>
                <img src="/logo-nexora.png" className="h-7 cursor-pointer" alt="Logo" />
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-blue-500 cursor-pointer lg:block"
                >
                  <span className="lg:hidden"><FaTimes size={20} /></span>
                  <span className="hidden lg:block"><FaMinimize /></span>
                </button>
              </>
            ) : (
              <img
                src="/nexora-tab-logo.svg"
                className="h-5 cursor-pointer hidden lg:block"
                onClick={() => setOpen(true)}
                alt="Mini Logo"
              />
            )}
          </div>

          <div className="h-[1px] bg-gray-200 lg:bg-gray-300 mb-6 font-thin"></div>

          <div className="flex flex-col gap-2">
            {menus.map((item, index) => {
              const isActive = location.pathname.includes(item.path);

              return (
                <div
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) setOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${open ? "justify-start" : "justify-center"}
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  <span className={`${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}>
                    {item.icon}
                  </span>
                  {open && <span className="font-medium text-[15px]">{item.label}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div 
            onClick={() => navigate("/pengaturan")}
            className={`flex items-center gap-3 p-2 mb-4 rounded-xl cursor-pointer hover:bg-white transition-all group ${open ? "bg-white/50 border border-gray-100" : "justify-center"}`}
          >
            <img 
               src={user.avatar} 
               className={`w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105 ${!open && "mx-auto"}`}
               alt="avatar"
            />
             {open && (
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-gray-900 truncate uppercase tracking-tight">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   {user.role === "admin" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   )}
                   <p className={`text-[10px] font-bold truncate tracking-widest uppercase ${user.role === "admin" ? "text-emerald-600" : "text-gray-400"}`}>
                      {user.role === "admin" ? "Administrator" : "Akun Aktif"}
                   </p>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => {
              clearAuthData();
              navigate("/");
            }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
            ${open ? "justify-start" : "justify-center"}
            text-red-500 hover:bg-red-50`}
          >
            <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
            {open && <span className="font-medium text-[15px]">Keluar</span>}
          </div>
        </div>
      </div>
    </>
  );
}