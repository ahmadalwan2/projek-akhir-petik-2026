import React from "react";
import { useNavigate } from "react-router-dom";

export default function Syarat_danKetentuan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {}
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo-nexora.png" alt="Nexora Logo" className="h-8" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali
        </button>
      </div>

      {}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Syarat & Ketentuan</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Harap baca dengan saksama syarat dan ketentuan berikut ini sebelum menggunakan layanan Nexora. Dengan menggunakan aplikasi kami, Anda menyetujui semua ketentuan yang berlaku.
          </p>
          <p className="mt-4 text-sm text-blue-200">Pembaruan Terakhir: 26 April 2026</p>
        </div>

        {}
        <div className="px-8 py-10 text-gray-700 leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">1</span>
              Penerimaan Ketentuan
            </h2>
            <p className="mb-4">
              Dengan mengakses dan menggunakan platform Nexora ("Layanan"), Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini ("Ketentuan"). Jika Anda tidak setuju dengan Ketentuan ini, Anda tidak diperkenankan untuk menggunakan Layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">2</span>
              Penggunaan Layanan
            </h2>
            <p className="mb-3">Kami memberikan Anda hak akses non-eksklusif dan tidak dapat dipindahtangankan untuk menggunakan Nexora hanya untuk tujuan produktivitas dan manajemen harian yang sah. Anda setuju untuk tidak:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Menggunakan Layanan untuk tindakan melanggar hukum atau menipu.</li>
              <li>Mengganggu atau mengacaukan keamanan, integritas, atau kinerja Layanan.</li>
              <li>Mencoba mendapatkan akses tidak sah ke Layanan, fitur akun pengguna lain, atau jaringan yang terhubung.</li>
              <li>Menjual kembali, menyewakan, atau mensublisensikan fasilitas Layanan tanpa izin tertulis dari kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">3</span>
              Pendaftaran Akun
            </h2>
            <p className="mb-4">
              Untuk menggunakan sebagian besar fitur Nexora, Anda harus mendaftar akun. Anda setuju untuk memberikan informasi yang akurat, lengkap, dan terkini saat mendaftar. Anda bertanggung jawab penuh atas aktivitas yang terjadi di bawah akun Anda serta wajib menjaga kerahasiaan kata sandi Anda. Kami berhak menangguhkan atau menghapus akun jika ditemukan pelanggaran data atau keamanan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">4</span>
              Privasi dan Pengelolaan Data
            </h2>
            <p className="mb-4">
              Keamanan dan privasi data Anda adalah prioritas utama Nexora. Kami mengumpulkan dan memproses informasi pribadi sesuai dengan kebijakan privasi kami. Dengan menggunakan Layanan, Anda memberikan persetujuan kepada kami untuk menyimpan data Anda guna peningkatan layanan, analisis performa, dan personalisasi dashboard Anda.
            </p>
            <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm">
                <strong>Catatan Penting:</strong> Anda memegang kendali penuh atas data yang diunggah ke dalam akun Nexora Anda. Kami tidak akan pernah membagikan data spesifik identitas pengguna kepada pihak ketiga tanpa izin eksplisit.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">5</span>
              Pembatasan Tanggung Jawab
            </h2>
            <p className="mb-4">
              Aplikasi Nexora disediakan "sebagaimana adanya". Kami tidak memberikan jaminan eksplisit maupun implisit terkait aksesibilitas layanan tanpa henti (100% uptime) maupun bebas error. Sejauh diizinkan oleh hukum yang berlaku, tim Nexora tidak bertanggung jawab atas kerugian finansial, kehilangan data, maupun hambatan bisnis yang berkaitan dengan penggunaan aplikasi ini.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">6</span>
              Perubahan Ketentuan
            </h2>
            <p className="mb-4">
              Nexora berhak memperbarui atau memodifikasi Ketentuan ini kapan saja untuk penyesuaian fungsi atau kepatuhan regulasi. Kami akan memberitahukan pengguna kami jika ada perubahan substansial. Penggunaan berkelanjutan atas Layanan Anda merupakan persetujuan atas revisi dari waktu ke waktu tersebut.
            </p>
          </section>

          <hr className="border-gray-200 mt-10 mb-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-6 rounded-xl">
            <div>
              <h3 className="font-semibold text-gray-900">Punya Pertanyaan Lain?</h3>
              <p className="text-sm text-gray-500 mt-1">Tim dukungan Nexora siap membantu Anda 24/7.</p>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Nexora App. All rights reserved.</p>
      </div>
    </div>
  );
}
