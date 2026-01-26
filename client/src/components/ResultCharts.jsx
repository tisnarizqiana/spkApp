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
import { BarChart2, Swords } from "lucide-react";

const ResultCharts = ({ data }) => {
  // 1. Cek Data Masuk
  if (!data || data.length === 0) {
    console.log("Chart: Data Kosong");
    return null;
  }

  // 2. HELPER: Konversi "1.5m" / "300k" / "95" (String) jadi Angka Murni
  const parseNumber = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    
    // Bersihkan string
    let str = val.toString().toLowerCase().replace(/,/g, ""); 
    
    // Konversi suffix
    if (str.includes("b")) return parseFloat(str) * 1000000000;
    if (str.includes("m")) return parseFloat(str) * 1000000;
    if (str.includes("k")) return parseFloat(str) * 1000;
    
    return parseFloat(str) || 0;
  };

  // 3. OLAH DATA UNTUK BAR CHART
  const top5 = data.slice(0, 5).map((item) => {
    // Pastikan calculation ada, kalau tidak pakai default {}
    const calc = item.calculation || {};
    
    return {
      name: item.channel_info.length > 8 ? item.channel_info.substring(0, 8) + ".." : item.channel_info,
      full_name: item.channel_info,
      // Pakai parseFloat biar aman
      Score: parseFloat(calc.final_score) || 0,
      Core: parseFloat(calc.NCF || calc.ncf) || 0, // Cek huruf besar/kecil
      Secondary: parseFloat(calc.NSF || calc.nsf) || 0,
    };
  });

  // 4. OLAH DATA UNTUK RADAR CHART
  const top10 = data.slice(0, 10);
  
  // Hitung Max Value (Pakai parseNumber biar suffix m/k/b terhitung)
  const maxFollowers = Math.max(...top10.map((d) => parseNumber(d.followers))) || 1;
  const maxEng = Math.max(...top10.map((d) => parseNumber(d.eng_rate))) || 1;
  const maxLikes = Math.max(...top10.map((d) => parseNumber(d.avg_likes))) || 1;
  const maxPosts = Math.max(...top10.map((d) => parseNumber(d.posts))) || 1;
  const maxScore = Math.max(...top10.map((d) => parseNumber(d.influence_score))) || 1;

  const c1 = data[0];
  const c2 = data[1] || data[0];

  const radarData = [
    { 
      subject: "Followers", 
      A: (parseNumber(c1.followers) / maxFollowers) * 100, 
      B: (parseNumber(c2.followers) / maxFollowers) * 100 
    },
    { 
      subject: "Engagement", 
      A: (parseNumber(c1.eng_rate) / maxEng) * 100, 
      B: (parseNumber(c2.eng_rate) / maxEng) * 100 
    },
    { 
      subject: "Avg Likes", 
      A: (parseNumber(c1.avg_likes) / maxLikes) * 100, 
      B: (parseNumber(c2.avg_likes) / maxLikes) * 100 
    },
    { 
      subject: "Activity", 
      A: (parseNumber(c1.posts) / maxPosts) * 100, 
      B: (parseNumber(c2.posts) / maxPosts) * 100 
    },
    { 
      subject: "Score", 
      A: (parseNumber(c1.influence_score) / maxScore) * 100, 
      B: (parseNumber(c2.influence_score) / maxScore) * 100 
    },
  ];

  // Tooltip Custom
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs z-50">
          <p className="font-bold mb-2 text-slate-300 border-b border-slate-700 pb-1">
            {payload[0].payload.full_name || label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="capitalize text-slate-400">{entry.name}</span>
              </div>
              <span className="font-bold">{parseFloat(entry.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* --- CHART 1: BAR CHART --- */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-slate-200 dark:border-darkBorder shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brand-50 dark:bg-brand-900/20 p-2.5 rounded-2xl text-brand-600 dark:text-brand-400">
            <BarChart2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Score Composition</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Core Factor vs Secondary Factor</p>
          </div>
        </div>

        {/* PENTING: Gunakan min-height agar container tidak 0px */}
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={top5} 
              barSize={24}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradCore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
                </linearGradient>
                <linearGradient id="gradSec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.9}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />

              <Bar 
                dataKey="Core" 
                stackId="stack1" 
                fill="url(#gradCore)" 
                radius={[0, 0, 12, 12]} 
                name="Core Factor"
              />
              <Bar 
                dataKey="Secondary" 
                stackId="stack1" 
                fill="url(#gradSec)" 
                radius={[12, 12, 0, 0]} 
                name="Secondary Factor"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CHART 2: RADAR CHART --- */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-4xl border border-slate-200 dark:border-darkBorder shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-pink-50 dark:bg-pink-900/20 p-2.5 rounded-2xl text-pink-600 dark:text-pink-400">
            <Swords size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Head-to-Head</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              #{c1.rank} {c1.channel_info.substring(0,8)}.. vs #{c2.rank} {c2.channel_info.substring(0,8)}..
            </p>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar 
                name={c1.channel_info} 
                dataKey="A" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fill="#3b82f6" 
                fillOpacity={0.2} 
              />
              <Radar 
                name={c2.channel_info} 
                dataKey="B" 
                stroke="#ec4899" 
                strokeWidth={3} 
                fill="#ec4899" 
                fillOpacity={0.2} 
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ResultCharts;