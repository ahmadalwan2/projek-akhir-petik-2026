import React, { useState } from "react";
import {
  FaThLarge,
  FaFire,
  FaWallet,
  FaCog,
  FaSignOutAlt,
  FaBell
} from "react-icons/fa";
import { FaMinimize } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { icon: <FaThLarge />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaFire />, label: "Aktifitas", path: "/aktifitas" },
    { icon: <FaBell />, label: "Notifikasi", path: "/notifikasi" },
    { icon: <FaWallet />, label: "Keuangan", path: "/keuangan" },
    { icon: <FaCog />, label: "Pengaturan", path: "/pengaturan" }
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-100 flex flex-col justify-between py-6 transition-all duration-300 z-50
      ${open ? "w-[240px] px-6" : "w-[80px] items-center"}`}
    >
      {/* TOP */}
      <div>
        {/* LOGO + TOGGLE */}
        <div
          className={`flex items-center mb-6 ${
            open ? "justify-between" : "justify-center"
          }`}
        >
          {open ? (
            <>
              <img src="/logo-nexora.png" className="h-8 cursor-pointer" />

              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-blue-500 cursor-pointer"
              >
                <FaMinimize />
              </button>
            </>
          ) : (
            <img
              src="/nexora-tab-logo.svg"
              className="h-5 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          )}
        </div>

        {/* LINE */}
        <div className="h-[1px] bg-gray-300 mb-6"></div>

        {/* MENU */}
        <div className="flex flex-col gap-4">
          {menus.map((item, index) => {
            const isActive = location.pathname.includes(item.path);

            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                ${open ? "justify-start" : "justify-center"}
                ${
                  isActive
                    ? "bg-gradient-to-t from-blue-400 to-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-gray-500 hover:bg-blue-100"
                }`}
              >
                {item.icon}
                {open && <span className="font-medium">{item.label}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <div
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
        ${open ? "justify-start" : "justify-center"}
        text-red-500 hover:bg-red-100`}
      >
        <FaSignOutAlt />
        {open && <span className="font-medium">Keluar</span>}
      </div>
    </div>
  );
}