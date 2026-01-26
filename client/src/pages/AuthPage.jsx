import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Mail, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  Loader2,
  ChevronLeft,
  AlertCircle
} from "lucide-react";

const AuthPage = () => {
  const { login } = useContext(AuthContext);

  // Mode: login | register | forgot_request | forgot_verify
  // (Mode 'register_verify' DIHAPUS sesuai request)
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  
  // --- LOGIKA TOMBOL KABUR ---
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 }); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

  // Validasi Real-time
  useEffect(() => {
    const { username, email, password, otp } = formData;
    let isValid = false;
    let msg = "";

    const isGmail = email.toLowerCase().endsWith("@gmail.com");
    const isStrongPass = strongPasswordRegex.test(password);
    const isFilled = (str) => str.trim().length > 0;

    // --- LOGIC VALIDASI ---
    if (mode === "login") {
      if (!isFilled(email)) msg = "Email wajib diisi!";
      else if (!isGmail) msg = "Login wajib pakai akun @gmail.com!";
      else if (!isFilled(password)) msg = "Password belum diisi!";
      else isValid = true;
    } 
    else if (mode === "register") {
      if (!isFilled(username)) msg = "Username wajib diisi!";
      else if (!isFilled(email)) msg = "Email wajib diisi!";
      else if (!isGmail) msg = "Wajib daftar pakai @gmail.com asli!";
      else if (!isFilled(password)) msg = "Password belum diisi!";
      else if (!isStrongPass) msg = "Password lemah! Kombinasi Huruf, Angka & Simbol.";
      else isValid = true;
    }
    // Logic Forgot Password (Tetap pakai OTP)
    else if (mode === "forgot_request") {
      if (!isGmail) msg = "Masukkan email valid!";
      else isValid = true;
    } 
    else if (mode === "forgot_verify") {
      if (otp.length !== 6) msg = "OTP harus 6 digit!";
      else if (!isStrongPass) msg = "Password baru kurang kuat!";
      else isValid = true;
    }

    setValidationMsg(msg);
    setIsFormValid(isValid);
    
    // Reset posisi tombol jika sudah valid
    if (isValid) setBtnPos({ x: 0, y: 0 });

  }, [formData, mode]);

  // --- FUNGSI KABUR (SUPPORT MOBILE & DESKTOP) ---
  const moveButton = () => {
    if (!isFormValid && !loading) {
      // Jarak loncat (sedikit dikurangi biar gak keluar layar HP)
      const x = Math.random() < 0.5 ? -Math.random() * 100 : Math.random() * 100;
      const y = Math.random() < 0.5 ? -Math.random() * 60 : Math.random() * 60;
      
      setBtnPos({ x, y });
      
      toast.error(validationMsg || "Lengkapi form dulu!", { 
        id: "validation-toast", 
        duration: 1500, 
        icon: '🚫',
        style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' }
      });
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return; 

    setLoading(true);

    try {
      // 1. LOGIN
      if (mode === "login") {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        login(res.data.user, res.data.token);
        toast.success("Login Berhasil! 🚀");
      } 
      // 2. REGISTER (KEMBALI KE METODE TANPA VERIFIKASI EMAIL)
      else if (mode === "register") {
        await axios.post("http://localhost:3000/api/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Registrasi Berhasil! Silakan Login.", { icon: '🎉' });
        // Langsung lempar ke login, ga perlu verify email dulu
        setMode("login"); 
        setFormData({ ...formData, password: "" }); // Clear password biar aman
      } 
      // 3. FORGOT PASSWORD FLOW (Tetap butuh OTP untuk keamanan reset)
      else if (mode === "forgot_request") {
        await axios.post("http://localhost:3000/api/auth/forgot-password", {
          email: formData.email,
        });
        toast.success("OTP dikirim ke Inbox/Spam!");
        setMode("forgot_verify");
      } else if (mode === "forgot_verify") {
        await axios.post("http://localhost:3000/api/auth/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password,
        });
        toast.success("Password Berhasil Direset!");
        setMode("login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal memproses permintaan");
    } finally {
      setLoading(false);
    }
  };

  const getHeader = () => {
    if (mode === "login") return { title: "Welcome Back", subtitle: "Login dengan akun Gmail Anda." };
    if (mode === "register") return { title: "Create Account", subtitle: "Daftar Akun Baru." };
    if (mode === "forgot_request") return { title: "Reset Password", subtitle: "Kami akan kirim OTP ke email." };
    if (mode === "forgot_verify") return { title: "Password Baru", subtitle: "Masukkan OTP & Password baru." };
  };

  const headerInfo = getHeader();

  const switchMode = (newMode) => {
    setMode(newMode);
    setBtnPos({x:0, y:0});
    setFormData({ username: "", email: "", password: "", otp: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] transition-colors duration-500 p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white dark:bg-[#0F172A] p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 w-full max-w-md border border-slate-100 dark:border-slate-800 relative z-10 animate-fade-in-up">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-brand-500/30">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic text-slate-900 dark:text-white leading-none">
                IM<span className="text-brand-500">MATCH</span>
              </h1>
            </div>
          </div>
        </div>

        {/* HEADER TEXT */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{headerInfo.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm truncate px-4">{headerInfo.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* USERNAME (Register Only) */}
          {mode === "register" && (
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all font-medium text-sm"
                required
              />
            </div>
          )}

          {/* EMAIL */}
          {mode !== "forgot_verify" && (
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="nama@gmail.com"
                onChange={handleChange}
                value={formData.email}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all font-medium text-sm"
                required
              />
            </div>
          )}

          {/* PASSWORD */}
          {(mode === "login" || mode === "register" || mode === "forgot_verify") && (
            <div className="space-y-1">
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder={mode === "forgot_verify" ? "Password Baru" : "Password"}
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none transition-all font-medium text-sm"
                  required
                />
              </div>
              {/* Hint Password */}
              {(mode === "register" || mode === "forgot_verify") && (
                <div className="flex items-center gap-1 pl-2 text-[10px] text-slate-400">
                  <AlertCircle size={10} />
                  <span>Wajib: Huruf + Angka + Simbol (Unik)</span>
                </div>
              )}
            </div>
          )}

          {/* OTP INPUT (Hanya Forgot Verify) */}
          {mode === "forgot_verify" && (
            <div className="relative group animate-in slide-in-from-bottom-2">
              <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" />
              <input
                type="text"
                name="otp"
                placeholder="KODE 6 DIGIT"
                onChange={handleChange}
                value={formData.otp}
                className="w-full pl-11 pr-4 py-3.5 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl text-brand-700 dark:text-brand-400 focus:ring-2 focus:ring-brand-500/50 outline-none transition-all font-bold text-center tracking-[0.5em] text-lg"
                required
                maxLength="6"
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="relative h-14 w-full pt-2"> 
            <button
              type="submit"
              // Desktop: Pakai onMouseEnter
              onMouseEnter={moveButton} 
              // Mobile: Pakai onTouchStart agar pas disentuh langsung kabur
              onTouchStart={moveButton} 
              
              style={{
                transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)" 
              }}
              disabled={loading}
              className={`w-full py-4 rounded-full font-bold text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 select-none
                ${loading 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : !isFormValid 
                    ? "bg-red-500 cursor-not-allowed opacity-80" 
                    : "bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:scale-95 transition-all"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Memproses...
                </>
              ) : (
                <>
                  {mode === "login" && "Masuk Dashboard"}
                  {mode === "register" && "Daftar Akun"}
                  {mode === "forgot_request" && "Kirim Kode OTP"}
                  {mode === "forgot_verify" && "Reset Password"}
                  {!loading && <ArrowRight size={20} />}
                </>
              )}
            </button>
          </div>
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-8 text-center space-y-3">
          {mode === "login" ? (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Belum punya akun?{" "}
                <button
                  onClick={() => switchMode("register")}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline transition-colors"
                >
                  Daftar Sekarang
                </button>
              </p>
              <button
                onClick={() => switchMode("forgot_request")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Lupa Password?
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => switchMode("login")}
                className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={16} /> Kembali ke Login
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 text-center w-full pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
          © 2026 InfluencerMatch DSS
        </p>
      </div>

    </div>
  );
};

export default AuthPage;