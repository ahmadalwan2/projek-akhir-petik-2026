import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Aktifitas from "./pages/Aktifitas/Aktifitas.jsx";
import TambahAktifitas from "./pages/Aktifitas/TambahAktifitas.jsx";
import Keuangan from "./pages/Keuangan/Keuangan.jsx";
import TambahKeuangan from "./pages/Keuangan/TambahKeuangan.jsx";
import Pengaturan from "./pages/Pengaturan/Pengaturan.jsx";
import Notifikasi from "./pages/Notifikasi/Notifikasi.jsx";
import Syarat_danKetentuan from "./pages/Syarat_danKetentuan/Syarat_danKetentuan.jsx";
import LupaPassword from "./pages/LupaPassword/LupaPassword.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/syarat-ketentuan" element={<Syarat_danKetentuan />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/aktifitas" element={<ProtectedRoute><Aktifitas /></ProtectedRoute>} />
        <Route path="/aktifitas/tambah" element={<ProtectedRoute><TambahAktifitas /></ProtectedRoute>} />
        <Route path="/notifikasi" element={<ProtectedRoute><Notifikasi /></ProtectedRoute>} />
        <Route path="/keuangan" element={<ProtectedRoute><Keuangan /></ProtectedRoute>} />
        <Route path="/keuangan/tambah" element={<ProtectedRoute><TambahKeuangan /></ProtectedRoute>} />
        <Route path="/pengaturan" element={<ProtectedRoute><Pengaturan /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}