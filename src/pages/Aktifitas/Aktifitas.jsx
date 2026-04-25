import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";
import { FaTrash } from "react-icons/fa";
import axiosIntance from "../../utils/axiosIntance.jsx";

export default function Aktifitas() {
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

    getActivities()
  },[])

  const getActivities = async () => {
   

    try {
      const result = await axiosIntance.get("/activities")
      console.log(result.data);
      
      const finalData = Array.isArray(result.data) ? result.data : result.data.data
      setActivities(finalData || [])
    } catch (error) {
      console.log(error?.response?.data);
    }
  }

const toggleStatus = async (id) => {
  console.log('Toggle status untuk id:', id);
  
  try {
    const result = await axiosIntance.patch(`/activities/${id}`)
    console.log(result.data);
    
    getActivities()
  } catch (error) {
    console.log(error?.response?.data);
  }
}


const deleteActivity = async (id) => {
  console.log('Delete activity untuk id:', id);
  
  try {
    const result = await axiosIntance.delete(`/activities/delete/${id}`)

    
    getActivities()
  } catch (error) {
    console.log(error?.response?.data);
  }
}

const getStatusDetail = (statusId) => {
  switch (Number(statusId)) {
    case 1:
      return { label: "Belum Selesai", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" };
    case 2:
      return { label: "Progress", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" };
    case 3:
      return { label: "Selesai", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" };
    default:
      return { label: "Unknown", color: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-500" };
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
    await axiosIntance.patch(`/activities/update/${selectedId}`, {
      status: status
    });
    
    setStatusModalOpen(false);
    getActivities();
  } catch (error) {
    console.log(error);
    alert("Gagal update status");
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
  } catch (error) {
    console.log(error);
    alert("Gagal update data");
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
  } catch (error) {
    console.log(error?.response?.data);
    alert("Gagal menghapus data");
  }
};



  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="ml-[240px] p-6 transition-all duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daftar Aktifitas</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola tugas dan jadwalkan aktifitasmu dengan rapi.</p>
          </div>
          <button 
            onClick={() => navigate("/aktifitas/tambah")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Baru
          </button>
        </div>

        {/* LIST CONTAINER SaaS Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Nama Aktifitas</div>
            <div className="col-span-3">Deskripsi</div>
            <div className="col-span-2">Jadwal</div>
            <div className="col-span-2">Kategori</div>
            <div className="col-span-2 text-right">Status / Aksi</div>
          </div>

          <div className="divide-y divide-gray-100">
            {activities?.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Tidak ada aktifitas. Coba tambahkan yang baru!</div>
            ) : null}
            { activities.map((act) => {

              const statusInfo = getStatusDetail(act.status);
                return(
              <div 
                key={act.id} 
                onClick={() => toggleStatus(act.id)}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/80 transition-colors cursor-pointer group"
              >
                 <div className="col-span-3 flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full transition-colors ${act.status === 3 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                   <h3 className={`font-medium text-[15px] transition-colors ${act.status === 3 ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{act.title}</h3>
                 </div>
                 
                 {/* KOLOM DESKRIPSI */}
                  <div className="col-span-3">
                    <p className={`text-sm truncate ${act.status === 3 ? 'text-gray-400' : 'text-gray-500'}`} title={act.description}>
                      {act.description || "-"}
                    </p>
                  </div>

                 {/* KOLOM JADWAL */}
                  <div className="col-span-2">
                    <div className={`flex items-center gap-2 text-sm ${act.status === 3 ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>{act.createdAt?.split('T')[0]}</span>
                    </div>
                  </div>
                            

                 <div className={`col-span-2 text-sm ${act.status === 3 ? 'text-gray-400' : 'text-gray-600'}`}>
                   {act.categories}
                 </div>

                <div className="col-span-2 flex justify-end items-center gap-3">
                    <span 
                      onClick={(e) => handleStatusClick(act, e)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    <button 
                      onClick={(e) => handleEditClick(act, e)} 
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => confirmDelete(act.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
              </div>
                )
              })}
          </div>

        </div>

      </div>
      {/* MODAL KONFIRMASI HAPUS */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
              <div className="p-6 text-center">
                {/* Icon Peringatan */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Aktifitas?</h3>
                <p className="text-sm text-gray-500">
                  Tindakan ini tidak bisa dibatalkan. Semua data terkait aktifitas ini akan hilang permanen.
                </p>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={handleDeleteExecute}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-red-600 text-base font-semibold text-white hover:bg-red-700 focus:outline-none transition-colors sm:w-auto sm:text-sm cursor-pointer"
                >
                  Ya, Hapus Sekarang
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors sm:w-auto sm:text-sm cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

      {/* MODAL EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Aktifitas</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Aktifitas</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select 
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg outline-none"
                >
                  <option value="kesehatan">Kesehatan</option>
                  <option value="produktif">Produktif</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg outline-none resize-none"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT STATUS ONLY */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Status Baru</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 1, label: "Belum Selesai", color: "bg-orange-50 text-orange-700 border-orange-200" },
                    { id: 2, label: "Progress", color: "bg-blue-50 text-blue-700 border-blue-200" },
                    { id: 3, label: "Selesai", color: "bg-green-50 text-green-700 border-green-200" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                        status === s.id 
                          ? `${s.color} border-current ring-2 ring-offset-1 ring-blue-200` 
                          : "border-gray-100 text-gray-600 hover:border-gray-200"
                      }`}
                    >
                      <span className="font-medium">{s.label}</span>
                      {status === s.id && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={updateStatusOnly}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}