import React from "react";
import { 
  X, 
  MapPin, 
  Instagram, 
  Video, // Icon pengganti TikTok (karena Lucide belum punya logo TikTok native yang sempurna, Video works well)
  Users, 
  Heart, 
  Image as ImageIcon, 
  Activity, 
  Lightbulb, 
  Trophy 
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-darkCard rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 border border-slate-200 dark:border-slate-700">
        
        {/* HEADER: Gradient Background */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 h-36 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all backdrop-blur-md"
          >
            <X size={20} />
          </button>
          
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>

        {/* BODY: Profile Info */}
        <div className="px-8 pb-8 relative">
          {/* Avatar (Inisial) */}
          <div className="-mt-16 mb-6 flex justify-between items-end">
            <div className="w-32 h-32 bg-white dark:bg-darkCard rounded-full p-2 shadow-xl">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl font-black text-slate-400 dark:text-slate-500 uppercase border border-slate-200 dark:border-slate-700">
                {data.channel_info.substring(0, 2)}
              </div>
            </div>

            {/* Score Badge (Mobile/Desktop Layout) */}
            <div className="hidden sm:block text-right">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Final Score</span>
               <div className="text-5xl font-black text-brand-600 dark:text-brand-400 leading-none mt-1">
                 {data.calculation.final_score}
               </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Kiri: Identitas */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  @{data.channel_info}
                </h2>
                {data.rank <= 3 && <Trophy size={20} className="text-yellow-500 fill-yellow-500" />}
              </div>
              
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} /> {data.country || "Global"}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold border border-slate-200 dark:border-slate-700">
                  Rank #{data.rank || "-"}
                </span>
              </div>

              {/* Tombol Sosmed */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => openSocial("instagram")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-pink-500 to-rose-600 hover:to-rose-700 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-pink-500/30 active:scale-95"
                >
                  <Instagram size={16} /> Instagram
                </button>
                <button
                  onClick={() => openSocial("tiktok")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-black hover:bg-slate-800 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/30 dark:shadow-none active:scale-95"
                >
                  <Video size={16} /> TikTok
                </button>
              </div>

              {/* Grid Statistik */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Followers" value={formatNum(data.followers)} icon={<Users size={16} />} />
                <StatBox label="Engagement" value={`${(data.eng_rate * 100).toFixed(2)}%`} icon={<Activity size={16} />} />
                <StatBox label="Avg Likes" value={formatNum(data.avg_likes)} icon={<Heart size={16} />} />
                <StatBox label="Total Posts" value={data.posts} icon={<ImageIcon size={16} />} />
              </div>

              {/* Analisa Cepat */}
              <div className="mt-8 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-500/20 p-5 rounded-2xl flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">AI Insight</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Influencer ini memiliki skor <strong>Core Factor {data.calculation.NCF}</strong> dan <strong>Secondary Factor {data.calculation.NSF}</strong>.
                    {data.calculation.NCF > data.calculation.NSF
                      ? " Sangat direkomendasikan untuk campaign yang butuh interaksi intens (High Engagement)."
                      : " Pilihan tepat untuk Brand Awareness karena jangkauan audiens yang luas (High Reach)."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components & Functions
const formatNum = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

const StatBox = ({ label, value, icon }) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
    <div className="text-slate-400 mb-2">{icon}</div>
    <div className="text-lg font-black text-slate-800 dark:text-white leading-none mb-1">{value}</div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
  </div>
);

export default ProfileModal;