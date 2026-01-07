const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Validasi sederhana
if (!url) {
  console.error("❌ ERROR: TURSO_DATABASE_URL tidak ditemukan di .env");
  process.exit(1);
}

const client = createClient({
  url: url,
  authToken: authToken,
});

module.exports = client;
