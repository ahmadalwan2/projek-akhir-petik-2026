import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosIntance";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState([])

  const getFieldError = (field) => {
    if (field === 'username') return errors.find(e => e.message.toLowerCase().includes('username'))?.message;
    if (field === 'email') return errors.find(e => e.message.toLowerCase().includes('email'))?.message;
    if (field === 'password') return errors.find(e => e.message.toLowerCase().includes('password') && !e.message.toLowerCase().includes('konfirmasi') && !e.message.toLowerCase().includes('cocok'))?.message;
    if (field === 'confirmPassword') return errors.find(e => e.message.toLowerCase().includes('konfirmasi') || e.message.toLowerCase().includes('cocok'))?.message;
    return null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true)

    setErrors([])
    try {
      const result = await axiosIntance.post("/auth/register", {
        username,
        email,
        password,
        "konfirmasi-password": confirmPassword,
      });
      console.log(result.data);
      navigate("/login");
    } catch (error) {
      console.log(error?.response?.data);
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setError(error?.response?.data?.message || "Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* CONTENT */}
      <div className="flex flex-1 items-center justify-center px-6">

        <div className="w-full max-w-md text-center">

          {/* LOGO */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <img src="/logo-nexora.png" alt="logo" className="h-6" />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
            Mulai perjalananmu <br /> bersama kami
          </h1>

          {/* FORM */}
          <form className="text-left space-y-4" onSubmit={handleRegister}>

             {/* USERNAME */}
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                placeholder="Username"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('username') ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setUsername(e.target.value)}
              />
              {getFieldError('username') && <p className="text-xs text-red-500 mt-1">{getFieldError('username')}</p>}
            </div>


            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Alamat email</label>
              <input
                type="email"
                placeholder="Email"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('email') ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setEmail(e.target.value)}
              />
              {getFieldError('email') && <p className="text-xs text-red-500 mt-1">{getFieldError('email')}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Password"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('password') ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setPassword(e.target.value)}
              />
              {getFieldError('password') && <p className="text-xs text-red-500 mt-1">{getFieldError('password')}</p>}
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Konfirmasi Password</label>
              <input
                type="password"
                placeholder="Konfirmasi Password"
                className={`w-full mt-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {getFieldError('confirmPassword') && <p className="text-xs text-red-500 mt-1">{getFieldError('confirmPassword')}</p>}
            </div>

            {/* TERMS */}
            <label className="flex items-start gap-2 text-sm text-gray-600 mt-2">
              <input type="checkbox" className="mt-1" />
              <span>
                Saya setuju dengan{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Syarat & Ketentuan
                </span>{" "}
                Nexora
              </span>
            </label>

            {/* BUTTON */}
            <button
            disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition"
            >
              Daftar
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login sekarang
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}