import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function LupaPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await axiosInstance.post(`/auth/reset-password`, {
        email,
        newPassword: password,
        password: password,
      });
      
      setSuccess("Kata sandi berhasil diperbarui! Silakan kembali untuk login.");
      setTimeout(() => {
         navigate("/login");
      }, 3000);
      
    } catch (error) {


      const responseMessage = error?.response?.data?.message || "";
      if (responseMessage.toLowerCase().includes("tidak ditemukan") || responseMessage.toLowerCase().includes("tidak terdaftar") || error?.response?.status === 404) {
         setError("Akun dengan alamat email ini belum terdaftar di sistem kami.");
      } else {
         setError(responseMessage || "Terjadi kesalahan saat memproses permintaan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          
          {}
          {/* Tombol Kembali ke Beranda */}
          <button 
            onClick={() => navigate("/")}
            className="absolute top-8 left-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-all cursor-pointer group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Beranda
          </button>

          <div className="flex justify-center items-center gap-2 mb-6 mt-12 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate("/")}>
            <img src="/logo-nexora.png" alt="logo" className="h-7" />
          </div>

          {}
          <h1 className="text-3xl font-bold mb-4 leading-snug">
            Atur Ulang Kata Sandi
          </h1>
          <p className="text-gray-500 mb-8 text-sm px-4">
            Masukkan alamat email Anda yang terdaftar dan buat kata sandi baru untuk akun Nexora Anda.
          </p>

          {}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm mb-4 text-left flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {}
          {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-sm mb-4 text-left flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {}
          <form className="text-left space-y-4" onSubmit={handleSubmit}>
            {}
            <div>
              <label className="text-sm text-gray-600">Alamat email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {}
            <div>
              <label className="text-sm text-gray-600">Kata Sandi Baru</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat kata sandi baru"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {}
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 rounded-lg mt-6 transition font-semibold flex justify-center items-center ${
                loading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-600/20"
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Perbarui Kata Sandi"}
            </button>
          </form>

          {}
          <button 
            type="button"
            onClick={() => navigate("/login")} 
            className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-500 mt-8 hover:text-gray-800 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
}
