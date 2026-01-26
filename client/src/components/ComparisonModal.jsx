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
import { X, Scale, Target } from "lucide-react";

const ComparisonModal = ({ isOpen, onClose, users }) => {
  if (!isOpen || users.length < 2) return null;

  // --- PREPARE DATA ---
  const maxFollowers = Math.max(...users.map((u) => u.followers)) || 1;
  const maxEng = Math.max(...users.map((u) => u.eng_rate)) || 1;
  const maxLikes = Math.max(...users.map((u) => u.avg_likes)) || 1;
  const maxScore = Math.max(...users.map((u) => u.influence_score)) || 1;

  const radarData = [
    { subject: "Followers", fullMark: 100 },
    { subject: "Engagement", fullMark: 100 },
    { subject: "Avg Likes", fullMark: 100 },
    { subject: "Infl. Score", fullMark: 100 },
  ];

  users.forEach((user, idx) => {
    radarData[0][`user${idx}`] = (user.followers / maxFollowers) * 100;
    radarData[1][`user${idx}`] = (user.eng_rate / maxEng) * 100;
    radarData[2][`user${idx}`] = (user.avg_likes / maxLikes) * 100;
    radarData[3][`user${idx}`] = (user.influence_score / maxScore) * 100;
  });

  const colors = ["#8b5cf6", "#ec4899", "#10b981"]; // Violet, Pink, Emerald

  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-darkCard rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700">
        
        {/* HEADER */}
        <div className="bg-white dark:bg-darkCard p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Head-to-Head</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Membandingkan {users.length} kandidat terbaik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto bg-slate-50 dark:bg-darkBg/50 h-full">
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            
            {/* 1. RADAR CHART CARD */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-darkCard rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Target size={16} className="text-slate-400" />
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Peta Kekuatan
                </h4>
              </div>
              <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    {users.map((user, idx) => (
                      <Radar
                        key={idx}
                        name={user.channel_info}
                        dataKey={`user${idx}`}
                        stroke={colors[idx]}
                        strokeWidth={3}
                        fill={colors[idx]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. COMPARISON TABLE */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-darkCard rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                      <th className="p-5 text-slate-400 font-bold text-[10px] uppercase tracking-widest w-1/4">
                        Parameter
                      </th>
                      {users.map((user, idx) => (
                        <th key={idx} className="p-5 text-center min-w-[140px]">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold mb-3 shadow-lg shadow-slate-200 dark:shadow-none"
                              style={{ backgroundColor: colors[idx] }}
                            >
                              {user.channel_info.substring(0, 1).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-sm truncate w-full text-center block mb-1">
                              @{user.channel_info}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                              Rank #{user.rank}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    <Row label="Followers" values={users.map(u => formatNumber(u.followers))} />
                    <Row label="Engagement Rate" values={users.map(u => (u.eng_rate * 100).toFixed(2) + "%")} highlight />
                    <Row label="Avg Likes" values={users.map(u => formatNumber(u.avg_likes))} />
                    
                    {/* Final Score Row */}
                    <tr className="bg-yellow-50/50 dark:bg-yellow-500/5">
                      <td className="p-5 font-bold text-slate-800 dark:text-slate-200 text-sm">Final Score</td>
                      {users.map((user, idx) => (
                        <td key={idx} className="p-5 text-center">
                          <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
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
    </div>
  );
};

// Helper Component Row
const Row = ({ label, values, highlight = false }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
    <td className="p-5 font-medium text-slate-500 dark:text-slate-400 text-sm">{label}</td>
    {values.map((val, idx) => (
      <td key={idx} className={`p-5 text-center font-bold text-base ${
        highlight ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'
      }`}>
        {val}
      </td>
    ))}
  </tr>
);

export default ComparisonModal;