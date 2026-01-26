import React from "react";
import { Users, Heart, Globe, Crown } from "lucide-react";

const StatsWidgets = ({ stats, loading }) => {
  // Helper Format Angka
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const widgets = [
    {
      title: "Total Database",
      value: stats?.total || 0,
      icon: <Users size={24} />,
      // Warna Gradient Blue
      bgClass: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadowClass: "shadow-blue-500/30",
      desc: "Influencer terdaftar",
    },
    {
      title: "Avg. Engagement",
      value: stats?.avg_eng ? (stats.avg_eng * 100).toFixed(2) + "%" : "0%",
      icon: <Heart size={24} />,
      // Warna Gradient Pink/Rose
      bgClass: "bg-gradient-to-br from-rose-400 to-pink-600",
      shadowClass: "shadow-pink-500/30",
      desc: "Rata-rata interaksi",
    },
    {
      title: "Dominasi Negara",
      value: stats?.top_country || "-",
      icon: <Globe size={24} />,
      // Warna Gradient Emerald/Teal
      bgClass: "bg-gradient-to-br from-emerald-400 to-teal-600",
      shadowClass: "shadow-emerald-500/30",
      desc: "Negara terbanyak",
    },
    {
      title: "Highest Reach",
      value: formatNumber(stats?.max_follower),
      icon: <Crown size={24} />,
      // Warna Gradient Amber/Orange
      bgClass: "bg-gradient-to-br from-amber-400 to-orange-600",
      shadowClass: "shadow-orange-500/30",
      desc: "Followers tertinggi",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {widgets.map((w, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-darkCard p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            {/* Icon Container dengan Gradient & Shadow */}
            <div className={`p-3.5 rounded-2xl text-white shadow-lg ${w.bgClass} ${w.shadowClass} group-hover:scale-110 transition-transform`}>
              {w.icon}
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              {w.title}
            </p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white truncate">
              {w.value}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
              {w.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsWidgets;