import React from "react";
import { Sliders, Search, Loader2 } from "lucide-react";

const InputForm = ({ criteria, setCriteria, handleSearch, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  return (
    // Container disesuaikan: Background putih/gelap, border halus, tanpa shadow tebal (flat design)
    <div className="bg-white dark:bg-darkCard p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Header dengan Icon Lucide & Garis bawah halus */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Sliders className="text-brand-500" size={20} />
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Kriteria Seleksi
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Atur prioritas bobot (1-5)
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-5">
        
        {/* Helper function untuk render Select agar kodingan lebih rapi */}
        <SelectGroup 
          label="Target Followers" 
          name="target_followers" 
          value={criteria.target_followers} 
          onChange={handleChange}
          options={[
            { val: 5, label: "5 - Sangat Tinggi (>10M)" },
            { val: 4, label: "4 - Tinggi (>5M)" },
            { val: 3, label: "3 - Sedang (>1M)" },
            { val: 2, label: "2 - Rendah (>500k)" },
            { val: 1, label: "1 - Mikro" }
          ]}
        />

        <SelectGroup 
          label="Engagement Rate" 
          name="target_eng_rate" 
          value={criteria.target_eng_rate} 
          onChange={handleChange}
          options={[
            { val: 5, label: "5 - Sangat Aktif (>5%)" },
            { val: 4, label: "4 - Aktif (>3%)" },
            { val: 3, label: "3 - Cukup (>1.5%)" },
            { val: 2, label: "2 - Kurang" }
          ]}
        />

        <SelectGroup 
          label="Influence Score" 
          name="target_influence_score" 
          value={criteria.target_influence_score} 
          onChange={handleChange}
          options={[
            { val: 5, label: "5 - Excellent (90+)" },
            { val: 4, label: "4 - Very Good (85+)" },
            { val: 3, label: "3 - Good (80+)" }
          ]}
        />

        <SelectGroup 
          label="Avg Likes" 
          name="target_avg_likes" 
          value={criteria.target_avg_likes} 
          onChange={handleChange}
          options={[
            { val: 5, label: "5 - Viral (>1M)" },
            { val: 4, label: "4 - Trending (>500k)" },
            { val: 3, label: "3 - Populer (>100k)" }
          ]}
        />

        {/* Tombol Action: Pill Shape & Brand Color */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-bold text-sm text-white shadow-glow transition-all active:scale-95
              ${
                loading
                  ? "bg-slate-400 cursor-not-allowed opacity-70"
                  : "bg-brand-600 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Analisis Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-komponen agar kode utama lebih bersih & styling konsisten
const SelectGroup = ({ label, name, value, onChange, options }) => (
  <div className="group">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-brand-500 transition-colors">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {options.map((opt) => (
          <option key={opt.val} value={opt.val}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom Arrow Icon (Optional styling trick) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
);

export default InputForm;