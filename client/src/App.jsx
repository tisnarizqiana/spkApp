import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // Import Auth

// Import Components
import AuthPage from "./pages/AuthPage"; // Halaman Login
import InputForm from "./components/InputForm";
import ResultTable from "./components/ResultTable";
import UploadModal from "./components/UploadModal";
import ResultCharts from "./components/ResultCharts";
import SkeletonTable from "./components/SkeletonTable";
import StatsWidgets from "./components/StatsWidgets";
import { getRecommendations } from "./api";

// --- KOMPONEN UTAMA DASHBOARD ---
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext); // Ambil data user
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [criteria, setCriteria] = useState({
    target_followers: 5,
    target_eng_rate: 5,
    target_influence_score: 5,
    target_avg_likes: 4,
    target_posts: 3,
  });

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get("http://localhost:3000/api/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const data = await getRecommendations(criteria);
      setResults(data.data);
      toast.success(`Ditemukan ${data.data.length} kandidat!`);
    } catch (error) {
      toast.error("Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">
                IM
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800">
                  InfluencerMatch
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-500">Welcome,</p>
                <p className="text-sm font-bold text-slate-800">
                  {user?.username}
                </p>
              </div>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold"
              >
                📂 Upload
              </button>
              <button
                onClick={logout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          setResults([]);
          fetchStats();
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsWidgets stats={stats} loading={statsLoading} />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <InputForm
              criteria={criteria}
              setCriteria={setCriteria}
              handleSearch={handleSearch}
              loading={loading}
            />
          </div>
          <div className="w-full lg:w-2/3 xl:w-3/4">
            {loading ? (
              <SkeletonTable />
            ) : results.length > 0 ? (
              <>
                <ResultCharts data={results} />
                <ResultTable data={results} />
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl border text-center text-slate-500">
                Silakan klik Analisis untuk memulai.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- APP WRAPPER (Route Guard) ---
const AppContent = () => {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
