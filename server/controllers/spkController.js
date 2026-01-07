const client = require("../config/db");

// --- HELPER 1: Konversi Nilai Raw ke Skala 1-5 ---
const getScaleValue = (value, attribute) => {
  const val = Number(value) || 0;

  switch (attribute) {
    case "followers":
      if (val >= 10000000) return 5;
      if (val >= 5000000) return 4;
      if (val >= 1000000) return 3;
      if (val >= 500000) return 2;
      return 1;

    case "eng_rate":
      if (val >= 0.05) return 5;
      if (val >= 0.03) return 4;
      if (val >= 0.015) return 3;
      if (val >= 0.005) return 2;
      return 1;

    case "influence_score":
      if (val >= 90) return 5;
      if (val >= 85) return 4;
      if (val >= 80) return 3;
      if (val >= 70) return 2;
      return 1;

    case "avg_likes":
      if (val >= 1000000) return 5;
      if (val >= 500000) return 4;
      if (val >= 100000) return 3;
      if (val >= 50000) return 2;
      return 1;

    case "posts":
      if (val >= 2000) return 5;
      if (val >= 1000) return 4;
      if (val >= 500) return 3;
      if (val >= 100) return 2;
      return 1;

    default:
      return 1;
  }
};

// --- HELPER 2: Mendapatkan Bobot dari Gap ---
const getWeightFromGap = (gap, gapMappingList) => {
  const mapping = gapMappingList.find((m) => Math.abs(m.gap - gap) < 0.1);
  return mapping ? mapping.weight : 1;
};

// --- CONTROLLER UTAMA ---
const getRecommendations = async (req, res) => {
  try {
    console.log("🧠 Memulai Algoritma Profile Matching...");

    const {
      target_followers = 5,
      target_eng_rate = 5,
      target_influence_score = 5,
      target_avg_likes = 4,
      target_posts = 3,
    } = req.body;

    const [candidatesResult, gapMappingResult] = await Promise.all([
      client.execute("SELECT * FROM candidates"),
      client.execute("SELECT * FROM gap_mapping"),
    ]);

    const candidates = candidatesResult.rows;
    const gapMappings = gapMappingResult.rows;

    if (candidates.length === 0)
      return res.status(404).json({ message: "Data candidates kosong!" });

    const processedData = candidates.map((candidate) => {
      const criteriaList = [
        {
          code: "eng_rate",
          val: candidate.eng_rate,
          target: target_eng_rate,
          type: "Core",
        },
        {
          code: "influence_score",
          val: candidate.influence_score,
          target: target_influence_score,
          type: "Core",
        },
        {
          code: "avg_likes",
          val: candidate.avg_likes,
          target: target_avg_likes,
          type: "Core",
        },
        {
          code: "followers",
          val: candidate.followers,
          target: target_followers,
          type: "Secondary",
        },
        {
          code: "posts",
          val: candidate.posts,
          target: target_posts,
          type: "Secondary",
        },
      ];

      let coreTotalWeight = 0;
      let coreCount = 0;
      let secondaryTotalWeight = 0;
      let secondaryCount = 0;
      let details = {};

      criteriaList.forEach((c) => {
        const scaleVal = getScaleValue(c.val, c.code);
        const gap = scaleVal - c.target;
        const weight = getWeightFromGap(gap, gapMappings);

        details[c.code] = {
          raw: c.val,
          scale: scaleVal,
          target: c.target,
          gap: gap,
          weight: weight,
        };

        if (c.type === "Core") {
          coreTotalWeight += weight;
          coreCount++;
        } else {
          secondaryTotalWeight += weight;
          secondaryCount++;
        }
      });

      const NCF = coreCount > 0 ? coreTotalWeight / coreCount : 0;
      const NSF =
        secondaryCount > 0 ? secondaryTotalWeight / secondaryCount : 0;
      const totalScore = 0.6 * NCF + 0.4 * NSF;

      return {
        ...candidate,
        calculation: {
          details,
          NCF: parseFloat(NCF.toFixed(2)),
          NSF: parseFloat(NSF.toFixed(2)),
          final_score: parseFloat(totalScore.toFixed(3)),
        },
      };
    });

    processedData.sort(
      (a, b) => b.calculation.final_score - a.calculation.final_score
    );
    const topRecommendations = processedData.slice(0, 20);

    res.json({
      status: "success",
      meta: { total_analyzed: candidates.length },
      data: topRecommendations,
    });
  } catch (error) {
    console.error("❌ Error SPK Calculation:", error);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan perhitungan server.",
        error: error.message,
      });
  }
};

module.exports = { getRecommendations };
