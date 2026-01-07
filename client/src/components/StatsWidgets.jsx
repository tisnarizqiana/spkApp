import React from "react";

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
      icon: "👥",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      desc: "Influencer terdaftar",
    },
    {
      title: "Avg. Engagement",
      value: stats?.avg_eng ? (stats.avg_eng * 100).toFixed(2) + "%" : "0%",
      icon: "❤️",
      color: "bg-pink-50 text-pink-600 border-pink-100",
      desc: "Rata-rata interaksi",
    },
    {
      title: "Dominasi Negara",
      value: stats?.top_country || "-",
      icon: "🌍",
      color: "bg-green-50 text-green-600 border-green-100",
      desc: "Negara terbanyak",
    },
    {
      title: "Highest Reach",
      value: formatNumber(stats?.max_follower),
      icon: "👑",
      color: "bg-purple-50 text-purple-600 border-purple-100",
      desc: "Followers tertinggi",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-slate-200 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-down">
      {widgets.map((w, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow bg-white ${w.color.replace(
            "bg-",
            "hover:bg-opacity-80 "
          )}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                {w.title}
              </p>
              <h3 className="text-2xl font-extrabold text-slate-800">
                {w.value}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${w.color} bg-opacity-20`}>
              <span className="text-xl">{w.icon}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{w.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsWidgets;
