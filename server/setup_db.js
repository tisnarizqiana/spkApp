const client = require("./config/db");

const setupDatabase = async () => {
  try {
    console.log("🔄 Memulai inisialisasi database...");

    // 1. Tabel Candidates (Data Influencer)
    // Kita menggunakan tipe REAL untuk angka agar presisi, karena data asli ada desimal.
    await client.execute(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rank INTEGER,
        channel_info TEXT,
        influence_score INTEGER,
        posts REAL,
        followers REAL,
        avg_likes REAL,
        eng_rate REAL,
        new_post_avg_like REAL,
        country TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabel 'candidates' berhasil dibuat/diperiksa.");

    // 2. Tabel Criteria (Kriteria Penilaian)
    // 'attribute' mengacu pada nama kolom di tabel candidates
    // 'type' bisa 'Core' atau 'Secondary'
    // 'target_value' adalah nilai ideal yang diharapkan user
    await client.execute(`
      CREATE TABLE IF NOT EXISTS criteria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE, 
        name TEXT NOT NULL,
        attribute TEXT NOT NULL,
        type TEXT CHECK(type IN ('Core', 'Secondary')) NOT NULL,
        weight_percentage REAL NOT NULL,
        target_value REAL NOT NULL
      );
    `);
    console.log("✅ Tabel 'criteria' berhasil dibuat/diperiksa.");

    // 3. Tabel Gap Mapping (Pembobotan Selisih)
    // Tabel referensi standar Profile Matching untuk konversi Gap ke Bobot
    await client.execute(`
      CREATE TABLE IF NOT EXISTS gap_mapping (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gap REAL NOT NULL,
        weight REAL NOT NULL,
        description TEXT
      );
    `);
    console.log("✅ Tabel 'gap_mapping' berhasil dibuat/diperiksa.");

    // (Opsional) Insert Data Awal untuk Gap Mapping (Standar Profile Matching)
    // Mencegah table kosong saat pertama kali run
    const gapCheck = await client.execute(
      "SELECT count(*) as count FROM gap_mapping"
    );
    if (gapCheck.rows[0].count === 0) {
      console.log("ℹ️ Mengisi data awal 'gap_mapping'...");
      await client.batch(
        [
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (0, 5, 'Tidak ada selisih (Kompetensi sesuai)')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (1, 4.5, 'Kompetensi kelebihan 1 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (-1, 4, 'Kompetensi kekurangan 1 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (2, 3.5, 'Kompetensi kelebihan 2 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (-2, 3, 'Kompetensi kekurangan 2 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (3, 2.5, 'Kompetensi kelebihan 3 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (-3, 2, 'Kompetensi kekurangan 3 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (4, 1.5, 'Kompetensi kelebihan 4 tingkat')",
          "INSERT INTO gap_mapping (gap, weight, description) VALUES (-4, 1, 'Kompetensi kekurangan 4 tingkat')",
        ],
        "write"
      );
      console.log("✅ Data awal 'gap_mapping' berhasil diisi.");
    }
  } catch (error) {
    console.error("❌ Gagal melakukan setup database:", error);
  }
};

setupDatabase();
