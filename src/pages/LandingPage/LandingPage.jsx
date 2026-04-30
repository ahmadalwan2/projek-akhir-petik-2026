import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaChartLine,
  FaBell,
  FaCircleCheck,
  FaLayerGroup,
  FaWallet,
  FaPlus,
  FaMinus
} from "react-icons/fa6";

import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out"
    });

    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [openIndices, setOpenIndices] = useState([]);

  const toggleFaq = (index) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Apa itu Nexora?",
      answer:
        "Nexora adalah aplikasi self development terintegrasi untuk keuangan, aktivitas, dan kebiasaan dalam satu tempat."
    },
    {
      question: "Apakah data saya aman di Nexora?",
      answer:
        "Ya, Nexora menggunakan sistem keamanan modern untuk menjaga data kamu tetap aman dan privat."
    },
    {
      question: "Apakah ada laporan mingguan atau bulanan?",
      answer:
        "Tersedia laporan mingguan dan bulanan agar kamu bisa melihat perkembangan secara jelas."
    },
    {
      question: "Bisakah Nexora digunakan di lebih dari satu perangkat?",
      answer:
        "Bisa. Kamu dapat mengakses Nexora dari berbagai perangkat dengan akun yang sama."
    }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">


      <nav className="sticky top-0 z-50 bg-white w-full">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          
          <a href="#hero">
            <img src="/logo-nexora.png" alt="logo nexora" className="h-8 w-auto cursor-pointer"/>
          </a>

          <div className="hidden md:flex gap-6 text-sm text-gray-600">
            <a href="#hero" className="hover:text-blue-600">Beranda</a>
            <a href="#fitur" className="hover:text-blue-600">Fitur</a>
            <a href="#tentang" className="hover:text-blue-600">Tentang</a>
            <a href="#bantuan" className="hover:text-blue-600">Bantuan</a>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/register")} className="hover:text-blue-600 text-gray-600 cursor-pointer">Daftar</button>
            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
              Masuk
            </button>
          </div>

        </div>
      </nav>


      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 text-center" id="hero">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-aos="fade-up">
          Kelola hidupmu dengan lebih teratur
        </h1>

        <p className="mt-4 text-gray-500 max-w-xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          Nexora membantu kamu mengatur keuangan, aktivitas harian,
          dan kebiasaan dalam satu tempat yang sederhana.
        </p>

        <div className="mt-6 flex justify-center gap-3" data-aos="zoom-in" data-aos-delay="400">
          <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow cursor-pointer">
            Mulai sekarang
          </button>
          <button onClick={() => navigate("/register")} className="bg-gray-200 px-6 py-3 rounded-xl cursor-pointer">
            Daftar sekarang
          </button>
        </div>

  
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          <div className="flex items-center justify-center h-[320px] md:h-[360px]" data-aos="fade-right">
            <img src="/phone.png" alt="app preview" className="h-full object-contain" />
          </div>

          <div className="flex flex-col gap-6" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-blue-500 text-white rounded-2xl p-6 text-left shadow">
              <p className="text-sm opacity-80">
                Pengguna merasa lebih teratur dalam aktivitas harian
              </p>
              <h2 className="text-4xl font-bold mt-2">95%</h2>
            </div>

            <div className="bg-blue-400 text-white rounded-2xl p-6 text-left shadow">
              <p className="text-sm opacity-80">
                Keuangan, aktivitas, dan kebiasaan dalam satu aplikasi
              </p>
              <h2 className="text-3xl font-bold mt-2">3-in-1</h2>
            </div>
          </div>

          <div className="flex items-center justify-center h-[300px] md:h-[360px]" data-aos="fade-left">
            <img src="/phone-hand.png" alt="app in hand" className="h-full object-contain" />
          </div>

        </div>
      </section>


      <section className="max-w-6xl mx-auto px-6 py-20" id="fitur">

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Semua yang kamu butuhkan <br />
            dalam <span className="text-blue-600">satu aplikasi</span>
          </h2>

          <p className="mt-4 text-gray-500 max-w-md">
            Nexora membantu kamu mengatur hidup dengan lebih simpel, fokus, dan terarah.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            { icon: <FaWallet />, title: "Manajemen Keuangan", desc: "Catat pemasukan dan pengeluaran dengan mudah." },
            { icon: <FaClock />, title: "Atur Aktivitas", desc: "Jadwal harian dengan pengingat terintegrasi." },
            { icon: <FaChartLine />, title: "Insight & Statistik", desc: "Pantau perkembangan lewat grafik." },
            { icon: <FaBell />, title: "Pengingat Pintar", desc: "Notifikasi tanpa gangguan berlebihan." },
            { icon: <FaCircleCheck />, title: "Bangun Kebiasaan", desc: "Lacak kebiasaan positif harian." },
            { icon: <FaLayerGroup />, title: "All-in-One Dashboard", desc: "Semua data dalam satu tampilan." }
          ].map((item, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="bg-white p-6 rounded-2xl shadow hover:border-2 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>


      <section className="max-w-6xl mx-auto px-6 pb-20" id="tentang">

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Kenapa <span className="text-blue-600">Nexora?</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Semua yang kamu butuhkan untuk hidup lebih teratur
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="/about-image.jpg"
            alt="about nexora"
            className="w-full h-[300px] md:h-[380px] object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          </div>
        </div>

      </section>


      <section className="max-w-6xl mx-auto px-6 pb-20" id="bantuan">

        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Punya pertanyaan <br />
            tentang <span className="text-blue-600">Nexora?</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Kami rangkum pertanyaan umum supaya lebih mudah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-start">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);

            return (
              <div
                key={index}
                onClick={() => toggleFaq(index)}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300
                  ${isOpen ? "bg-gray-100" : "bg-white hover:bg-gray-50"}
                `}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{faq.question}</h3>
                  <span className="text-blue-600">
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </span>
                </div>

                {isOpen && (
                  <p className="text-sm text-gray-500 mt-3">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      


      <footer className="relative bg-gradient-to-r from-[#031B3A] to-[#0B3B8C] text-white overflow-hidden">

  
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500 opacity-30 blur-[120px]"></div>

        <div className="max-w-6xl mx-auto px-6 py-14 relative z-10">

          <div className="grid md:grid-cols-4 gap-10">

      
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/nexora-tab-logo.svg" alt="logo" className="h-4" />
                <span className="font-semibold text-lg">Nexora</span>
              </div>

              <p className="text-sm text-gray-300 mb-6">
                Mulai hari ini, wujudkan versi terbaik dirimu bersama Nexora
              </p>

              <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg cursor-pointer">
                Coba sekarang
              </button>
            </div>

      
            <div>
              <h4 className="font-semibold mb-4">Tautan berguna</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#hero">Beranda</a></li>
                <li><a href="#fitur">Fitur</a></li>
                <li><a href="#tentang">Tentang</a></li>
                <li><a href="#bantuan">Bantuan</a></li>
              </ul>
            </div>

      
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Kebijakan privasi</li>
                <li>Syarat & ketentuan</li>
                <li>Pertanyaan umum</li>
                <li>Kontak</li>
              </ul>
            </div>

      
            <div>
              <h4 className="font-semibold mb-4">PeTIK Depok</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Jl. Mandor Basar No.54, <br />
                Rangkapan Jaya, Kec. Pancoran Mas, <br />
                Kota Depok, Jawa Barat 16434
              </p>
            </div>

          </div>

    
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-sm text-gray-400">
              © 2026 Nexora. Semua hak cipta dilindungi.
            </p>

            {}
            <div className="flex gap-3">
              <a href="">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
                  <img src="/wa.svg" alt="whatsapp logo" />
                </div>
              </a>
              <a href="">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
                  <img src="/linkedin.svg" alt="linkedin logo" />
                </div>
              </a>
              <a href="">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
                  <img src="/ig.svg" alt="instagram logo"/>
                </div>
              </a>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}