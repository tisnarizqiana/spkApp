const client = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import Nodemailer

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara_api_2024";

// --- KONFIGURASI EMAIL PENGIRIM (GMAIL) ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- REGISTER ---
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const check = await client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    if (check.rows.length > 0)
      return res.status(400).json({ message: "Email sudah terdaftar!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await client.execute({
      sql: "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      args: [username, email, hashedPassword],
    });

    res.status(201).json({ message: "Registrasi Berhasil! Silakan Login." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- LOGIN ---
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = await client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    if (userQuery.rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan." });

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah!" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login Sukses",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- CHANGE PASSWORD (LOGGED IN) ---
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const userQuery = await client.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [userId],
    });
    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password Lama Salah!" });

    const salt = await bcrypt.genSalt(10);
    const hashedNew = await bcrypt.hash(newPassword, salt);

    await client.execute({
      sql: "UPDATE users SET password = ? WHERE id = ?",
      args: [hashedNew, userId],
    });

    res.json({ message: "Password berhasil diubah!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal ubah password" });
  }
};

// --- 1. REQUEST OTP (KIRIM EMAIL) ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Cek user ada
    const userQuery = await client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    if (userQuery.rows.length === 0)
      return res.status(404).json({ message: "Email tidak terdaftar." });

    // Generate OTP 6 Digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set Expiry 15 menit dari sekarang
    // Format tanggal untuk SQL (YYYY-MM-DD HH:MM:SS)
    const expiryDate = new Date(Date.now() + 15 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Simpan OTP ke DB
    await client.execute({
      sql: "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      args: [otp, expiryDate, email],
    });

    // Kirim Email via Nodemailer
    const mailOptions = {
      from: '"InfluencerMatch Support" <no-reply@influencermatch.com>',
      to: email,
      subject: "Reset Password - Kode OTP",
      html: `
            <h3>Permintaan Reset Password</h3>
            <p>Anda meminta untuk mereset password akun InfluencerMatch.</p>
            <p>Gunakan kode OTP berikut:</p>
            <h1 style="color:blue; letter-spacing: 5px;">${otp}</h1>
            <p>Kode ini berlaku selama 15 menit.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Kode OTP telah dikirim ke email Anda!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal mengirim email", error: error.message });
  }
};

// --- 2. VERIFIKASI OTP & UBAH PASS ---
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Cari user dengan email DAN token yang cocok
    const userQuery = await client.execute({
      sql: "SELECT * FROM users WHERE email = ? AND reset_token = ?",
      args: [email, otp],
    });

    if (userQuery.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Kode OTP Salah atau Email tidak valid!" });
    }

    const user = userQuery.rows[0];
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Cek Kadaluarsa (String comparison works for ISO dates)
    if (now > user.reset_token_expiry) {
      return res
        .status(400)
        .json({ message: "Kode OTP sudah kadaluarsa. Minta kode baru." });
    }

    // Hash Password Baru
    const salt = await bcrypt.genSalt(10);
    const hashedNew = await bcrypt.hash(newPassword, salt);

    // Update Password & Hapus OTP (biar gak dipake 2x)
    await client.execute({
      sql: "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
      args: [hashedNew, email],
    });

    res.json({ message: "Password berhasil direset! Silakan Login." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal reset password" });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
