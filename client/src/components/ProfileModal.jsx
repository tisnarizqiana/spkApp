import React from "react";

const ProfileModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Helper: Buka Link Sosmed
  const openSocial = (platform) => {
    // Bersihkan username dari karakter aneh
    const username = data.channel_info.replace(/[^a-zA-Z0-9_.]/g, "");
    let url = "";

    if (platform === "instagram") url = `https://www.instagram.com/${username}`;
    if (platform === "tiktok") url = `https://www.tiktok.com/@${username}`;

    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
        {/* HEADER: Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
          >
            ✕
          </button>
        </div>

        {/* BODY: Profile Info */}
        <div className="px-8 pb-8 relative">
          {/* Avatar (Inisial) */}
          <div className="-mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg mx-auto md:mx-0">
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400 uppercase">
                {data.channel_info.substring(0, 2)}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Kiri: Identitas */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">
                @{data.channel_info}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <span>📍 {data.country || "Global"}</span>
                <span>•</span>
                <span>Rank #{data.rank || "-"}</span>
              </div>

              {/* Tombol Sosmed */}
              <div className="flex gap-3">
                <button
                  onClick={() => openSocial("instagram")}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </button>
                <button
                  onClick={() => openSocial("tiktok")}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.03 5.91-.05 8.81-.47 9.91-17.74 11.81-17.74-1.38 0-7.18 10.37-8.18 10.37-8.18V7.2c-2.29.35-4.43 1.48-5.69 3.53-1.73 2.89-.9 7.33 1.95 9.47 3.32 2.49 8.1 1.6 10.27-2.05.52-.87.89-1.83.98-2.84-.15-5.3.1-10.46.03-15.29z" />
                  </svg>
                  TikTok
                </button>
              </div>
            </div>

            {/* Kanan: Skor Besar */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center min-w-[150px]">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Final Score
              </div>
              <div className="text-5xl font-extrabold text-blue-600 my-2">
                {data.calculation.final_score}
              </div>
              <div className="text-xs text-slate-400">Scale 0.0 - 5.0</div>
            </div>
          </div>

          {/* Grid Statistik */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 font-bold uppercase">
                Followers
              </div>
              <div className="text-lg font-bold text-slate-800">
                {data.followers > 1000000
                  ? (data.followers / 1000000).toFixed(1) + "M"
                  : data.followers}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 font-bold uppercase">
                Engagement
              </div>
              <div className="text-lg font-bold text-slate-800">
                {(data.eng_rate * 100).toFixed(2)}%
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 font-bold uppercase">
                Avg Likes
              </div>
              <div className="text-lg font-bold text-slate-800">
                {data.avg_likes > 1000000
                  ? (data.avg_likes / 1000000).toFixed(1) + "M"
                  : (data.avg_likes / 1000).toFixed(1) + "K"}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 font-bold uppercase">
                Total Posts
              </div>
              <div className="text-lg font-bold text-slate-800">
                {data.posts}
              </div>
            </div>
          </div>

          {/* Analisa Cepat (Mockup Logic) */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h4 className="font-bold text-slate-800 mb-2">💡 Quick Insight</h4>
            <p className="text-sm text-slate-600">
              Influencer ini memiliki skor{" "}
              <strong>Core Factor (Kualitas) {data.calculation.NCF}</strong> dan{" "}
              <strong>
                Secondary Factor (Popularitas) {data.calculation.NSF}
              </strong>
              .
              {data.calculation.NCF > data.calculation.NSF
                ? " Sangat direkomendasikan untuk campaign yang butuh interaksi tinggi (Engagement)."
                : " Sangat cocok untuk campaign Awareness (Jangkauan Luas) karena followers masif."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
