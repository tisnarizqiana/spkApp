const express = require("express");
const router = express.Router();
const spkController = require("../controllers/spkController");

// Define Route
router.post("/recommendations", spkController.getRecommendations);

module.exports = router;
