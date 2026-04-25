import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Aktifitas from "./pages/Aktifitas/Aktifitas.jsx";
import TambahAktifitas from "./pages/Aktifitas/TambahAktifitas.jsx";
import Keuangan from "./pages/Keuangan/Keuangan.jsx";
import Pengaturan from "./pages/Pengaturan/Pengaturan.jsx";
import Notifikasi from "./pages/Notifikasi/Notifikasi.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HALAMAN UTAMA */}
        <Route path="/" element={<LandingPage />} />

        {/* HALAMAN LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* HALAMAN REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* HALAMAN DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* HALAMAN AKTIFITAS */}
        <Route path="/aktifitas" element={<Aktifitas />} />
        <Route path="/aktifitas/tambah" element={<TambahAktifitas />} />

        {/* HALAMAN NOTIFIKASI */}
        <Route path="/notifikasi" element={<Notifikasi />} />

        {/* HALAMAN KEUANGAN */}
        <Route path="/keuangan" element={<Keuangan />} />

        {/* HALAMAN PENGATURAN */}
        <Route path="/pengaturan" element={<Pengaturan />} />

      </Routes>
    </BrowserRouter>
  );
}