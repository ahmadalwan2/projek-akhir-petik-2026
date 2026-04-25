import React, { useState, useEffect } from "react";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState("profil");
  
  // Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("nexora_profile");
    if (saved) return JSON.parse(saved);
    return {
      name: "Bejo Palkor",
      role: "Administrator Utama",
      location: "Jakarta, Indonesia",
      bio: "",
      avatar: "https://i.pravatar.cc/150?img=11",
      cover: ""
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("nexora_profile", JSON.stringify(profile));
  }, [profile]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, cover: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="ml-[240px] p-6 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
          <p className="text-sm text-gray-500 mt-1">Atur preferensi akun dan sistem Anda</p>
        </div>

        <div className="flex gap-6">
          {/* Tabs - SaaS Style Side Nav */}
          <div className="w-1/4">
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("profil")} 
                className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all font-medium border-l-4 ${activeTab === "profil" ? "bg-blue-50/50 text-blue-700 border-blue-600" : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                Profil Saya
              </button>
              <button 
                onClick={() => setActiveTab("keamanan")} 
                className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all font-medium border-l-4 ${activeTab === "keamanan" ? "bg-blue-50/50 text-blue-700 border-blue-600" : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                Keamanan & Sandi
              </button>
              <button 
                onClick={() => setActiveTab("notifikasi")} 
                className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all font-medium border-l-4 ${activeTab === "notifikasi" ? "bg-blue-50/50 text-blue-700 border-blue-600" : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                Notifikasi
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="w-3/4">
            {activeTab === "profil" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                
                {/* COVER & AVATAR SECTION */}
                <div 
                  className={`h-32 w-full relative ${profile.cover ? '' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                  style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                   <div className="absolute top-4 right-4">
                     <label className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border border-white/30 shadow-sm">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                       Ubah Cover
                       <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                     </label>
                   </div>
                </div>
                
                <div className="px-8 pb-8">
                  <div className="flex justify-between items-end -mt-12 mb-8">
                    <div className="relative group">
                      <img src={profile.avatar || "https://i.pravatar.cc/150?img=11"} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" alt="Profile" />
                      <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-white">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer shadow-sm">
                        Batalkan
                      </button>
                      <button 
                        onClick={saveProfile}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer ${isSaving ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {isSaving ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Tersimpan
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                            Simpan Profil
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Akses</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <input type="email" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" defaultValue="bejo@example.com" disabled />
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">Email digunakan untuk login dan tidak dapat diubah.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Peran / Jabatan</label>
                      <input 
                        type="text" 
                        name="role"
                        value={profile.role}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm hover:border-gray-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <input 
                          type="text" 
                          name="location"
                          value={profile.location}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-sm hover:border-gray-400" 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio Singkat</label>
                    <textarea 
                      rows="3" 
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm hover:border-gray-400" 
                      placeholder="Ceritakan sedikit tentang dirimu..."
                    ></textarea>
                  </div>
                  
                </div>
              </div>
            )}

            {activeTab === "keamanan" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-100 pb-4">Keamanan & Sandi</h3>
                
                <div className="flex flex-col gap-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi Saat Ini</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi Baru</label>
                    <input type="password" placeholder="Minimal 8 karakter" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ulangi Kata Sandi Baru</label>
                    <input type="password" placeholder="Minimal 8 karakter" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-5 flex justify-end mt-8">
                  <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors cursor-pointer shadow-sm">Perbarui Sandi</button>
                </div>
              </div>
            )}

            {activeTab === "notifikasi" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-100 pb-4">Pengaturan Notifikasi</h3>
                
                <div className="flex flex-col divide-y divide-gray-100">
                  <div className="flex justify-between items-start py-4">
                     <div>
                       <h4 className="font-medium text-gray-900 text-sm">Email Harian</h4>
                       <p className="text-sm text-gray-500 mt-1">Kirim ulasan aktifitas setiap pagi hari secara otomatis.</p>
                     </div>
                     <div className="pt-1">
                       <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                     </div>
                  </div>
                  <div className="flex justify-between items-start py-4">
                     <div>
                       <h4 className="font-medium text-gray-900 text-sm">Peringatan Tenggat</h4>
                       <p className="text-sm text-gray-500 mt-1">Ingatkan saya 1 jam sebelum suatu tugas berakhir.</p>
                     </div>
                     <div className="pt-1">
                       <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
