import React from "react";

const InputForm = ({ criteria, setCriteria, handleSearch, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          🎛️ Kriteria Pencarian
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tentukan prioritas target influencer Anda (Skala 1-5).
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Grid Layout untuk Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Target Followers
            </label>
            <select
              name="target_followers"
              value={criteria.target_followers}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="5">5 - Sangat Tinggi (lebih dari 10M)</option>
              <option value="4">4 - Tinggi (lebih dari 5M)</option>
              <option value="3">3 - Sedang (lebih dari 1M)</option>
              <option value="2">2 - Rendah (lebih dari 500k)</option>
              <option value="1">1 - Mikro</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Target Engagement Rate
            </label>
            <select
              name="target_eng_rate"
              value={criteria.target_eng_rate}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="5">5 - Sangat Aktif (lebih dari 5%)</option>
              <option value="4">4 - Aktif (lebih dari 3%)</option>
              <option value="3">3 - Cukup (lebih dari 1.5%)</option>
              <option value="2">2 - Kurang</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Target Influence Score
            </label>
            <select
              name="target_influence_score"
              value={criteria.target_influence_score}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="5">5 - Excellent (90+)</option>
              <option value="4">4 - Very Good (85+)</option>
              <option value="3">3 - Good (80+)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Target Avg Likes
            </label>
            <select
              name="target_avg_likes"
              value={criteria.target_avg_likes}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="5">5 - Viral (lebih dari 1M)</option>
              <option value="4">4 - Trending (lebih dari 500k)</option>
              <option value="3">3 - Populer (lebih dari 100k)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all 
            ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses Algoritma...
            </span>
          ) : (
            "🚀 Analisis Rekomendasi"
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
