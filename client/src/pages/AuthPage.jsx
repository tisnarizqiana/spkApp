import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {
  const { login } = useContext(AuthContext);

  // Mode: login | register | forgot_request (input email) | forgot_verify (input otp)
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        login(res.data.user, res.data.token);
        toast.success("Login Berhasil! 🚀");
      } else if (mode === "register") {
        await axios.post("http://localhost:3000/api/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Registrasi Sukses! Silakan Login.");
        setMode("login");
      } else if (mode === "forgot_request") {
        // Step 1: Minta OTP
        await axios.post("http://localhost:3000/api/auth/forgot-password", {
          email: formData.email,
        });
        toast.success("Kode OTP dikirim ke email Anda! Cek Inbox/Spam.");
        setMode("forgot_verify"); // Pindah ke step input OTP
      } else if (mode === "forgot_verify") {
        // Step 2: Verifikasi OTP & Ganti Password
        await axios.post("http://localhost:3000/api/auth/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password,
        });
        toast.success("Password Berhasil Direset! Silakan Login.");
        setMode("login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">
            InfluencerMatch
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {mode === "login" && "Masuk untuk mengelola data"}
            {mode === "register" && "Daftar akun baru"}
            {mode === "forgot_request" && "Masukkan email untuk reset password"}
            {mode === "forgot_verify" && "Masukkan Kode OTP dari Email"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME (Hanya Register) */}
          {mode === "register" && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          )}

          {/* EMAIL (Semua Mode kecuali verify yang sudah otomatis simpan email di state) */}
          <div className={mode === "forgot_verify" ? "hidden" : "block"}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required={mode !== "forgot_verify"}
            />
          </div>

          {/* PASSWORD (Login, Register, Verify) */}
          {mode !== "forgot_request" && (
            <input
              type="password"
              name="password"
              placeholder={
                mode === "forgot_verify" ? "Password Baru" : "Password"
              }
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          )}

          {/* OTP (Hanya Verify) */}
          {mode === "forgot_verify" && (
            <input
              type="text"
              name="otp"
              placeholder="Masukan 6 Digit OTP"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-yellow-50 focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-center tracking-widest text-lg"
              required
              maxLength="6"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Memproses..."
              : mode === "login"
              ? "Masuk Sekarang"
              : mode === "register"
              ? "Daftar Sekarang"
              : mode === "forgot_request"
              ? "Kirim Kode OTP"
              : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 space-y-2">
          {mode === "login" ? (
            <>
              <p>
                Belum punya akun?{" "}
                <span
                  onClick={() => setMode("register")}
                  className="text-blue-600 font-bold cursor-pointer hover:underline"
                >
                  Daftar
                </span>
              </p>
              <p
                onClick={() => setMode("forgot_request")}
                className="text-slate-400 cursor-pointer hover:text-slate-600"
              >
                Lupa Password?
              </p>
            </>
          ) : mode === "forgot_verify" ? (
            <p
              onClick={() => setMode("forgot_request")}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              Kirim Ulang OTP
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <span
                onClick={() => setMode("login")}
                className="text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
