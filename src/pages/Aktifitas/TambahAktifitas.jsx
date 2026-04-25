import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";
import axiosIntance from "../../utils/axiosIntance.jsx";

export default function TambahAktifitas() {
  const navigate = useNavigate();
  const [title, setTitle]= useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({ })
  try {
   await axiosIntance.post("/activities/create", {
      title,
      description,
      categories
    })
    
    navigate(-1)
  } catch (error) {
    console.log(error?.response?.data);

   
  } finally {
    setLoading(false)
  }
}

  
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="ml-[240px] p-6 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tambah Aktifitas Baru</h2>
          <p className="text-sm text-gray-500 mt-1">Isi detail di bawah ini untuk membuat jadwal aktifitas.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
          <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit}>
              {/* Input Nama Aktifitas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="title">Nama Aktifitas</label>
                <input 
                  id="title"
                  type="text"
                  onChange={(e)=> setTitle(e.target.value)}
               
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm" 
                  placeholder="Mis: Meeting Project Nexora" 
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
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

              <div>
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
  );
}
