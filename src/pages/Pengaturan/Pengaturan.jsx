import React, { useState, useEffect } from "react";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import NexoraAlert from '../../component/NexoraAlert/NexoraAlert.jsx';
import MobileHeader from "../../component/MobileHeader/MobileHeader.jsx";
import Spinner from "../../component/Spinner/Spinner.jsx";
import axiosIntance from "../../utils/axiosIntance.jsx";
import { saveAuthUser } from "../../utils/authHelper";

export default function Pengaturan() {
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const showAlert = (title, message, type = "info") => setAlertConfig({ isOpen: true, title, message, type });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsDataLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const [activeTab, setActiveTab] = useState("profil");
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    bio: "",
    avatar: "https://i.pravatar.cc/150?img=11",
    cover: "",
    dailyEmail: true,
    deadlineAlert: true,
  });

  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("nexora_user"));
        const res = await axiosIntance.get("/user");
        const allUsers = res.data.data || [];
        const currentUser = allUsers.find((u) => u.email === localUser?.email);

        if (currentUser) {
          setProfile((prev) => ({
            ...prev,
            name: currentUser.username || localUser?.name || "",
            email: currentUser.email || localUser?.email || "",
            bio: currentUser.bio || "",
            avatar: currentUser.avatar || prev.avatar,
          }));
        }
      } catch (error) {
        console.error(error?.response || "Gagal sinkronisasi data");
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileData = async () => {
    setIsSaving(true);
    try {
      await axiosIntance.patch("/update/user", {
        username: profile.name,
        email: profile.email,
        bio: profile.bio,
      });

      saveAuthUser(profile);
      showAlert("Berhasil", "Profil berhasil diperbarui!", "success");
    } catch (error) {
      showAlert("Waduh!", error.response?.data?.message || "Terjadi kesalahan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (password.new !== password.confirm) {
      return showAlert("Eits!", "Konfirmasi sandi baru tidak cocok", "warning");
    }
    try {
      await axiosIntance.patch("/update/password", {
        passwordLama: password.old,
        passwordBaru: password.new,
        konfirmasi_password: password.confirm,
      });
      showAlert("Berhasil", "Kata sandi berhasil diubah", "success");
      setPassword({ old: "", new: "", confirm: "" });
    } catch (error) {
      showAlert("Waduh!", error.response?.data?.message || "Gagal mengubah sandi", "error");
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 min-h-screen relative`}>
          <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

          {isDataLoading && <Spinner sidebarOpen={sidebarOpen} />}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
            <p className="text-sm text-gray-500 mt-1">Atur preferensi akun dan sistem Anda</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/4">
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                {["profil", "keamanan"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap lg:text-left px-5 py-3 rounded-xl text-sm transition-all font-semibold border-b-4 lg:border-b-0 lg:border-l-4 capitalize flex items-center gap-3 ${
                      activeTab === tab ? "bg-blue-600 text-white border-blue-800 shadow-md shadow-blue-200" : "border-transparent text-gray-500 hover:bg-white hover:text-gray-900"
                    }`}
                  >
                    {tab === "profil" ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Profil Saya
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Keamanan & Sandi
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-3/4">
              {activeTab === "profil" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                  <div
                    className={`h-40 w-full relative ${profile.cover ? "" : "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"}`}
                    style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <label className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs cursor-pointer border border-white/30 shadow-sm transition-all">
                      Ubah Cover
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "cover")} />
                    </label>
                  </div>

                  <div className="px-8 pb-8">
                    <div className="flex justify-between items-end -mt-12 mb-8">
                      <div className="relative group">
                        <img src={profile.avatar || "https://i.pravatar.cc/150?img=11"} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                        <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-white">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "avatar")} />
                        </label>
                      </div>
                      <button onClick={saveProfileData} disabled={isSaving} className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all shadow-sm ${isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {isSaving ? "Menyimpan..." : "Simpan Profil"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                        <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all shadow-sm" placeholder="Masukkan nama lengkap" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">Email Akses</label>
                        <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed font-medium" disabled />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">Bio Singkat</label>
                      <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows="4" className="w-full px-5 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 resize-none transition-all shadow-sm" placeholder="Ceritakan sedikit tentang dirimu..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "keamanan" && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
                  <h3 className="font-bold text-lg text-gray-900 mb-6 border-b pb-4">Keamanan & Sandi</h3>
                  <div className="flex flex-col gap-5 max-w-md">
                    <input type="password" placeholder="Sandi Lama" value={password.old} onChange={(e) => setPassword({ ...password, old: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <input type="password" placeholder="Sandi Baru" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <input type="password" placeholder="Konfirmasi Sandi Baru" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <button onClick={handleUpdatePassword} className="w-fit px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-all">
                      Perbarui Sandi
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }` }} />
    
      <NexoraAlert 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />
    </>
  );
}
