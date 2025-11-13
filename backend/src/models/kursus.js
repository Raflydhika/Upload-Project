const { sequelizing } = require("../config/database");
const { QueryTypes } = require("sequelize");

/**
 * [CREATE] Fungsi untuk menambahkan kursus baru ke tabel 'kursus' di database.
 * @param {object} kursusData - Objek yang berisi semua data kursus dari Controller.
 * @returns {Promise<Object>} Mengembalikan objek kursus yang baru saja dimasukkan.
 * @throws {Error} Jika terjadi kegagalan query database.
 */
const createKursusDB = async (kursusData) => {
  const { nama_kursus, deskripsi, durasi, level, harga, url_gambar } = kursusData;

  const sqlQuery = `
        INSERT INTO kursus (nama_kursus, deskripsi, durasi, level, harga, url_gambar)
        VALUES (:nama_kursus, :deskripsi, :durasi, :level, :harga, :url_gambar)
    `;

  try {
    const [results] = await sequelizing.query(sqlQuery, {
      replacements: {
        nama_kursus,
        deskripsi,
        durasi,
        level,
        harga,
        // Pastikan nilai null dikirim jika url_gambar kosong
        url_gambar: url_gambar || null,
      },
      type: QueryTypes.INSERT,
    });

    // Hasil dari QueryTypes.INSERT biasanya berupa array [insertId, rowCount].
    const newId = results; // ID yang baru dibuat (Sequelize sering mengembalikan ID di indeks 0)

    // Setelah INSERT, kita ambil kembali data lengkap kursus yang baru dibuat
    // untuk dikembalikan ke Controller (termasuk id_kursus yang otomatis dibuat).
    const [newKursus] = await sequelizing.query(`SELECT * FROM kursus WHERE id_kursus = :id`, {
      replacements: { id: newId },
      type: QueryTypes.SELECT,
    });

    return newKursus[0];
  } catch (error) {
    console.error("MODEL ERROR: Gagal menjalankan query INSERT kursus:", error);

    // Melemparkan error yang lebih deskriptif agar ditangkap oleh Controller
    throw new Error("Gagal menyimpan data kursus baru ke database.");
  }
};

/**
 * Mengambil semua data kursus dari tabel 'kursus' di database menggunakan Sequelize.
 * @returns {Promise<Array>} Daftar objek kursus.
 * @throws {Error} Jika terjadi kegagalan query database.
 */
const getSemuaKursusDB = async () => {
  // Query SQL untuk mengambil semua kolom yang dibutuhkan frontend.
  const sqlQuery = `
        SELECT 
            id_kursus, 
            nama_kursus, 
            deskripsi, 
            durasi, 
            level, 
            harga, 
            url_gambar
        FROM kursus
        ORDER BY nama_kursus ASC
    `;

  try {
    // Menggunakan sequelizing.query() dengan QueryTypes.SELECT
    const results = await sequelizing.query(sqlQuery, {
      type: QueryTypes.SELECT, // Memastikan hasil dikembalikan sebagai array objek JSON datar
    });

    return results;
  } catch (error) {
    console.error("MODEL ERROR: Gagal menjalankan query SELECT semua kursus:", error);

    // Melemparkan error yang lebih deskriptif
    throw new Error("Gagal mengambil data kursus dari database.");
  }
};

/**
 * Fungsi untuk mengambil satu kursus berdasarkan ID menggunakan Sequelize.
 * @param {number} kursusId - ID unik dari kursus.
 * @returns {Promise<Object|null>} Objek kursus atau null jika tidak ditemukan.
 * @throws {Error} Jika terjadi kegagalan query database.
 */
