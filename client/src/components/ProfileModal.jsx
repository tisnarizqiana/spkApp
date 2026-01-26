import React from "react";
import { 
  X, 
  MapPin, 
  Instagram, 
  Video, 
  Users, 
  Heart, 
  Image as ImageIcon, 
  Lightbulb, 
  Trophy,
  Activity
} from "lucide-react";

const ProfileModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Helper: Buka Link Sosmed
  const openSocial = (platform) => {
    const username = data.channel_info.replace(/[^a-zA-Z0-9_.]/g, "");
    let url = "";
    if (platform === "instagram") url = `https://www.instagram.com/${username}`;
    if (platform === "tiktok") url = `https://www.tiktok.com/@${username}`;
    window.open(url, "_blank");
  };

  // Helper Format Angka
  const formatNum = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    // 1. OVERLAY (Backdrop gelap & blur)
    // z-[99] memastikan dia di atas segalanya (Navbar/Sidebar)
    <div 
      className="fixed inset-0 z-[99] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose} // Klik luar untuk tutup
    >
      
      {/* 2. MODAL CONTAINER (Glassmorphism) */}
      <div 
        className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()} // Supaya klik dalam tidak menutup modal
      >
        
        {/* HEADER: Gradient & Pattern */}
        <div className="relative h-44 bg-gradient-to-r from-brand-600 to-indigo-600 overflow-hidden">
          {/* Dekorasi Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          {/* TOMBOL CLOSE (FIXED) */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md cursor-pointer border border-white/10 shadow-lg hover:rotate-90 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="px-8 pb-8">
          
          {/* AVATAR & HEADER INFO */}
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 -mt-16 mb-8 relative z-10">
            
            {/* Avatar Circle */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full p-1.5 bg-white dark:bg-slate-900 shadow-2xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-4xl font-black text-slate-400 dark:text-slate-500 uppercase border border-slate-300 dark:border-slate-700">
                  {data.channel_info.substring(0, 2)}
                </div>
              </div>
              {/* Rank Badge Absolut */}
              <div className="absolute bottom-1 right-1 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
                #{data.rank}
              </div>
            </div>

            {/* Nama & Lokasi */}
            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  @{data.channel_info}
                </h2>
                {data.rank <= 3 && <Trophy size={20} className="text-yellow-500 fill-yellow-500" />}
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <span className="flex items-center gap-1"><MapPin size={14} /> {data.country || "Global Region"}</span>
              </div>
            </div>

            {/* Tombol Sosmed */}
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => openSocial("instagram")}
                className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 hover:to-rose-700 text-white rounded-2xl shadow-lg shadow-pink-500/30 transition-transform hover:scale-105 active:scale-95"
                title="Instagram"
              >
                <Instagram size={20} />
              </button>
              <button
                onClick={() => openSocial("tiktok")}
                className="p-3 bg-slate-900 dark:bg-black hover:bg-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/30 transition-transform hover:scale-105 active:scale-95"
                title="TikTok"
              >
                <Video size={20} />
              </button>
            </div>
          </div>

          {/* GRID STATISTIK (Glass Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatBox label="Followers" value={formatNum(data.followers)} icon={<Users size={18} className="text-blue-500" />} />
            <StatBox label="Engagement" value={`${(data.eng_rate * 100).toFixed(2)}%`} icon={<Activity size={18} className="text-green-500" />} />
            <StatBox label="Avg Likes" value={formatNum(data.avg_likes)} icon={<Heart size={18} className="text-pink-500" />} />
            <StatBox label="Total Posts" value={data.posts} icon={<ImageIcon size={18} className="text-purple-500" />} />
          </div>

          {/* AI INSIGHT BOX */}
          <div className="relative overflow-hidden rounded-3xl bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-500/20 p-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lightbulb size={100} className="text-brand-600" />
            </div>
            
            <div className="relative z-10 flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-white dark:bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm">
                <Lightbulb size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">AI Recommendation Insight</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Influencer ini memiliki skor <strong>Core Factor {data.calculation.NCF}</strong> dan <strong>Secondary Factor {data.calculation.NSF}</strong>. 
                  Dengan Engagement Rate <strong className={data.eng_rate > 0.03 ? "text-green-600" : "text-yellow-600"}>{(data.eng_rate * 100).toFixed(2)}%</strong>, 
                  kandidat ini {data.calculation.final_score > 4.5 ? "Sangat Direkomendasikan" : "Cukup Potensial"} untuk campaign Anda.
                </p>
              </div>
            </div>
            
            {/* Score Bar Visual */}
            <div className="mt-4 pt-4 border-t border-brand-200 dark:border-brand-800/50 flex items-center justify-between">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Final Match Score</span>
              <span className="text-2xl font-black text-brand-600 dark:text-white">{data.calculation.final_score} <span className="text-sm text-slate-400 font-medium">/ 5.0</span></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-Component StatBox dengan style Glass
const StatBox = ({ label, value, icon }) => (
  <div className="group p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300">
    <div className="mb-3 p-2 w-fit rounded-xl bg-white dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">
      {value}
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default ProfileModal;