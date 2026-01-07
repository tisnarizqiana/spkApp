const client = require("../config/db");

const getStats = async (req, res) => {
  try {
    // 1. Total Kandidat
    const totalQuery = await client.execute(
      "SELECT COUNT(*) as total FROM candidates"
    );
    const total = totalQuery.rows[0].total;

    if (total === 0) {
      return res.json({
        total: 0,
        avg_eng: 0,
        top_country: "-",
        max_follower: 0,
      });
    }

    // 2. Rata-rata Engagement Rate
    const avgQuery = await client.execute(
      "SELECT AVG(eng_rate) as avg_eng FROM candidates"
    );
    const avgEng = avgQuery.rows[0].avg_eng;

    // 3. Top Country (Negara terbanyak)
    const countryQuery = await client.execute(`
      SELECT country, COUNT(*) as count 
      FROM candidates 
      WHERE country IS NOT NULL AND country != 'Unknown' 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 1
    `);
    const topCountry =
      countryQuery.rows.length > 0 ? countryQuery.rows[0].country : "Unknown";

    // 4. Max Followers (Influencer Terbesar)
    const maxQuery = await client.execute(
      "SELECT MAX(followers) as max_f FROM candidates"
    );
    const maxFollower = maxQuery.rows[0].max_f;

    res.json({
      total,
      avg_eng: avgEng,
      top_country: topCountry,
      max_follower: maxFollower,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Gagal mengambil statistik" });
  }
};

module.exports = { getStats };
