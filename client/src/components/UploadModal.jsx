import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud, FileSpreadsheet, X, Download, FileText, Loader2 } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // --- FITUR UPLOAD ---
  const handleUpload = async () => {
    if (!file) return;

    const loadingToast = toast.loading("Sedang mengupload data...");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Database berhasil diperbarui!", { 
        id: loadingToast,
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      setFile(null);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        "Gagal upload file. Pastikan format CSV valid.";

      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-darkCard rounded-3xl shadow-2xl max-w-lg w-full p-8 transform transition-all scale-100 border border-slate-200 dark:border-slate-700">
        
        {/* Header Modal */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                <UploadCloud size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Upload Dataset</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update database influencer via CSV.</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tombol Download Template */}
        <div className="flex justify-end mb-4">
          <button
            onClick={downloadTemplate}
            className="text-xs flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold transition-colors bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full"
          >
            <Download size={14} /> Download Template CSV
          </button>
        </div>

        {/* Area Upload (Drag & Drop Look) */}
        <div className="relative group">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
             ${file 
               ? "border-green-500 bg-green-50 dark:bg-green-900/10" 
               : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 group-hover:border-brand-400"
             }
          `}>
            <div className="flex flex-col items-center justify-center space-y-3">
               <div className={`p-4 rounded-full ${file ? 'bg-green-100 text-green-600' : 'bg-white dark:bg-slate-700 text-slate-400 shadow-sm'}`}>
                  {file ? <FileText size={32} /> : <FileSpreadsheet size={32} />}
               </div>
               
               <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {file ? file.name : "Klik atau Drag file CSV ke sini"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Maksimal ukuran 5MB</p>
               </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-sm"
            disabled={uploading}
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-6 py-2.5 text-white font-bold rounded-full transition-all shadow-glow text-sm flex items-center gap-2
                ${
                  !file || uploading
                    ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none"
                    : "bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-95"
                }`}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Memproses...
              </>
            ) : (
              <>Upload & Update DB</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;