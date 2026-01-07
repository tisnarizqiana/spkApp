const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Ambil token dari header: "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses Ditolak! Silakan Login terlebih dahulu." });
  }

  try {
    const secret = process.env.JWT_SECRET || "rahasia_negara_api_2024"; // Default key
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Simpan data user di request
    next(); // Lanjut ke controller
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token Kadaluarsa atau Tidak Valid." });
  }
};

module.exports = verifyToken;
