import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axiosInstance from "../../utils/axiosInstance.jsx"
import { getAuthUser } from "../../utils/authHelper";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Keuangan() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [keuangan, setKeuangan] = useState(null);
  const [transaksi, setTransaksi] = useState([]);
  const [showAllTransaksi, setShowAllTransaksi] = useState(false);
  const [filterMode, setFilterMode] = useState("Mingguan");
  const [showFilter, setShowFilter] = useState(false);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Add Logo with aspect ratio preservation
    try {
      const response = await fetch('/logo-nexora.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          const imgProps = doc.getImageProperties(base64data);
          const logoWidth = 35;
          const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
          doc.addImage(base64data, 'PNG', 14, 10, logoWidth, logoHeight);
          resolve();
        };
      });
    } catch (error) {
      console.error("Could not load logo for PDF", error);
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55); // gray-800
    doc.text("Laporan Keuangan Nexora", 14, 32);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 38);
    
    // Summary Box
    doc.setDrawColor(243, 244, 246); // gray-100
    doc.setFillColor(249, 250, 251); // gray-50
    doc.roundedRect(14, 45, 182, 30, 3, 3, 'FD');
    
    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81); // gray-700
    doc.text(`Total Pemasukan`, 20, 53);
    doc.text(`Total Pengeluaran`, 20, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`Saldo Akhir`, 20, 68);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(16, 185, 129); // green-500
    doc.text(`+ Rp ${Number(keuangan?.pemasukan || 0).toLocaleString('id-ID')}`, 100, 53);
    doc.setTextColor(239, 68, 68); // red-500
    doc.text(`- Rp ${Number(keuangan?.pengeluaran || 0).toLocaleString('id-ID')}`, 100, 60);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(`Rp ${Number(keuangan?.saldo || 0).toLocaleString('id-ID')}`, 100, 68);

    const tableColumn = ["No", "Tanggal", "Kategori", "Tipe", "Catatan", "Jumlah"];
    const tableRows = [];

    transaksi.forEach((item, index) => {
      const rowData = [
        index + 1,
        new Date(item.createdAt).toLocaleDateString('id-ID'),
        item.category,
        item.type.toUpperCase(),
        item.note || "-",
        `Rp ${Number(item.amount).toLocaleString('id-ID')}`
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { 
        fillColor: [37, 99, 235], // blue-600
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        5: { halign: 'right' } // Align 'Jumlah' to right
      },
      styles: { 
        fontSize: 9,
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });

    const user = getAuthUser();
    const userName = user?.name?.split(' ')[0] || "User";
    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`Nexora_Keuangan_${dateStr}_${userName}.pdf`);
  };

  useEffect(() => {
    getKeuangan().finally(() => setIsDataLoading(false))
    getTransaksi()
  }, [])

  const getKeuangan = async () => {
    setIsDataLoading(true);
    try {
      const result = await axiosInstance.get("/dashboard")
      setKeuangan(result.data.data.ringkasanKeuangan)
    } catch (error) {
      console.error(error);
    }
  }

  const getTransaksi = async () => {
    try {
      const result = await axiosInstance.get("/finance")
      setTransaksi(result.data.data)
    } catch (error) {
      console.error(error);
    }
  }



  const getLocalISODate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const grafikData = filterMode === 'Harian' 
    ? [
        { name: "00:00", pemasukan: 0, pengeluaran: 0 },
        { 
          name: "Sekarang", 
          pemasukan: transaksi.filter(t => t.type === 'pemasukan' && getLocalISODate(new Date(t.createdAt)) === getLocalISODate(new Date())).reduce((a, b) => a + Number(b.amount), 0),
          pengeluaran: transaksi.filter(t => t.type === 'pengeluaran' && getLocalISODate(new Date(t.createdAt)) === getLocalISODate(new Date())).reduce((a, b) => a + Number(b.amount), 0)
        },
        { name: "Nanti", pemasukan: 0, pengeluaran: 0 },
      ]
    : Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const tgl = date.toLocaleDateString('id-ID', {day: 'numeric', month: 'long'});
    const day = date.toLocaleDateString('id-ID', {weekday: 'short'});
    const targetDateStr = getLocalISODate(date);
    const dataHarian = transaksi.filter(trx => {
      const trxDate = new Date(trx.createdAt);
      return getLocalISODate(trxDate) === targetDateStr;
    });
    const pemasukan = dataHarian.filter(trx => trx.type === 'pemasukan').reduce((acc, trx) => acc + Number(trx.amount), 0);
    const pengeluaran = dataHarian.filter(trx => trx.type === 'pengeluaran').reduce((acc, trx) => acc + Number(trx.amount), 0);
    return {
      dateObj: date,
      name: day,
      tgl,
      pemasukan,
      pengeluaran,
    };
  })

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"} ml-0 p-6 transition-all duration-300 min-h-screen relative`}>
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {isDataLoading && <Spinner sidebarOpen={sidebarOpen} />}
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Keuangan</h2>
            <p className="text-sm text-gray-500 mt-1">Pencatatan dan ringkasan arus kas Anda</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={exportToPDF}
              className="bg-white border-2 border-slate-100 hover:border-blue-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Unduh PDF
            </button>
            <button 
              onClick={() => navigate("/keuangan/tambah")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-600/10 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              Tambah Transaksi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-full blur-xl -mr-8 -mt-8"></div>
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              <p className="text-sm font-medium">Saldo Saat Ini</p>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight mt-1">
              Rp {Math.abs(keuangan?.saldo || 0).toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-green-50/50 rounded-full blur-xl -mr-8 -mt-8"></div>
             <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              <p className="text-sm font-medium">Pemasukan Bulan Ini</p>
            </div>
            <h2 className="text-3xl font-semibold text-green-600 tracking-tight mt-1">
              + Rp {keuangan?.pemasukan?.toLocaleString('id-ID') || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-red-50/50 rounded-full blur-xl -mr-8 -mt-8"></div>
             <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              <p className="text-sm font-medium">Pengeluaran Bulan Ini</p>
            </div>
            <h2 className="text-3xl font-semibold text-red-600 tracking-tight mt-1">
              - Rp {keuangan?.pengeluaran?.toLocaleString('id-ID') || 0}
            </h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 mb-6">
            <div className="mb-6 flex justify-between items-center relative">
               <div>
                  <h3 className="font-bold text-gray-900 leading-none">Grafik Arus Kas {filterMode === 'Mingguan' ? 'Mingguan' : 'Harian'}</h3>
                  <p className="text-xs text-gray-400 mt-1.5">Visualisasi pergerakan uang Anda {filterMode === 'Mingguan' ? '7 hari terakhir' : 'hari ini'}</p>
               </div>
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 origin-right">
                <button
                  onClick={() => setFilterMode("Harian")}
                  className={`py-1.5 px-4 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${filterMode === "Harian" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setFilterMode("Mingguan")}
                  className={`py-1.5 px-4 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${filterMode === "Mingguan" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Mingguan
                </button>
              </div>
            </div>
            <div className="w-full h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={grafikData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                    tickFormatter={(value) => {
                      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1).replace(/\.0$/, '')}M`;
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')} Jt`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')} Rb`;
                      return value;
                    }}
                    width={50}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      return payload?.[0]?.payload?.tgl || label;
                    }}
                    formatter={(value) => {
                      return [`Rp ${Number(value).toLocaleString('id-ID')}`];
                    }}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)', padding: '10px 14px' }}
                    itemStyle={{ fontSize: '12px', padding: '0', fontWeight: '600', textTransform: 'capitalize', marginTop: '4px' }}
                    labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} />
                  <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" activeDot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border-2 border-slate-100 flex flex-col overflow-hidden w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white z-10 shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg uppercase tracking-tight">Riwayat Transaksi</h3>
                <p className="text-xs text-gray-400 mt-1">Daftar arus kas masuk dan keluar Anda</p>
              </div>
              <button 
                onClick={() => setShowAllTransaksi(!showAllTransaksi)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
              >
                {showAllTransaksi ? "Tampilkan Sedikit" : "Lihat Semua"}
              </button>
            </div>
            
            <div className="flex flex-col flex-1 divide-y divide-gray-100 bg-white overflow-y-auto">
            {(showAllTransaksi ? transaksi : transaksi.slice(0, 5)).length === 0 && (
                <div className="p-12 text-center text-gray-400 text-sm italic">Belum ada catatan transaksi.</div>
            )}
            {(showAllTransaksi ? transaksi : transaksi.slice(0, 5)).map((item) => (
                <div key={item.id} className="flex justify-between items-center px-6 py-5 hover:bg-gray-50/80 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-sm ${item.type === 'pemasukan' ? 'bg-green-50/50 border-green-100 text-green-600' : 'bg-red-50/50 border-red-100 text-red-600'}`}>
                      {item.type === 'pemasukan' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors capitalize">{item.category}</h4>
                      {item.note && <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 italic">"{item.note}"</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${item.type === 'pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.type}</span>
                        <p className="text-[12px] text-gray-500">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold text-base block ${item.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.type === 'pemasukan' ? '+' : '-'} Rp {Number(item.amount).toLocaleString('id-ID')}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Berhasil divalidasi</p>
                  </div>
                </div>
            ))}
            </div>
          </div>
      </div>
    </div>
    </>
  );
}