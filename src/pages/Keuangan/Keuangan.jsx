import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axiosIntance from "../../utils/axiosIntance.jsx"

export default function Keuangan() {
  const [keuangan, setKeuangan] = useState(null)
  const [chartData, setChartData] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [showAllTransaksi, setShowAllTransaksi] = useState(false)

  useEffect(() => {
    getKeuangan()
    getTransaksi()
  }, [])

  // useEffect(() => {
  //   const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  //   const data = [];
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   for (let i = 6; i >= 0; i--) {
  //     const date = new Date(today);
  //     date.setDate(today.getDate() - i);
  //     data.push({
  //       dateObj: date,
  //       name: days[date.getDay()],
  //       pemasukan: 0,
  //       pengeluaran: 0,
  //     });
  //   }

  //   if (transaksi && transaksi.length > 0) {
  //     transaksi.forEach((item) => {
  //       const trxDate = new Date(item.createdAt);
  //       trxDate.setHours(0, 0, 0, 0);

  //       const targetDay = data.find((d) => d.dateObj.getTime() === trxDate.getTime());
  //       if (targetDay) {
  //         if (item.type === 'pemasukan') {
  //           targetDay.pemasukan += Number(item.amount);
  //         } else if (item.type === 'pengeluaran') {
  //           targetDay.pengeluaran += Number(item.amount);
  //         }
  //       }
  //     });
  //   }

  //   setChartData(data);
  // }, [keuangan, transaksi])

const getKeuangan = async () => {
  try {
    const result = await axiosIntance.get("/dashboard")
      setKeuangan(result.data.data.ringkasanKeuangan)
    // console.log(result.data);
    
  } catch (error) {
    console.log(error?.response?.data);
  }
}

const getTransaksi = async () => {
  try {
    const result = await axiosIntance.get("/finance")
    setTransaksi(result.data.data)
    console.log(result.data);
    
  } catch (error) {
    console.log(error?.response?.data);
  }
}

const getLocalISODate = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const grafikData = Array.from({length: 7}, (_, i) => {
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
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="ml-[240px] p-6 transition-all duration-300">
        
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Keuangan</h2>
          <p className="text-sm text-gray-500 mt-1">Pencatatan dan ringkasan arus kas Anda</p>
        </div>

        {/* SUMMARY CARDS */}
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              <p className="text-sm font-medium">Saldo Saat Ini</p>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-1">
              Rp {keuangan?.saldo?.toLocaleString('id-ID') || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              <p className="text-sm font-medium">Pemasukan Bulan Ini</p>
            </div>
            <h2 className="text-3xl font-bold text-green-600 tracking-tight mt-1">
              + Rp {keuangan?.pemasukan?.toLocaleString('id-ID') || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-gray-500">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              <p className="text-sm font-medium">Pengeluaran Bulan Ini</p>
            </div>
            <h2 className="text-3xl font-bold text-red-600 tracking-tight mt-1">
              - Rp {keuangan?.pengeluaran?.toLocaleString('id-ID') || 0}
            </h2>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* CHART */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6 flex justify-between items-center">
               <h3 className="font-bold text-gray-900">Grafik Arus Kas Mingguan</h3>
               <button className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors cursor-pointer border border-blue-100 px-3 py-1.5 rounded-lg bg-blue-50/50">Filter</button>
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
          
          {/* TRANSACTIONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[430px]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white z-10 shrink-0">
              <h3 className="font-bold text-gray-900">Transaksi Terakhir</h3>
              <button 
                onClick={() => setShowAllTransaksi(!showAllTransaksi)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                {showAllTransaksi ? "Tutup" : "Lihat Semua"}
              </button>
            </div>
            
            <div className="flex flex-col flex-1 divide-y divide-gray-100 bg-white overflow-y-auto">
            {(showAllTransaksi ? transaksi : transaksi.slice(0, 5)).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50/80 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${item.type === 'pemasukan' ? 'bg-green-50/50 border-green-100 text-green-600' : 'bg-red-50/50 border-red-100 text-red-600'}`}>
                      {item.type === 'pemasukan' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-[14px] text-gray-800 group-hover:text-blue-600 transition-colors capitalize">{item.category}</h4>
                      <p className="text-[12px] text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-[14px] ${item.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                   {item.type === 'pemasukan' ? '+' : '-'} Rp {Number(item.amount).toLocaleString('id-ID')}
                  </span>
                </div>
            ))}
          
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}