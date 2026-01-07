const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

// Konfigurasi Multer: Simpan di Memory Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST endpoint
router.post("/upload", upload.single("file"), uploadController.uploadCSV);

module.exports = router;
