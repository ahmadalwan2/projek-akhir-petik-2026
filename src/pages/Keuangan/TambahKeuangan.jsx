import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import NexoraAlert from '../../component/NexoraAlert/NexoraAlert.jsx';
import axiosInstance from "../../utils/axiosInstance.jsx";

export default function TambahKeuangan() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const showAlert = (title, message, type = "info") => setAlertConfig({ isOpen: true, title, message, type });

  const [formData, setFormData] = useState({
    type: "pemasukan",
    category: "",
    amount: "",
    createdAt: new Date().toISOString().split('T')[0],
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsDataLoading(false);
  }, []);

  const formatCurrency = (value) => {
    if (!value) return "";
    const numberString = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("id-ID").format(numberString);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, amount: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category.trim()) newErrors.category = "Kategori harus diisi ya.";
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Jumlah harus lebih dari 0.";
    if (!formData.createdAt) newErrors.createdAt = "Tanggal harus dipilih.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/finance/create", {
        type: formData.type,
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.createdAt,
        note: formData.description
      });

      showAlert("Berhasil", "Transaksi baru telah dicatat", "success");
      setTimeout(() => {
        navigate("/keuangan");
      }, 1500);
    } catch (error) {
      console.log("Error Response Data:", error.response?.data);
      showAlert("Gagal", error.response?.data?.message || "Terjadi kesalahan saat menyimpan data", "error");
    } finally {
      setLoading(false);
    }
  };

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

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Tambah Transaksi</h2>
              <p className="text-sm text-gray-500 mt-1">Catat pemasukan atau pengeluaran baru Anda.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipe Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipe Transaksi</label>
                <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-fit">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "pemasukan" })}
                    className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${formData.type === "pemasukan" ? "bg-white text-green-600 shadow-sm border border-green-100" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${formData.type === "pemasukan" ? "bg-green-500" : "bg-gray-300"}`}></div>
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "pengeluaran" })}
                    className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${formData.type === "pengeluaran" ? "bg-white text-red-600 shadow-sm border border-red-100" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${formData.type === "pengeluaran" ? "bg-red-500" : "bg-gray-300"}`}></div>
                    Pengeluaran
                  </button>
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <input 
                  type="text"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (errors.category) setErrors({ ...errors, category: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all duration-200 text-sm ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                  placeholder="Misal: Gaji, Makan, Transportasi" 
                />
                {errors.category && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Jumlah */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400 text-sm font-medium">Rp</span>
                    <input 
                      type="text"
                      value={formatCurrency(formData.amount)}
                      onChange={handleAmountChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-semibold ${errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="0" 
                    />
                  </div>
                  {errors.amount && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.amount}</p>}
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
                  <input 
                    type="date"
                    value={formData.createdAt}
                    onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all duration-200 text-sm" 
                  />
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan (Opsional)</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm" 
                  placeholder="Tambahkan detail catatan transaksi..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => navigate("/keuangan")}
                  className="px-8 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`px-10 py-3 rounded-lg text-white font-medium transition-all text-sm cursor-pointer ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95"}`}
                >
                  {loading ? "Menyimpan..." : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
