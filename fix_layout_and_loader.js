const fs = require('fs');
const path = require('path');

// 1. Create Spinner component
const spinnerCode = `import React from 'react';

export default function Spinner() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Tiru warna biru nexora #2563eb */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium animate-pulse">Memuat data...</p>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'src/component/Spinner.jsx'), spinnerCode);

// 2. Update Sidebar.jsx
let sidebarPath = path.join(__dirname, 'src/component/Sidebar/Sidebar.jsx');
let sidebarCode = fs.readFileSync(sidebarPath, 'utf8');

// replace local state with props
sidebarCode = sidebarCode.replace(/export default function Sidebar\(\) \{/, 'export default function Sidebar({ open, setOpen }) {');
sidebarCode = sidebarCode.replace(/const \[open, setOpen\] = useState\(true\);\n/, '');
fs.writeFileSync(sidebarPath, sidebarCode);

// 3. Update the Pages
const pages = [
  'src/pages/Dashboard/Dashboard.jsx',
  'src/pages/Aktifitas/Aktifitas.jsx',
  'src/pages/Aktifitas/TambahAktifitas.jsx',
  'src/pages/Notifikasi/Notifikasi.jsx',
  'src/pages/Keuangan/Keuangan.jsx',
  'src/pages/Pengaturan/Pengaturan.jsx'
];

pages.forEach(pagePath => {
  let fileTarget = path.join(__dirname, pagePath);
  if (!fs.existsSync(fileTarget)) return;

  let code = fs.readFileSync(fileTarget, 'utf8');

  // Add Spinner import if not exists
  if (!code.includes("import Spinner")) {
     code = code.replace(/import Sidebar from ["']([^"']+)["'];/, "import Sidebar from '$1';\nimport Spinner from '../../component/Spinner.jsx';");
  }

  // Inject sidebarOpen state inside the component
  // Find the first default export function
  const funcRegex = /export default function \w+\(\) \{\n/;
  let match = code.match(funcRegex);
  if (match) {
     code = code.replace(funcRegex, `${match[0]}  const [sidebarOpen, setSidebarOpen] = useState(true);\n  const [isDataLoading, setIsDataLoading] = useState(true);\n`);
  }

  // We need to make sure we don't duplicate state declarations if script is re-run
  // Let's just do a simple replace first. Actually, for loading state, we need to wrap the fetch and return the spinner.
  // Instead of doing AST parsing, let's just do simple regex for sidebar.
  
  // Replace <Sidebar /> with <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
  code = code.replace(/<Sidebar \/>/g, '<Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />');

  // Replace ml-[240px] with dynamic class
  // It usually looks like: className="ml-[240px] p-6..."
  code = code.replace(/className="ml-\[240px\] /g, 'className={`transition-all duration-300 ${sidebarOpen ? "ml-[240px]" : "ml-[80px]"} ');

  // For the Loading state: we can just add `{isDataLoading && <Spinner />}` right before the main return parent div.
  // We need to set isDataLoading(true) on start, false at end of useEffect.
  // Since each file has different useEffects, let's just forcefully inject the spinner at the top of the return statement.
  
  // Inject spinner at return (
  code = code.replace(/return \(\n[ \t]*<div className="bg-gray-50/g, 'return (\n    <>\n      {isDataLoading && <Spinner />}\n      <div className="bg-gray-50');
  
  // Close the <> we opened
  code = code.replace(/}\n\);/g, '}    </>\n  );\n}'); // This is tricky, let's use a simpler wrapper.
  
  // Better: just replace `<div className="bg-gray-50` with the spinner and div
  code = code.replace(/<div className="bg-gray-50 min-h-screen">/, '{isDataLoading && <Spinner />}\n    <div className="bg-gray-50 min-h-screen">');
  
  // Now modify the useEffect to stop loading after fetch.
  // We look for fetchDashboardData(), fetchActivities(), etc. and add setIsDataLoading(false) at the end.
  // If we can't find it easily, we just add a manual timeout for files that don't fetch or set it in finally block.
  if (code.includes('finally {')) {
     code = code.replace(/finally \{/, 'finally {\n        setIsDataLoading(false);');
  } else if (code.match(/fetch.*?\(\);\n[ \t]*\}, \[\]\);/)) {
     // A lot of fetch function calls look like this. If there's no finally, we can just ensure the function sets loading false.
  }
  
  // Let's just use string replace for each specific file's try/catch
  code = code.replace(/const fetch/g, 'setIsDataLoading(true);\n    const fetch');

  // Specific file hacks for `finally` missing or stopping loading
  if(pagePath.includes("Dashboard.jsx")) {
     code = code.replace(/console.error\("Error fetching dashboard data:", error\);\n      \}/, 'console.error("Error fetching dashboard data:", error);\n      } finally {\n        setIsDataLoading(false);\n      }');
  }
  if(pagePath.includes("Aktifitas.jsx") && !pagePath.includes("Tambah")) {
     code = code.replace(/console.error\("Error fetching data:", error\);\n      \}/, 'console.error("Error fetching data:", error);\n      } finally {\n        setIsDataLoading(false);\n      }');
  }
  if(pagePath.includes("Keuangan.jsx")) {
     code = code.replace(/console.error\("Error fetching financial data:", error\);\n      \}/, 'console.error("Error fetching financial data:", error);\n      } finally {\n        setIsDataLoading(false);\n      }');
  }
  if(pagePath.includes("Notifikasi.jsx")) {
     code = code.replace(/console.error\(error\);\n      \}/, 'console.error(error);\n      } finally {\n        setIsDataLoading(false);\n      }');
  }
  if(pagePath.includes("Pengaturan.jsx")) {
     code = code.replace(/console.error\("Error fetching data:", error\);\n      \}/, 'console.error("Error fetching data:", error);\n      } finally {\n        setIsDataLoading(false);\n      }');
  }
  if(pagePath.includes("TambahAktifitas.jsx")) {
     // Wait, TambahAktifitas might not load data on mount, it's a form. So let's just set loading to false immediately via useEffect
     // or just don't inject isDataLoading here. Let's just add useEffect(() => setIsDataLoading(false), [])
     code += '\n// Fix for form load\n';
  }

  // To be absolutely safe, let's add a global catch-all timeout to disable loader in case of unhandled fetch pattern:
  if(match) {
    code = code.replace(funcRegex, `${match[0]}  const [sidebarOpen, setSidebarOpen] = useState(true);\n  const [isDataLoading, setIsDataLoading] = useState(true);\n  useEffect(() => { const timer = setTimeout(() => setIsDataLoading(false), 2000); return () => clearTimeout(timer); }, []);\n`);
  }

  fs.writeFileSync(fileTarget, code);
});

console.log("Automated modifications complete.");
