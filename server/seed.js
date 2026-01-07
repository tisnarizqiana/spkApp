const fs = require("fs");
const csv = require("csv-parser");
const client = require("./config/db");

// --- 1. Helper Function: parseMetric (Cerdas & Robust) ---
const parseMetric = (value) => {
  if (!value) return 0;

  // Ubah ke string, lowercase, dan hilangkan spasi
  let str = String(value).toLowerCase().trim();

  // Handle kasus NaN/Null string
  if (str === "" || str === "nan" || str === "n/a") return 0;

  // Handle Persentase (%) -> Ubah ke desimal (contoh: 1.39% -> 0.0139)
  if (str.includes("%")) {
    const cleanStr = str.replace("%", "");
    const num = parseFloat(cleanStr);
    return isFinite(num) ? num / 100 : 0; // Dibagi 100 sesuai request
  }

  // Handle Suffix (k, m, b)
  let multiplier = 1;
  if (str.endsWith("k")) multiplier = 1000;
  else if (str.endsWith("m")) multiplier = 1000000;
  else if (str.endsWith("b")) multiplier = 1000000000;

  // Hapus huruf suffix agar bisa di-parse
  str = str.replace(/[kmb]/g, "");

  const num = parseFloat(str);

  // Pastikan hasil akhirnya valid (Finite Number)
  return isFinite(num) ? num * multiplier : 0;
};

// --- 2. Main Function: Seed Data ---
const seedDatabase = async () => {
  console.log("🚀 Memulai proses Seeding Database...");

  const candidates = [];
  const BATCH_SIZE = 50;

  // A. Baca CSV
  console.log("⏳ Membaca file CSV 'top_insta_influencers_data.csv'...");

  // Pastikan file CSV ada
  if (!fs.existsSync("top_insta_influencers_data.csv")) {
    console.error(
      "❌ File CSV tidak ditemukan! Pastikan 'top_insta_influencers_data.csv' ada di folder server."
    );
    process.exit(1);
  }

  fs.createReadStream("top_insta_influencers_data.csv")
    .pipe(csv())
    .on("data", (data) => {
      // Mapping & Cleaning
      const row = {
        rank: parseInt(data.rank) || 0,
        channel_info: data.channel_info || "Unknown",
        influence_score: parseInt(data.influence_score) || 0,
        posts: parseMetric(data.posts),
        followers: parseMetric(data.followers),
        avg_likes: parseMetric(data.avg_likes),
        eng_rate: parseMetric(data["60_day_eng_rate"]), // Kolom yang sering typo
        new_post_avg_like: parseMetric(data.new_post_avg_like),
        country: data.country || "Unknown",
      };
      candidates.push(row);
    })
    .on("end", async () => {
      console.log(`📊 CSV Selesai dibaca: ${candidates.length} baris.`);

      try {
        // B. Reset Data Lama (Opsional - agar tidak duplikat saat dev)
        // Kita gunakan DELETE FROM agar id auto increment tidak error, atau DROP TABLE jika ingin fresh total.
        // Di sini kita DELETE saja isinya.
        console.log("🧹 Membersihkan data lama...");
        await client.execute("DELETE FROM candidates");
        await client.execute("DELETE FROM criteria");
        await client.execute("DELETE FROM gap_mapping");

        // C. Insert Candidates (Batching)
        console.log("📦 Mengisi tabel 'candidates'...");
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
          process.stdout.write(`.`);
        }
        console.log("\n✅ Data Candidates berhasil diisi.");

        // D. Insert Criteria (Default Profile Matching)
        console.log("⚙️ Mengisi tabel 'criteria'...");
        const criteriaData = [
          // Core Factor (60%): Followers & Engagement Rate
          {
            code: "C1",
            name: "Followers",
            attribute: "followers",
            type: "Core",
            weight: 30,
            target: 5,
          },
          {
            code: "C2",
            name: "Engagement Rate",
            attribute: "eng_rate",
            type: "Core",
            weight: 30,
            target: 4,
          },
          // Secondary Factor (40%): Average Likes & Influence Score
          {
            code: "C3",
            name: "Average Likes",
            attribute: "avg_likes",
            type: "Secondary",
            weight: 20,
            target: 4,
          },
          {
            code: "C4",
            name: "Influence Score",
            attribute: "influence_score",
            type: "Secondary",
            weight: 20,
            target: 5,
          },
        ];

        for (const c of criteriaData) {
          await client.execute({
            sql: `INSERT INTO criteria (code, name, attribute, type, weight_percentage, target_value) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [c.code, c.name, c.attribute, c.type, c.weight, c.target],
          });
        }
        console.log("✅ Data Criteria berhasil diisi.");

        // E. Insert Gap Mapping (Standard Pembobotan)
        console.log("⚖️ Mengisi tabel 'gap_mapping'...");
        const gapData = [
          { gap: 0, weight: 5, desc: "Kompetensi Sesuai" },
          { gap: 1, weight: 4.5, desc: "Kelebihan 1 Tingkat" },
          { gap: -1, weight: 4, desc: "Kekurangan 1 Tingkat" },
          { gap: 2, weight: 3.5, desc: "Kelebihan 2 Tingkat" },
          { gap: -2, weight: 3, desc: "Kekurangan 2 Tingkat" },
          { gap: 3, weight: 2.5, desc: "Kelebihan 3 Tingkat" },
          { gap: -3, weight: 2, desc: "Kekurangan 3 Tingkat" },
          { gap: 4, weight: 1.5, desc: "Kelebihan 4 Tingkat" },
          { gap: -4, weight: 1, desc: "Kekurangan 4 Tingkat" },
        ];

        for (const g of gapData) {
          await client.execute({
            sql: `INSERT INTO gap_mapping (gap, weight, description) VALUES (?, ?, ?)`,
            args: [g.gap, g.weight, g.desc],
          });
        }
        console.log("✅ Data Gap Mapping berhasil diisi.");

        console.log("\n🎉 SEEDING SELESAI! Database siap digunakan.");
      } catch (err) {
        console.error("\n❌ Error saat seeding:", err);
      }
    });
};

seedDatabase();
