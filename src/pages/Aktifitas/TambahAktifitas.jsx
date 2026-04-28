import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import NexoraAlert from '../../component/NexoraAlert/NexoraAlert.jsx';
import axiosIntance from "../../utils/axiosIntance.jsx";

export default function TambahAktifitas() {
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const showAlert = (title, message, type = "info") => setAlertConfig({ isOpen: true, title, message, type });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsDataLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const [title, setTitle]= useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateActivity = (title, desc) => {
    if (!title || title.trim().length < 3) return { title: "Duh! Nama aktifitasnya terlalu singkat nih, minimal 3 karakter ya." };
    if (title.trim().length > 50) return { title: "Waduh, kepanjangan! Maksimal 50 karakter saja untuk nama aktifitas." };
    
    const isRandom = /(.)\1{4,}/.test(title) || /^[asdfghjkl]+\s*$/i.test(title);
    if (isRandom && title.length > 5) return { title: "Hmm, sepertinya isinya asal-asalan. Coba masukkan nama aktifitas yang benar ya!" };

    const badWords = ["memek", "kontol", "anjing", "goblok"];
    const content = `${title} ${desc}`.toLowerCase();
    if (badWords.some(word => content.includes(word))) return { title: "Ups! Gunakan kata-kata yang sopan dan benar ya." };

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateActivity(title, description);
    if (validationError) {
      setErrors(validationError);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await axiosIntance.post("/activities/create", {
        title,
        description,
        categories
      });
      
      showAlert("Berhasil", "Aktifitas baru telah ditambahkan", "success");
      setTimeout(() => {
        navigate("/aktifitas");
      }, 1500);
    } catch (error) {
      setErrors({ fetch: error.response?.data?.message || "Gagal menambah aktifitas" });
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 relative`}>
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        <NexoraAlert 
          isOpen={alertConfig.isOpen} 
          title={alertConfig.title} 
          message={alertConfig.message} 
          type={alertConfig.type} 
          onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} 
        />

        {isDataLoading && <Spinner />}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tambah Aktifitas Baru</h2>
          <p className="text-sm text-gray-500 mt-1">Isi detail di bawah ini untuk membuat jadwal aktifitas.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
          <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="title">Nama Aktifitas</label>
                <input 
                  id="title"
                  type="text"
                  onChange={(e)=> {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: null });
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} 
                  placeholder="Mis: Meeting Project Nexora" 
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-[fadeIn_0.3s_ease-out]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {errors.title}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="kategori">Kategori</label>
                  <div className="relative">
                    <select 
                      id="kategori"
                      value={categories}
                      onChange={(e)=> setCategories(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm text-gray-600 appearance-none"
                    >
                      <option value={""} disabled>Pilih kategori</option>
                      <option value={"kesehatan"}>Kesehatan</option>
                      <option value={"produktif"}>Produktif</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="desc">Deskripsi</label>
                <textarea 
                  rows="4" 
                  name="desc"
                  id="desc"
                  onChange={(e)=> setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm" 
                  placeholder="Tambahkan detail atau catatan khusus untuk aktifitas ini..."
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end mt-2 pt-5 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => navigate("/aktifitas")}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer text-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all cursor-pointer text-sm"
                >
                  {loading ? "Menyimpan..." : "Simpan Aktifitas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
