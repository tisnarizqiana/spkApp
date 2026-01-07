import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const ComparisonModal = ({ isOpen, onClose, users }) => {
  if (!isOpen || users.length < 2) return null;

  // --- PREPARE DATA FOR RADAR CHART ---
  // Kita cari nilai Max dari user yang dipilih untuk normalisasi grafik
  const maxFollowers = Math.max(...users.map((u) => u.followers)) || 1;
  const maxEng = Math.max(...users.map((u) => u.eng_rate)) || 1;
  const maxLikes = Math.max(...users.map((u) => u.avg_likes)) || 1;
  const maxScore = Math.max(...users.map((u) => u.influence_score)) || 1;

  const radarData = [
    { subject: "Followers", fullMark: 100 },
    { subject: "Eng. Rate", fullMark: 100 },
    { subject: "Avg Likes", fullMark: 100 },
    { subject: "Infl. Score", fullMark: 100 },
  ];

  // Masukkan data user ke radarData secara dinamis
  users.forEach((user, idx) => {
    radarData[0][`user${idx}`] = (user.followers / maxFollowers) * 100;
    radarData[1][`user${idx}`] = (user.eng_rate / maxEng) * 100;
    radarData[2][`user${idx}`] = (user.avg_likes / maxLikes) * 100;
    radarData[3][`user${idx}`] = (user.influence_score / maxScore) * 100;
  });

  const colors = ["#2563eb", "#db2777", "#16a34a"]; // Biru, Pink, Hijau

  // Helper Format Angka
  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            ⚖️ Perbandingan Kandidat
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-2xl"
          >
            &times;
          </button>
        </div>

        {/* BODY: SCROLLABLE */}
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 1. GRAFIK RADAR */}
            <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
                Peta Kekuatan
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="70%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    {users.map((user, idx) => (
                      <Radar
                        key={idx}
                        name={user.channel_info}
                        dataKey={`user${idx}`}
                        stroke={colors[idx]}
                        strokeWidth={3}
                        fill={colors[idx]}
                        fillOpacity={0.1}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. TABEL PERBANDINGAN */}
            <div className="w-full lg:w-2/3 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-slate-400 font-medium text-sm">
                      Metrik
                    </th>
                    {users.map((user, idx) => (
                      <th key={idx} className="p-3 text-center min-w-[140px]">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-md"
                            style={{ backgroundColor: colors[idx] }}
                          >
                            {user.channel_info.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-800 text-sm truncate w-full text-center">
                            @{user.channel_info}
                          </span>
                          <span className="text-xs text-slate-500">
                            Rank #{user.rank}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* FOLLOWERS */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-600">
                      Followers
                    </td>
                    {users.map((user, idx) => (
                      <td
                        key={idx}
                        className="p-4 text-center font-bold text-lg text-slate-800"
                      >
                        {formatNumber(user.followers)}
                      </td>
                    ))}
                  </tr>
                  {/* ENGAGEMENT */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-600">
                      Engagement
                    </td>
                    {users.map((user, idx) => (
                      <td
                        key={idx}
                        className="p-4 text-center font-bold text-lg text-slate-800"
                      >
                        {(user.eng_rate * 100).toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  {/* AVG LIKES */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-600">
                      Avg Likes
                    </td>
                    {users.map((user, idx) => (
                      <td
                        key={idx}
                        className="p-4 text-center font-bold text-slate-700"
                      >
                        {formatNumber(user.avg_likes)}
                      </td>
                    ))}
                  </tr>
                  {/* SCORE AKHIR */}
                  <tr className="bg-yellow-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      Final Score
                    </td>
                    {users.map((user, idx) => (
                      <td key={idx} className="p-4 text-center">
                        <span className="text-2xl font-extrabold text-blue-600">
                          {user.calculation.final_score}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