const getKursusByIdDB = async (kursusId) => {
  const sqlQuery = `
        SELECT 
            id_kursus, 
            nama_kursus, 
            deskripsi, 
            durasi, 
            level, 
            harga, 
            url_gambar
        FROM kursus 
        WHERE id_kursus = :id
    `;

  try {
    // Menggunakan sequelizing.query() dengan parameterisasi untuk mencegah SQL Injection
    const results = await sequelizing.query(sqlQuery, {
      replacements: { id: kursusId }, // Nilai placeholder :id akan diganti dengan kursusId
      type: QueryTypes.SELECT,
    });

    // Mengembalikan objek kursus pertama (jika ada) atau null
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error(`MODEL ERROR: Gagal menjalankan query SELECT kursus ID ${kursusId}:`, error);
    throw new Error("Gagal mengambil detail kursus dari database.");
  }
};

/**
 * [UPDATE] Fungsi untuk memperbarui data kursus berdasarkan ID.
 * @param {number} kursusId - ID unik dari kursus yang akan diperbarui.
 * @param {object} kursusData - Objek yang berisi data kursus yang baru.
 * @returns {Promise<Object>} Mengembalikan objek kursus yang telah diperbarui.
 * @throws {Error} Jika terjadi kegagalan query database.
 */
const updateKursusDB = async (kursusId, kursusData) => {
  // Destructuring data dari objek yang dikirim oleh Controller
  const { nama_kursus, deskripsi, durasi, level, harga, url_gambar } = kursusData;

  // Query SQL untuk memperbarui data
  const sqlQuery = `
        UPDATE kursus 
        SET 
            nama_kursus = :nama_kursus, 
            deskripsi = :deskripsi, 
            durasi = :durasi, 
            level = :level, 
            harga = :harga, 
            url_gambar = :url_gambar
        WHERE id_kursus = :id_kursus
    `;

  try {
    // Menggunakan sequelizing.query() dengan QueryTypes.UPDATE
    // Note: Sequelizing dengan raw query biasanya mengembalikan array [results, affectedRows]
    const [results, affectedRows] = await sequelizing.query(sqlQuery, {
      replacements: {
        nama_kursus,
        deskripsi,
        durasi,
        level,
        harga,
        url_gambar: url_gambar || null,
        id_kursus: kursusId, // Pastikan ID digunakan untuk kondisi WHERE
      },
      type: QueryTypes.UPDATE,
    });

    // Jika tidak ada baris yang terpengaruh, berarti ID tidak ditemukan
    if (affectedRows === 0) {
      return null;
    }

    // Setelah UPDATE, ambil kembali data lengkap kursus yang baru diupdate
    // dan dikembalikan ke Controller.
    return await getKursusByIdDB(kursusId);
  } catch (error) {
    console.error(`MODEL ERROR: Gagal menjalankan query UPDATE kursus ID ${kursusId}:`, error);
    throw new Error("Gagal memperbarui data kursus di database.");
  }
};

/**
 * [DELETE] Fungsi untuk menghapus kursus berdasarkan ID.
 * @param {number} kursusId - ID unik dari kursus yang akan dihapus.
 * @returns {Promise<number>} Mengembalikan jumlah baris yang terpengaruh (1 jika sukses, 0 jika gagal).
 * @throws {Error} Jika terjadi kegagalan query database.
 */
const deleteKursusDB = async (kursusId) => {
  const sqlQuery = `
        DELETE FROM kursus 
        WHERE id_kursus = :id_kursus
    `;

  try {
    // Menggunakan sequelizing.query() dengan QueryTypes.DELETE
    // Note: Hasil dari DELETE biasanya berupa [rowCount, metaData]
    const [results, rowCount] = await sequelizing.query(sqlQuery, {
      replacements: { id_kursus: kursusId },
      type: QueryTypes.DELETE,
    });

    // Mengembalikan jumlah baris yang berhasil dihapus
    return rowCount;
  } catch (error) {
    console.error(`MODEL ERROR: Gagal menjalankan query DELETE kursus ID ${kursusId}:`, error);
    throw new Error("Gagal menghapus data kursus dari database.");
  }
};

module.exports = {
  getSemuaKursusDB,
  getKursusByIdDB,
  createKursusDB,
  updateKursusDB,
  deleteKursusDB,
};
