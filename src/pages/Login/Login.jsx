import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import axiosIntance from "../../utils/axiosIntance";

export default function Login() {
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [generalError, setGeneralError] = useState("")
  const navigate = useNavigate();

  const getFieldError = (field) => {
    if (field === 'email') return errors.find(e => e.message.toLowerCase().includes('email') || e.message.toLowerCase().includes('pengguna'))?.message;
    if (field === 'password') return errors.find(e => e.message.toLowerCase().includes('password') || e.message.toLowerCase().includes('sandi'))?.message;
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErrors([])
    setGeneralError("")
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
     console.log("Data Decode", decode);
     
      navigate('/dashboard')
      
    } catch (error) {
      console.log(error?.response);
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setGeneralError(error?.response?.data?.message || "Terjadi kesalahan saat login")
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

      {/* CONTENT */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">

          {/* LOGO */}
          <div className="flex justify-center items-center gap-2 mb-6 mt-12">
            <img src="/logo-nexora.png" alt="logo" className="h-7" />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
            Halo, selamat <br /> datang kembali
          </h1>

          {/* GENERAL ERROR */}
          {generalError && (
             <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
                {generalError}
             </div>
          )}

          {/* FORM */}
          <form className="text-left space-y-4"  onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Alamat email</label>
              <input
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('email') ? 'border-red-500' : 'border-gray-300'}`}
              />
              {getFieldError('email') && <p className="text-xs text-red-500 mt-1">{getFieldError('email')}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Kata Sandi</label>
              <input
                type="password"
                onChange={(e)=> setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('password') ? 'border-red-500' : 'border-gray-300'}`}
              />
              {getFieldError('password') && <p className="text-xs text-red-500 mt-1">{getFieldError('password')}</p>}
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex justify-between items-center text-sm mt-2">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Ingat saya
              </label>
              <button type="button" className="text-gray-500 hover:text-blue-600 cursor-pointer">
                Lupa password?
              </button>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition cursor-pointer"
            >
              Log in
            </button>

          </form>

          {/* REGISTER */}
          <p className="text-sm text-gray-500 mt-6 mb-24">
            Belum punya akun?{" "}
            <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer hover:underline">
              Daftar sekarang
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}