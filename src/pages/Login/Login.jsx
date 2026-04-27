import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import axiosIntance from "../../utils/axiosIntance";

export default function Login() {
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [generalError, setGeneralError] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const getFieldError = (field) => {
    if (field === 'email') {
      const error = errors.find(e => e.field === 'email' || e.message.toLowerCase().includes('email') || e.message.toLowerCase().includes('pengguna'));
      return error ? error.message : null;
    }
    if (field === 'password') {
      const error = errors.find(e => e.field === 'password' || e.message.toLowerCase().includes('password') || e.message.toLowerCase().includes('sandi'));
      return error ? error.message : null;
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setGeneralError("");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.includes('@')) {
      setErrors([{ field: 'email', message: "Format email harus menyertakan '@'. Contoh: user@gmail.com" }]);
      setLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setErrors([{ field: 'email', message: "Alamat email Anda tidak valid." }]);
      setLoading(false);
      return;
    }

    try {
      const result = await axiosIntance.post(`/auth/login`,
        {
          email,
          password,
        }
      )
      const token = result.data.token;
     localStorage.setItem('token', token)
    
     const decode = jwtDecode(token)

      
      localStorage.setItem("nexora_user", JSON.stringify({
        name: decode.username || decode.name || "User",
        email: decode.email || email
      }));
      
      navigate('/dashboard')
      
    } catch (error) {
      const message = error?.response?.data?.message || "";
      if (message.toLowerCase().includes("tidak ditemukan") || message.toLowerCase().includes("tidak terdaftar") || error?.response?.status === 404) {
        setGeneralError("Akun belum terdaftar di Nexora. Silahkan register terlebih dahulu.");
      } else if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setGeneralError(message || "Terjadi kesalahan saat login")
      }
    } finally {
        setLoading(false)
    }
  }

useEffect(()=>{
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/dashboard");
  } 
  
},[navigate])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">

          {}
          <div className="flex justify-center items-center gap-2 mb-6 mt-12">
            <img src="/logo-nexora.png" alt="logo" className="h-7" />
          </div>

          {}
          <h1 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
            Halo, selamat <br /> datang kembali
          </h1>

          {}
          {generalError && (
             <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div className="text-left">
                  <p className="font-semibold">Oops! Ada masalah</p>
                  <p className="text-xs opacity-80 mt-0.5">{generalError}</p>
                </div>
             </div>
          )}

          {}
          <form className="text-left space-y-4" onSubmit={handleSubmit} noValidate>

            {}
            <div>
              <label className="text-sm text-gray-600">Alamat email</label>
              <input
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('email') ? 'border-red-500' : 'border-gray-300'}`}
              />
               {getFieldError('email') && (
                 <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-medium italic">
                   <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                   {getFieldError('email')}
                 </p>
               )}
            </div>

            {}
            <div>
              <label className="text-sm text-gray-600">Kata Sandi</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e)=> setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('password') ? 'border-red-500' : 'border-gray-300'}`}
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

            {}
            <div className="flex justify-between items-center text-sm mt-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ingat saya
              </label>
              <button 
                type="button" 
                onClick={() => navigate('/lupa-password')}
                className="text-gray-500 hover:text-blue-600 transition cursor-pointer"
              >
                Lupa password?
              </button>
            </div>

            {}
            <button
              disabled={loading || !rememberMe}
              type="submit" 
              className={`w-full py-3 rounded-lg mt-4 transition font-semibold ${
                loading || !rememberMe 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              Log in
            </button>

          </form>

          {}
          <p className="text-sm text-gray-500 mt-6 mb-24">
            Belum punya akun?{" "}
            <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer hover:text-blue-800 transition">
              Daftar sekarang
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}