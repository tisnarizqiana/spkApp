import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import {
  LayoutDashboard,
  UploadCloud,
  LogOut,
  Sun,
  Moon,
  Zap,
} from "lucide-react";

// Import Components
import AuthPage from "./pages/AuthPage";
import InputForm from "./components/InputForm";
import ResultTable from "./components/ResultTable";
import UploadModal from "./components/UploadModal";
import ResultCharts from "./components/ResultCharts";
import SkeletonTable from "./components/SkeletonTable";
import StatsWidgets from "./components/StatsWidgets";
// IMPORT API_URL DARI SINI:
import { getRecommendations, API_URL } from "./api";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : true;
  });

  // Criteria State
  const [criteria, setCriteria] = useState({
    target_followers: 5,
    target_eng_rate: 5,
    target_influence_score: 5,
    target_avg_likes: 4,
    target_posts: 3,
  });

  // --- EFFECTS ---

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "false");
    }
  }, [isDarkMode]);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      // PERBAIKAN: Pakai API_URL
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error("Gagal ambil stats:", error);
      setStats({ total: 0, avg_eng: 0, top_country: "-", max_follower: 0 });
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // --- HANDLERS ---

  // Handle Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResults([]);

    try {
      const response = await getRecommendations(criteria);
      console.log("Response API:", response);

      let finalData = [];
      if (Array.isArray(response.data)) {
        finalData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        finalData = response.data.data;
      } else if (Array.isArray(response)) {
        finalData = response;
      }

      if (finalData.length > 0) {
        setResults(finalData);
        toast.success(`Berhasil! Ditemukan ${finalData.length} kandidat.`);
      } else {
        toast("Tidak ada data yang cocok dengan kriteria.", { icon: "🔍" });
      }
    } catch (error) {
      console.error("Error Search:", error);
      toast.error("Gagal mengambil data. Cek koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  // Upload Success
  const handleUploadSuccess = () => {
    fetchStats();
    setResults([]);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 pb-20">
      {/* --- NAVBAR PREMIUM (Full Rounded & Clean) --- */}
      <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 mb-8">
        <nav
          className="max-w-7xl mx-auto rounded-full border transition-all duration-300 backdrop-blur-xl shadow-lg
          bg-white/80 border-slate-200 shadow-slate-200/50
          dark:bg-slate-900/80 dark:border-slate-700 dark:shadow-slate-900/50"
        >
          <div className="px-6 h-20 flex justify-between items-center">
            {/* 1. BRAND LOGO (Left) */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 text-white p-2.5 rounded-full shadow-lg shadow-brand-500/30 ring-2 ring-white dark:ring-slate-800">
                <LayoutDashboard size={22} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-black tracking-tighter italic text-slate-900 dark:text-white leading-none">
                  IM<span className="text-brand-500">MATCH</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Decision Support System
                </p>
              </div>
            </div>

            {/* 2. ACTIONS & PROFILE (Right) - SEARCH HILANG */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full transition-all border shadow-sm
                  bg-white text-slate-600 border-slate-200 hover:bg-slate-50
                  dark:bg-slate-800 dark:text-yellow-400 dark:border-slate-700 dark:hover:bg-slate-700
                  active:scale-95"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Upload Button */}
              <button
                onClick={() => setIsUploadOpen(true)}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border shadow-sm
                  bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300
                  dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700
                  active:scale-95 group"
              >
                <UploadCloud
                  size={18}
                  className="text-slate-400 group-hover:text-brand-500 transition-colors"
                />
                <span>Upload</span>
              </button>

              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-2"></div>

              {/* Profile Dropdown Trigger */}
              <div className="flex items-center gap-3 pl-1">
                <div className="text-right hidden lg:block leading-tight">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Admin
                  </p>
                  <p className="text-sm font-black text-slate-800 dark:text-white truncate max-w-[100px]">
                    {user?.username || "User"}
                  </p>
                </div>

                <div className="relative group cursor-pointer">
                  {/* Avatar Circle */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 p-[2px] shadow-lg shadow-brand-500/20">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                      <span className="font-black text-brand-600 text-sm">
                        {user?.username?.[0]?.toUpperCase() || "A"}
                      </span>
                    </div>
                  </div>
                  {/* Online Indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </div>

                <button
                  onClick={logout}
                  className="bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2.5 rounded-full transition-all dark:bg-slate-800 dark:hover:bg-red-900/20 ml-1"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* MODAL UPLOAD */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Header Section */}
        <div className="mb-10 animate-fade-in-down">
          <div className="flex items-center gap-2 text-brand-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
            <Zap size={14} /> DSS Core System
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Influencer Analysis
          </h2>
        </div>

        {/* Widget Stats */}
        <StatsWidgets stats={stats} loading={statsLoading} />

        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          {/* Sidebar Filter (Sticky) */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="sticky top-28">
              <InputForm
                criteria={criteria}
                setCriteria={setCriteria}
                handleSearch={handleSearch}
                loading={loading}
              />
            </div>
          </div>

          {/* Result Area */}
          <div className="w-full lg:w-2/3 xl:w-3/4 space-y-8">
            {/* 1. LOADING STATE */}
            {loading ? (
              <div className="bg-white dark:bg-darkCard rounded-4xl p-8 border border-slate-200 dark:border-darkBorder shadow-sm">
                <SkeletonTable />
              </div>
            ) : /* 2. HASIL DITEMUKAN */
            results.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                {/* Chart Section */}
                <div className="bg-white dark:bg-darkCard rounded-4xl p-1 border border-slate-200 dark:border-darkBorder shadow-sm overflow-hidden">
                  <ResultCharts data={results} />
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-darkCard rounded-4xl border border-slate-200 dark:border-darkBorder shadow-sm overflow-hidden">
                  <ResultTable data={results} />
                </div>
              </div>
            ) : (
              /* 3. BELUM ADA HASIL (EMPTY STATE) */
              <div className="bg-white dark:bg-darkCard p-20 rounded-4xl border border-slate-200 dark:border-darkBorder shadow-sm text-center border-dashed border-2 flex flex-col items-center justify-center min-h-[400px]">
                {/* Menggunakan Search Icon dengan style clean */}
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                  <Zap
                    className="text-slate-300 dark:text-slate-600"
                    size={40}
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Siap Menganalisis
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                  Silakan atur prioritas bobot kriteria di panel sebelah kiri,
                  lalu klik tombol{" "}
                  <span className="font-bold text-brand-500">
                    Analisis Profile
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Route Guard Wrapper
const AppContent = () => {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-bold rounded-2xl shadow-xl",
          style: { background: "#333", color: "#fff" },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
