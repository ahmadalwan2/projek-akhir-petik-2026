import React, { useEffect, useState } from "react";
import Sidebar from '../../component/Sidebar/Sidebar.jsx';
import MobileHeader from '../../component/MobileHeader/MobileHeader.jsx';
import Spinner from '../../component/Spinner/Spinner.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axiosInstance from "../../utils/axiosInstance.jsx"

export default function Keuangan() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [keuangan, setKeuangan] = useState(null)
  const [chartData, setChartData] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [showAllTransaksi, setShowAllTransaksi] = useState(false)
  const [filterMode, setFilterMode] = useState("Mingguan")
  const [showFilter, setShowFilter] = useState(false)

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
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Keuangan</h2>
          <p className="text-sm text-gray-500 mt-1">Pencatatan dan ringkasan arus kas Anda</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-full blur-xl -mr-8 -mt-8"></div>
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              <p className="text-sm font-medium">Saldo Saat Ini</p>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight mt-1">
              Rp {keuangan?.saldo?.toLocaleString('id-ID') || 0}
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
               <div className="relative">
                  <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className="text-xs text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-blue-200 px-4 py-2 rounded-xl bg-blue-50/30 flex items-center gap-2"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Filter: {filterMode}
                  </button>
                  {showFilter && (
                    <div className="absolute top-11 right-0 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                      {['Mingguan', 'Harian'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => { setFilterMode(mode); setShowFilter(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50 flex items-center justify-between ${filterMode === mode ? 'text-blue-600 bg-blue-50/30' : 'text-gray-600'}`}
                        >
                          {mode}
                          {filterMode === mode && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                        </button>
                      ))}
                    </div>
                  )}
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
                    contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                    itemStyle={{ fontWeight: '500', textTransform: 'capitalize' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
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