const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const client = require("./config/db");

// Import Routes
const spkRoutes = require("./routes/spkRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require("./routes/authRoutes");

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Agar Frontend bisa akses
app.use(express.json()); // Agar bisa baca Body JSON

// --- ROUTES ---

// 1. Health Check (Cek Server Hidup/Mati)
app.get("/", (req, res) => {
  res.json({
    message: "InfluencerMatch DSS API is Running 🚀",
    status: "OK",
    timestamp: new Date(),
  });
});

// 2. Register API Routes (PREFIX: /api)
// Ini artinya semua route di dalam file tersebut akan diawali /api
app.use("/api", spkRoutes); // Menangani /api/recommendations
app.use("/api", uploadRoutes); // Menangani /api/upload
app.use("/api", statsRoutes);
app.use("/api/auth", authRoutes);

// 3. Test Database Connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await client.execute("SELECT 1 as val");
    res.json({
      message: "Database connection successful ✅",
      result: result.rows[0],
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({
      message: "Database connection failed ❌",
      error: error.message,
    });
  }
});

// Start Server
// PENYESUAIAN VERCEL: Jalankan app.listen hanya jika BUKAN production (Local Development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

// PENYESUAIAN VERCEL: Export app agar bisa dijalankan sebagai Serverless Function
module.exports = app;
