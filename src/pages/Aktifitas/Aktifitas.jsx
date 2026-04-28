import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import NexoraAlert from '../../component/NexoraAlert/NexoraAlert.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import { FaTrash, FaEdit, FaCheckCircle, FaClock, FaRocket, FaTimes, FaHeartbeat, FaBriefcase, FaTasks } from "react-icons/fa";
import axiosIntance from "../../utils/axiosIntance.jsx";

export default function Aktifitas() {
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const showAlert = (title, message, type = "info") => setAlertConfig({ isOpen: true, title, message, type });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [categories, setCategories] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  
  useEffect(()=>{
    getActivities().finally(() => setIsDataLoading(false))
  },[])

  const getActivities = async () => {
    setIsDataLoading(true);
    try {
      const result = await axiosIntance.get("/activities")
      const finalData = Array.isArray(result.data) ? result.data : result.data.data
      setActivities(finalData || [])
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  }

  const getStatusDetail = (statusId) => {
    switch (Number(statusId)) {
      case 1:
        return { label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500", icon: <FaClock className="w-3 h-3" /> };
      case 2:
        return { label: "Progress", color: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-500", icon: <FaRocket className="w-3 h-3" /> };
      case 3:
        return { label: "Selesai", color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500", icon: <FaCheckCircle className="w-3 h-3" /> };
      default:
        return { label: "Unknown", color: "bg-gray-50 text-gray-500 border-gray-100", dot: "bg-gray-500", icon: null };
    }
  };

  const handleEditClick = (act, e) => {
    e.stopPropagation(); 
    setSelectedId(act.id);
    setTitle(act.title);
    setDescription(act.description);
    setCategories(act.category || act.categories);
    setStatus(act.status);
    setModalOpen(true);
  };

  const handleStatusClick = (act, e) => {
    e.stopPropagation();
    setSelectedId(act.id);
    setTitle(act.title);
    setDescription(act.description);
    setCategories(act.category || act.categories);
    setStatus(act.status);
    setStatusModalOpen(true);
  };

  const updateStatusOnly = async (e) => {
    if (e) e.preventDefault();
    try {
      await axiosIntance.patch(`/activities/update/${selectedId}`, { status });
      setStatusModalOpen(false);
      getActivities();
      showAlert("Berhasil", "Status telah diperbarui", "success");
    } catch (error) {
      showAlert("Gagal", "Gagal memperbarui status", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosIntance.patch(`/activities/update/${selectedId}`, {
        title,
        description,
        categories,
        status
      });
      setModalOpen(false);
      getActivities();
      showAlert("Berhasil", "Data berhasil diubah", "success");
    } catch (error) {
      showAlert("Gagal", "Gagal menyimpan perubahan", "error");
    }
  };

  const confirmDelete = (id, e) => {
    if (e) e.stopPropagation();
    setIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteExecute = async () => {
    try {
      await axiosIntance.delete(`/activities/delete/${idToDelete}`);
      setDeleteModalOpen(false);
      getActivities();
      showAlert("Berhasil", "Aktifitas telah dihapus", "success");
    } catch (error) {
      showAlert("Gagal", "Gagal menghapus aktifitas", "error");
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 min-h-screen relative`}>
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {isDataLoading && <Spinner sidebarOpen={sidebarOpen} />}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Daftar Aktifitas</h2>
            <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-widest leading-none">Kelola tugas harianmu dengan Nexora Premium</p>
          </div>
          <button 
            onClick={() => navigate("/aktifitas/tambah")}
            className="group relative bg-[#0052FF] hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer flex items-center gap-2 overflow-hidden"
          >
             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             <span className="relative flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                Tambah Aktifitas
             </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
           {activities?.length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                    <FaRocket size={24} />
                </div>
                <p className="text-sm font-bold text-slate-400">Belum ada aktifitas untuk ditampilkan.</p>
                <button 
                  onClick={() => navigate("/aktifitas/tambah")} 
                  className="mt-6 text-[10px] font-black text-white bg-[#0052FF] hover:bg-blue-700 px-6 py-2.5 rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(0,82,255,0.4)] hover:shadow-[0_12px_25px_-4px_rgba(0,82,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest cursor-pointer"
                >
                  Buat Sekarang
                </button>
             </div>
           ) : (
             activities.map((act) => {
                const statusInfo = getStatusDetail(act.status);
                const isSelesai = Number(act.status) === 3;
                const cat = (act.categories || act.category || "General").toLowerCase();
                const isHealth = cat.includes("sehat") || cat.includes("olahraga") || cat.includes("makan");
                const isProductive = cat.includes("pro") || cat.includes("kerja") || cat.includes("belajar") || cat.includes("nambah");

                return (
                  <div 
                    key={act.id}
                    className={`group relative p-5 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                      isSelesai ? 'bg-white border-emerald-100/50 opacity-70' : 
                      isHealth ? 'bg-white border-rose-100/50 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5' : 
                      'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-opacity ${
                      isSelesai ? 'bg-emerald-100/30' : isHealth ? 'bg-rose-100/40' : 'bg-blue-100/40'
                    }`}></div>

                    <div className="relative flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                            isSelesai ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            isHealth ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                            isProductive ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            {isHealth ? <FaHeartbeat size={14} /> : isProductive ? <FaBriefcase size={14} /> : <FaTasks size={14} />}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.categories || act.category || "General"}</span>
                            <h3 className={`font-bold text-[16px] leading-tight mt-0.5 tracking-tight ${isSelesai ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}`}>
                              {act.title}
                            </h3>
                          </div>
                       </div>
                    </div>

                    <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${isSelesai ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
                       {act.description || "Tidak ada deskripsi detail untuk aktifitas ini."}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div onClick={(e) => handleStatusClick(act, e)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all hover:scale-105 active:scale-95 ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                       </div>
                       
                       <div className="flex items-center gap-1">
                          <button onClick={(e) => handleEditClick(act, e)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
                             <FaEdit size={14} />
                          </button>
                          <button onClick={(e) => confirmDelete(act.id, e)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                             <FaTrash size={14} />
                          </button>
                       </div>
                    </div>
                  </div>
                )
             })
           )}
        </div>
      </div>

      {deleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                    <FaTrash size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Hapus Aktifitas?</h3>
                <p className="text-sm text-slate-500 text-center font-medium leading-relaxed mb-8">
                  Tindakan ini permanen. Kamu tidak akan bisa mengembalikan data aktifitas ini lagi.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={() => setDeleteModalOpen(false)} className="px-6 py-3 rounded-2xl text-slate-500 font-bold text-sm bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer">Batal</button>
                  <button onClick={handleDeleteExecute} className="px-6 py-3 rounded-2xl text-white font-bold text-sm bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-200 cursor-pointer">Hapus</button>
                </div>
            </div>
          </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-black text-slate-900">Edit Aktifitas</h2>
               <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"><FaTimes size={18} /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Aktifitas</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kategori</label>
                <select value={categories} onChange={(e) => setCategories(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all">
                  <option value="kesehatan">Kesehatan</option>
                  <option value="produktif">Produktif</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none resize-none transition-all" rows="4"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}

      {statusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6">Update Status</h2>
            <div className="space-y-3">
               {[
                 { id: 1, label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
                 { id: 2, label: "Progress", color: "bg-blue-50 text-blue-700 border-blue-200" },
                 { id: 3, label: "Selesai", color: "bg-green-50 text-green-700 border-green-200" }
               ].map((s) => (
                 <button
                   key={s.id}
                   onClick={() => setStatus(s.id)}
                   className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                     status === s.id ? `${s.color} border-current ring-4 ring-offset-0 ring-blue-50/50` : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200"
                   }`}
                 >
                   <span className="font-bold flex items-center gap-2">{s.label}</span>
                   {status === s.id && <FaCheckCircle className="text-current" />}
                 </button>
               ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
                <button onClick={() => setStatusModalOpen(false)} className="py-3 px-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer">Batal</button>
                <button onClick={updateStatusOnly} className="py-3 px-4 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 cursor-pointer">Update</button>
            </div>
          </div>
        </div>
      )}

      <NexoraAlert 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />
    </div>
    <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }` }} />
    </>
  );
}