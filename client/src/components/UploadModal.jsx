import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Import Toast Notification

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Jika modal tertutup, jangan render apa-apa
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // --- FITUR DOWNLOAD TEMPLATE ---
  const downloadTemplate = () => {
    const headers =
      "rank,channel_info,followers,eng_rate,avg_likes,posts,influence_score,country";
    const row1 = "1,demo_influencer,1.5m,2.5%,50k,150,85,Indonesia";
    const row2 = "2,contoh_user_lain,500k,1.2%,10k,500,70,Malaysia";

    const csvContent = `${headers}\n${row1}\n${row2}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_influencer_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // --- FITUR UPLOAD DENGAN TOAST ---
  const handleUpload = async () => {
    if (!file) return;

    // 1. Tampilkan Loading Toast
    const loadingToast = toast.loading("Sedang mengupload data...");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 2. Request ke Backend
      await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3. Sukses: Update Toast jadi Hijau
      toast.success("Database berhasil diperbarui!", { id: loadingToast });
      setFile(null);

      // Tunggu 1 detik agar user lihat notifikasi sukses, baru tutup modal
      setTimeout(() => {
        onSuccess(); // Refresh data di parent
        onClose(); // Tutup modal
      }, 1000);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        "Gagal upload file. Pastikan format CSV valid.";

      // 4. Gagal: Update Toast jadi Merah
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xl font-bold text-slate-800">
            📂 Upload Dataset
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Update database influencer dengan file CSV baru.
        </p>

        {/* Tombol Download Template */}
        <div className="flex justify-end mb-2">
          <button
            onClick={downloadTemplate}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            title="Unduh contoh format file CSV"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Download Template CSV
          </button>
        </div>

        {/* Area Upload (Drag & Drop Look) */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative group">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="space-y-2">
            <div className="text-4xl">📄</div>
            <div className="text-sm font-medium text-slate-600">
              {file ? file.name : "Klik atau Drag file CSV ke sini"}
            </div>
            <p className="text-xs text-slate-400">Maksimal ukuran 5MB</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            disabled={uploading}
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 text-white font-medium rounded-lg transition-all shadow-md flex items-center gap-2
                ${
                  !file || uploading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Memproses...
              </>
            ) : (
              "Upload & Update DB"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
