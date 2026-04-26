import React, { useState, useEffect } from "react";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";
import axiosIntance from "../../utils/axiosIntance.jsx";

export default function Pengaturan() {
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
        // 1. Ambil data login terbaru
        const localUser = JSON.parse(localStorage.getItem("nexora_user"));

        // 2. Tarik data dari API
        const res = await axiosIntance.get("/user");
        const allUsers = res.data.data || [];

        // 3. Cari user yang emailnya sesuai dengan email login contohnya: (alwan@gmail.com)
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

  // 4. Input Handler Universal (Mendukung Text & Checkbox)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 5. Image Upload Handlers
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

      // Simpan data tampilan/metadata ke localstorage
      localStorage.setItem("nexora_user", JSON.stringify({ name: profile.name, email: profile.email }));
      localStorage.setItem("nexora_meta", JSON.stringify(profile));

      alert("Profil berhasil diperbarui!");
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  // 7. Update Password
  const handleUpdatePassword = async () => {
    if (password.new !== password.confirm) {
      return alert("Konfirmasi sandi baru tidak cocok");
    }
    try {
      await axiosIntance.patch("/update/password", {
        passwordLama: password.old,
        passwordBaru: password.new,
        konfirmasi_password: password.confirm,
      });
      alert("Kata sandi berhasil diubah");
      setPassword({ old: "", new: "", confirm: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengubah sandi");
    }
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
          {/* Tabs Navigation */}
          <div className="w-1/4">
            <div className="flex flex-col gap-1">
              {["profil", "keamanan", "notifikasi"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all font-medium border-l-4 capitalize ${activeTab === tab ? "bg-blue-50/50 text-blue-700 border-blue-600" : "border-transparent text-gray-600 hover:bg-gray-100"}`}
                >
                  {tab === "profil" ? "Profil Saya" : tab === "keamanan" ? "Keamanan & Sandi" : "Notifikasi"}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="w-3/4">
            {activeTab === "profil" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Cover Section */}
                <div
                  className={`h-32 w-full relative ${profile.cover ? "" : "bg-gradient-to-r from-blue-400 to-indigo-500"}`}
                  style={profile.cover ? { backgroundImage: `url(${profile.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                  <label className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs cursor-pointer border border-white/30 shadow-sm transition-all">
                    Ubah Cover
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "cover")} />
                  </label>
                </div>

                <div className="px-8 pb-8">
                  <div className="flex justify-between items-end -mt-12 mb-8">
                    <div className="relative group">
                      <img src={profile.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                      <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-white">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "avatar")} />
                      </label>
                    </div>
                    <button onClick={saveProfileData} disabled={isSaving} className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all shadow-sm ${isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                      {isSaving ? "Menyimpan..." : "Simpan Profil"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Akses</label>
                      <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "keamanan" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6 border-b pb-4">Keamanan & Sandi</h3>
                <div className="flex flex-col gap-5 max-w-md">
                  <input
                    type="password"
                    placeholder="Sandi Lama"
                    value={password.old}
                    onChange={(e) => setPassword({ ...password, old: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="password"
                    placeholder="Sandi Baru"
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="password"
                    placeholder="Konfirmasi Sandi Baru"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button onClick={handleUpdatePassword} className="w-fit px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-all">
                    Perbarui Sandi
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifikasi" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6 border-b pb-4">Pengaturan Notifikasi</h3>
                <div className="flex flex-col divide-y divide-gray-100">
                  <div className="flex justify-between items-center py-4">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Email Harian</h4>
                      <p className="text-xs text-gray-500">Kirim ulasan aktifitas setiap pagi hari secara otomatis.</p>
                    </div>
                    <input type="checkbox" name="dailyEmail" checked={profile.dailyEmail} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Peringatan Tenggat</h4>
                      <p className="text-xs text-gray-500">Ingatkan saya 1 jam sebelum suatu tugas berakhir.</p>
                    </div>
                    <input type="checkbox" name="deadlineAlert" checked={profile.deadlineAlert} onChange={handleInputChange} className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
      `,
        }}
      />
    </div>
  );
}
