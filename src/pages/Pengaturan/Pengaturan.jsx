import React, { useState, useEffect } from "react";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import NexoraAlert from '../../component/NexoraAlert/NexoraAlert.jsx';
import MobileHeader from "../../component/MobileHeader/MobileHeader.jsx";
import Spinner from "../../component/Spinner/Spinner.jsx";
import axiosInstance from "../../utils/axiosInstance.jsx";
import { saveAuthUser, getAuthUser } from "../../utils/authHelper";

export default function Pengaturan() {
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const showAlert = (title, message, type = "info") => setAlertConfig({ isOpen: true, title, message, type });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Loading handled by fetchUserData finally block
  useEffect(() => {}, []);

  const [activeTab, setActiveTab] = useState("profil");
  const [isSaving, setIsSaving] = useState(false);

  const initialUser = getAuthUser();
  const [profile, setProfile] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    role: initialUser.role || "",
    location: "",
    bio: "",
    avatar: initialUser.avatar || "/nexora-tab-logo.svg",
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
        const res = await axiosInstance.get("/user");
        const allUsers = res.data.data || [];
        const currentUser = allUsers.find((u) => u.email === localUser?.email);

        if (currentUser) {
          const authData = getAuthUser();
          const updated = {
            ...profile,
            name: currentUser.username || localUser?.name || authData.name || "",
            email: currentUser.email || localUser?.email || authData.email || "",
            bio: currentUser.bio || "",
            avatar: currentUser.avatar || authData.avatar,
            role: currentUser.role || authData.role || "",
          };
          setProfile(updated);
          saveAuthUser(updated); 
        }
      } catch (error) {
        console.error(error?.response || "Gagal sinkronisasi data");
      }
    };

    fetchUserData().finally(() => setIsDataLoading(false));

    const handleUpdate = () => {
      const updatedUser = getAuthUser();
      setProfile(prev => ({
        ...prev,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      }));
    };

    window.addEventListener("userUpdate", handleUpdate);
    return () => window.removeEventListener("userUpdate", handleUpdate);
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
      await axiosInstance.patch("/update/user", {
        username: profile.name,
        email: profile.email,
        bio: profile.bio,
        avatar: profile.avatar,
      });

      saveAuthUser(profile);
      
      // Catat ke Log Notifikasi
      const eventLogs = JSON.parse(localStorage.getItem("nexora_event_logs") || "[]");
      eventLogs.push({
        id: `log-prof-${Date.now()}`,
        title: "Profil Diperbarui",
        message: "Informasi profil kamu telah berhasil diperbarui.",
        type: 'success',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("nexora_event_logs", JSON.stringify(eventLogs));

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
      await axiosInstance.patch("/update/password", {
        passwordLama: password.old,
        passwordBaru: password.new,
        konfirmasi_password: password.confirm,
      });
      
      // Catat ke Log Notifikasi
      const eventLogs = JSON.parse(localStorage.getItem("nexora_event_logs") || "[]");
      eventLogs.push({
        id: `log-pass-${Date.now()}`,
        title: "Sandi Diperbarui",
        message: "Kata sandi akun kamu telah berhasil diubah demi keamanan.",
        type: 'success',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("nexora_event_logs", JSON.stringify(eventLogs));

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
            <h2 className="text-2xl font-semibold text-gray-900">Pengaturan</h2>
            <p className="text-sm text-gray-500 mt-1">Atur preferensi akun dan sistem Anda</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/4">
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                {["profil", "keamanan"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`group whitespace-nowrap lg:text-left px-6 py-3.5 rounded-2xl text-sm transition-all duration-300 font-medium capitalize flex items-center gap-3 active:scale-95 ${
                      activeTab === tab 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "text-gray-500 hover:bg-white hover:text-blue-600"
                    }`}
                  >
                    {tab === "profil" ? (
                      <>
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Profil Saya
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                    className={`h-44 w-full relative flex items-center justify-center overflow-hidden ${profile.cover ? "" : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"}`}
                    style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    {!profile.cover && (
                      <div className="opacity-40 transform scale-[3] rotate-12 grayscale brightness-50">
                         <img src="/nexora-tab-logo.svg" className="w-20 h-20" alt="bg-icon" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5"></div>
                    <label className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-2.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Ubah Cover
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "cover")} />
                    </label>
                  </div>

                  <div className="px-8 pb-8">
                    <div className="flex justify-between items-end -mt-12 mb-8">
                      <div className="relative group">
                        <img 
                          src={profile.avatar} 
                          className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-white object-cover transition-transform group-hover:scale-105" 
                        />
                        <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer border-4 border-white backdrop-blur-[2px]">
                          <svg className="w-8 h-8 text-white transition-transform group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "avatar")} />
                        </label>
                      </div>
                      <button 
                        onClick={saveProfileData} 
                        disabled={isSaving} 
                        className={`px-8 py-3 rounded-lg text-white text-sm font-medium transition-all active:scale-95 ${isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        {isSaving ? "Menyimpan..." : "Simpan Profil"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                      <div>
                        <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                          Nama Lengkap
                          <svg className="w-3 h-3 text-blue-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </label>
                        <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all shadow-sm" placeholder="Masukkan nama lengkap" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 uppercase tracking-wider mb-2">Email Akses</label>
                        <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed font-medium" disabled />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                        Bio Singkat
                        <svg className="w-3 h-3 text-blue-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </label>
                      <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows="4" className="w-full px-5 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 resize-none transition-all shadow-sm" placeholder="Ceritakan sedikit tentang dirimu..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "keamanan" && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
                  <h3 className="font-semibold text-lg text-gray-900 mb-6 border-b pb-4">Keamanan & Sandi</h3>
                  <div className="flex flex-col gap-5 max-w-md">
                    <input type="password" placeholder="Sandi Lama" value={password.old} onChange={(e) => setPassword({ ...password, old: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <input type="password" placeholder="Sandi Baru" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <input type="password" placeholder="Konfirmasi Sandi Baru" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                    <button 
                      onClick={handleUpdatePassword} 
                      className="w-full sm:w-fit px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all active:scale-95"
                    >
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
