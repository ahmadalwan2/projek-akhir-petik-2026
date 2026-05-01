import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function Register() {
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } 
  }, [navigate]);

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState([])

  const getFieldError = (field) => {
    const error = errors.find(e => {
      const msg = e.message.toLowerCase();
      if (field === 'confirmPassword') return msg.includes('konfirmasi') || msg.includes('cocok');
      if (field === 'email') return msg.includes('email') || msg.includes('format');
      if (field === 'username') return msg.includes('username');
      if (field === 'password') return (msg.includes('password') || msg.includes('kata sandi')) && !msg.includes('konfirmasi') && !msg.includes('cocok');
      return false;
    });
    return error ? error.message : null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErrors([])

    // Client-side Validation
    const validationErrors = [];
    
    if (!username.trim()) validationErrors.push({ message: "Username tidak boleh kosong ya." });
    if (!email.trim()) validationErrors.push({ message: "Email tidak boleh kosong ya." });
    if (!password) validationErrors.push({ message: "Password tidak boleh kosong ya." });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email)) {
      validationErrors.push({ message: "Gunakan format email yang valid ya." });
    }

    if (password && password.length < 6) {
      validationErrors.push({ message: "Password minimal 6 karakter ya agar aman." });
    }

    if (password !== confirmPassword) {
      validationErrors.push({ message: "Konfirmasi password tidak cocok nih." });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
        "konfirmasi-password": confirmPassword,
      });
      navigate("/login");
    } catch (error) {
      if (error?.response?.data?.errors) {
        const mappedErrors = error.response.data.errors.map(err => {
          if (err.message && err.message.toLowerCase().includes("validation error")) {
            return { ...err, message: "Pendaftaran gagal: Data sudah terdaftar, silakan gunakan data lain." };
          }
          return err;
        });
        setErrors(mappedErrors);
      } else {
        let msg = error?.response?.data?.message || "Terjadi kesalahan pada sistem";
        if (msg.toLowerCase().includes("validation error")) {
          msg = "Pendaftaran gagal: Data sudah terdaftar, silakan gunakan data lain.";
        }
        setErrors([{ message: msg }])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Tombol Kembali ke Beranda */}
          <button 
            onClick={() => navigate("/")}
            className="absolute top-8 left-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-all cursor-pointer group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Beranda
          </button>

          <div className="flex justify-center items-center gap-2 mb-6 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate("/")}>
            <img src="/logo-nexora.png" alt="logo" className="h-6" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
            Mulai perjalananmu <br /> bersama kami
          </h1>

          {/* Menampilkan pesan error umum jika ada (yang tidak spesifik ke field) */}
          {errors.length > 0 && !['username', 'email', 'password', 'konfirmasi'].some(field => errors[0].message.toLowerCase().includes(field)) && (
             <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
               </svg>
               {errors[0].message}
             </div>
          )}

          <form className="text-left space-y-4" onSubmit={handleRegister} autoComplete="off" noValidate>
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                value={username}
                placeholder="Masukkan username"
                autoComplete="off"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('username') ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setUsername(e.target.value)}
              />
               {getFieldError('username') && (
                 <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium italic">
                   <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                   {getFieldError('username')}
                 </p>
               )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat email</label>
              <input
                type="email"
                value={email}
                placeholder="nexora@gmail.com"
                autoComplete="off"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('email') ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setEmail(e.target.value)}
              />
               {getFieldError('email') && (
                 <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium italic">
                   <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                   {getFieldError('email')}
                 </p>
               )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Buat kata sandi"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('password') ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => setPassword(e.target.value)}
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
               {getFieldError('password') && (
                 <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium italic">
                   <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                   {getFieldError('password')}
                 </p>
               )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Konfirmasi Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
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
               {getFieldError('confirmPassword') && (
                 <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium italic">
                   <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                   {getFieldError('confirmPassword')}
                 </p>
               )}
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 mt-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-1 cursor-pointer" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                Saya setuju dengan{" "}
                <span 
                  onClick={() => navigate("/syarat-ketentuan")} 
                  className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
                >
                  Syarat & Ketentuan
                </span>{" "}
                Nexora
              </span>
            </label>

            <button
              disabled={loading || !agreeTerms}
              type="submit"
              className={`w-full py-3 rounded-lg mt-4 transition font-semibold ${
                loading || !agreeTerms 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              Daftar
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
            >
              Login sekarang
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}