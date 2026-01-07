import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const ResultCharts = ({ data }) => {
  // Cek data kosong untuk menghindari error render
  if (!data || data.length === 0) return null;

  // --- 1. PREPARE DATA BAR CHART ---
  const top5 = data.slice(0, 5).map((item) => ({
    name:
      item.channel_info.length > 10
        ? item.channel_info.substring(0, 10) + "..."
        : item.channel_info,
    Score: item.calculation.final_score,
    Core: item.calculation.NCF,
    Secondary: item.calculation.NSF,
  }));

  // --- 2. PREPARE DATA RADAR CHART ---
  const top10 = data.slice(0, 10);
  // Gunakan fallback '|| 1' untuk menghindari pembagian dengan nol
  const maxFollowers = Math.max(...top10.map((d) => d.followers)) || 1;
  const maxEng = Math.max(...top10.map((d) => d.eng_rate)) || 1;
  const maxLikes = Math.max(...top10.map((d) => d.avg_likes)) || 1;
  const maxPosts = Math.max(...top10.map((d) => d.posts)) || 1;
  const maxScore = Math.max(...top10.map((d) => d.influence_score)) || 1;

  const candidate1 = data[0];
  const candidate2 = data[1] || data[0];

  const radarData = [
    {
      subject: "Followers",
      A: (candidate1.followers / maxFollowers) * 100,
      B: (candidate2.followers / maxFollowers) * 100,
      fullMark: 100,
    },
    {
      subject: "Engagement",
      A: (candidate1.eng_rate / maxEng) * 100,
      B: (candidate2.eng_rate / maxEng) * 100,
      fullMark: 100,
    },
    {
      subject: "Avg Likes",
      A: (candidate1.avg_likes / maxLikes) * 100,
      B: (candidate2.avg_likes / maxLikes) * 100,
      fullMark: 100,
    },
    {
      subject: "Activity",
      A: (candidate1.posts / maxPosts) * 100,
      B: (candidate2.posts / maxPosts) * 100,
      fullMark: 100,
    },
    {
      subject: "Infl. Score",
      A: (candidate1.influence_score / maxScore) * 100,
      B: (candidate2.influence_score / maxScore) * 100,
      fullMark: 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
      {/* --- CHART 1: BAR CHART --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          🏆 Top 5 Score Perbandingan
        </h3>

        {/* PERBAIKAN DI SINI: Gunakan className h-72 (tinggi fix 18rem/288px) */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top5}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis domain={[0, 6]} hide />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Legend />
              <Bar
                dataKey="Core"
                stackId="a"
                fill="#3b82f6"
                name="Core Factor"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="Secondary"
                stackId="a"
                fill="#8b5cf6"
                name="Secondary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CHART 2: RADAR CHART --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          ⚔️ Head-to-Head: Rank #1 vs #2
        </h3>

        {/* PERBAIKAN DI SINI: Gunakan className h-72 agar wadah punya tinggi */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />

              <Radar
                name={`#1 ${candidate1.channel_info.substring(0, 10)}`}
                dataKey="A"
                stroke="#2563eb"
                strokeWidth={2}
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Radar
                name={`#2 ${candidate2.channel_info.substring(0, 10)}`}
                dataKey="B"
                stroke="#ec4899"
                strokeWidth={2}
                fill="#f472b6"
                fillOpacity={0.4}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultCharts;
