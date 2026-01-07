const csv = require("csv-parser");
const { Readable } = require("stream");
const client = require("../config/db");

// --- Helper: Parse Metric (Ubah "13.8M" -> 13800000) ---
const parseMetric = (value) => {
  if (!value) return 0;
  let str = String(value).toLowerCase().trim();
  if (str === "" || str === "nan" || str === "n/a") return 0;

  if (str.includes("%")) {
    const cleanStr = str.replace("%", "");
    const num = parseFloat(cleanStr);
    return isFinite(num) ? num / 100 : 0;
  }

  let multiplier = 1;
  if (str.endsWith("k")) multiplier = 1000;
  else if (str.endsWith("m")) multiplier = 1000000;
  else if (str.endsWith("b")) multiplier = 1000000000;

  str = str.replace(/[kmb]/g, "");
  const num = parseFloat(str);
  return isFinite(num) ? num * multiplier : 0;
};

// --- Helper: Cari data dari berbagai variasi nama kolom ---
const getColumnData = (row, possibleKeys) => {
  const rowKeys = Object.keys(row);
  for (let key of possibleKeys) {
    // Cari exact match atau case-insensitive match
    const foundKey = rowKeys.find((k) => k.toLowerCase() === key.toLowerCase());
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== "") {
      return row[foundKey];
    }
  }
  return null;
};

// --- Main Controller ---
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File CSV tidak ditemukan!" });
    }

    console.log("📂 Menerima file CSV...");
    const candidates = [];

    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csv())
      .on("data", (data) => {
        // --- UNIVERSAL MAPPING (Instagram & TikTok) ---

        // 1. Channel Info (Cover: IG Lama, IG Baru, TikTok)
        const channelInfo = getColumnData(data, [
          "Tiktoker name",
          "Tiktok name", // TikTok
          "Name",
          "username",
          "channel_info",
          "Channel Info", // Instagram
        ]);

        // 2. Followers (Cover: Followers, Subscribers)
        const followersRaw = getColumnData(data, [
          "Subscribers",
          "Followers",
          "followers",
        ]);
        const followers = parseMetric(followersRaw);

        // 3. Avg Likes
        const avgLikesRaw = getColumnData(data, [
          "Likes avg.",
          "Avg. Likes",
          "avg_likes",
          "Engagement Avg.",
        ]);
        const avgLikes = parseMetric(avgLikesRaw);

        // 4. Hitung Engagement Rate
        // TikTok punya data Comments & Shares, kita masukkan biar akurat
        const avgComments = parseMetric(
          getColumnData(data, ["Comments avg.", "Comments"])
        );
        const avgShares = parseMetric(
          getColumnData(data, ["Shares avg.", "Shares"])
        );

        let engRateRaw = getColumnData(data, [
          "60_day_eng_rate",
          "eng_rate",
          "Engagement Rate",
        ]);
        let engRate = 0;

        if (engRateRaw) {
          engRate = parseMetric(engRateRaw);
        } else if (followers > 0) {
          // Rumus Auto: (Likes + Comments + Shares) / Followers
          const totalInteractions = avgLikes + avgComments + avgShares;
          engRate = totalInteractions / followers;
        }

        // 5. Country (TikTok dataset ini kadang kosong, set Unknown)
        const country =
          getColumnData(data, ["Country", "country", "Audience Country"]) ||
          "Unknown";

        // 6. Posts (TikTok dataset ini tidak ada jumlah post, default 0)
        const postsRaw = getColumnData(data, ["Posts", "posts", "Media Count"]);
        const posts = parseMetric(postsRaw);

        // 7. Influence Score (Default 80 biar masuk akal kalau kosong)
        const scoreRaw = getColumnData(data, [
          "Influence Score",
          "influence_score",
        ]);
        let score = parseInt(scoreRaw) || 80;

        // 8. Rank (S.no di TikTok)
        const rankRaw = getColumnData(data, ["S.no", "Rank", "rank"]);
        const rank = parseInt(rankRaw) || 0;

        if (channelInfo) {
          const row = {
            rank: rank,
            channel_info: channelInfo,
            influence_score: score,
            posts: posts,
            followers: followers,
            avg_likes: avgLikes,
            eng_rate: engRate,
            new_post_avg_like: avgLikes,
            country: country,
          };
          candidates.push(row);
        }
      })
      .on("end", async () => {
        console.log(`📊 Berhasil membaca ${candidates.length} baris valid.`);

        if (candidates.length === 0) {
          return res
            .status(400)
            .json({
              message: "Gagal parsing CSV. Header kolom tidak dikenali.",
            });
        }

        try {
          await client.execute("DELETE FROM candidates");

          const BATCH_SIZE = 50;
          let insertedCount = 0;

          for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
            const batch = candidates.slice(i, i + BATCH_SIZE);
            const promises = batch.map((row) => {
              return client.execute({
                sql: `INSERT INTO candidates 
                          (rank, channel_info, influence_score, posts, followers, avg_likes, eng_rate, new_post_avg_like, country) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                  row.rank,
                  row.channel_info,
                  row.influence_score,
                  row.posts,
                  row.followers,
                  row.avg_likes,
                  row.eng_rate,
                  row.new_post_avg_like,
                  row.country,
                ],
              });
            });
            await Promise.all(promises);
            insertedCount += batch.length;
          }

          console.log(`✅ Database Updated: ${insertedCount} rows.`);
          res.json({
            status: "success",
            message: `Sukses import ${insertedCount} data TikTok/IG!`,
            count: insertedCount,
          });
        } catch (dbError) {
          console.error("❌ Database Error:", dbError);
          res
            .status(500)
            .json({ message: "Gagal menyimpan ke DB", error: dbError.message });
        }
      });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { uploadCSV };
