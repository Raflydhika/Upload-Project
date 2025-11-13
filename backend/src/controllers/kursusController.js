// backend/src/controllers/kursusController.js

const kursusModel = require("../models/kursus");

/**
 * [GET] /api/kursus
 * Mengambil semua daftar kursus dari database dan mengirimkannya sebagai respons JSON.
 * @param {object} req - Objek Request Express
 * @param {object} res - Objek Response Express
 */
const getSemuaKursus = async (req, res) => {
  console.log("LOG: Menerima permintaan GET untuk semua kursus.");
  try {
    // Panggil fungsi dari Model untuk berinteraksi dengan DB
    const kursus = await kursusModel.getSemuaKursusDB();

    if (!kursus || kursus.length === 0) {
      // Jika data kosong, kirim status 404
      return res.status(404).json({
        success: false,
        message: "Tidak ada kursus yang ditemukan.",
      });
    }

    // Jika berhasil, kirim data dengan status 200 OK
    res.status(200).json({
      success: true,
      message: "Daftar semua kursus berhasil diambil dari database.",
      data: kursus,
    });
  } catch (error) {
    // Tangani error yang dilempar dari Model
    console.error("Kesalahan saat mengambil semua kursus (Controller):", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat mengambil data kursus.",
    });
  }
};

/**
 * [GET] /api/kursus/:id
 * Mengambil detail satu kursus berdasarkan id_kursus.
 * @param {object} req - Objek Request Express (mengandung params.id)
 * @param {object} res - Objek Response Express
 */
const getKursusById = async (req, res) => {
  const kursusId = req.params.id;
  console.log(`LOG: Menerima permintaan GET untuk kursus ID: ${kursusId}`);

  // Validasi input sederhana
  if (!kursusId || isNaN(kursusId)) {
    return res.status(400).json({
      success: false,
      message: "ID kursus tidak valid atau tidak ditemukan.",
    });
  }

  try {
    const kursus = await kursusModel.getKursusByIdDB(kursusId);

    if (!kursus) {
      return res.status(404).json({
        success: false,
        message: `Kursus dengan ID ${kursusId} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Detail kursus ID ${kursusId} berhasil diambil.`,
      data: kursus,
    });
  } catch (error) {
    console.error(`Kesalahan saat mengambil kursus ID ${kursusId} (Controller):`, error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat mengambil detail kursus.",
    });
  }
};

/**
 * [POST] /api/kursus
 * Menambahkan data kursus baru yang dikirim dari dashboard.
 * @param {object} req - Objek Request Express (mengandung body)
 * @param {object} res - Objek Response Express
 */
const createKursus = async (req, res) => {
  console.log("LOG: Menerima permintaan POST untuk menambah kursus baru.");

  // Destructuring data dari req.body (pastikan nama field sesuai dengan HTML form)
  const { nama_kursus, deskripsi, durasi, level, harga, url_gambar } = req.body;

  // --- Validasi Data Wajib ---
  if (!nama_kursus || !deskripsi || !durasi || !level || !harga) {
    return res.status(400).json({
      success: false,
      message: "Semua field wajib (Nama, Deskripsi, Durasi, Level, Harga) harus diisi.",
    });
  }

  // Persiapan data untuk Model
  const newKursusData = {
    nama_kursus,
    deskripsi,
    durasi,
    level,
    harga,
    url_gambar: url_gambar || null,
  };

  try {
    // Panggil fungsi di Model untuk menyimpan data ke database
    // Asumsi fungsi Model bernama createKursusDB dan mengembalikan data kursus yang baru dibuat
    const result = await kursusModel.createKursusDB(newKursusData);

    // Kirim respons sukses ke front-end
    res.status(201).json({
      // Status 201: Created
      success: true,
      message: "Kursus berhasil ditambahkan.",
      data: result,
    });
  } catch (error) {
    // Tangani error database atau kesalahan server
    console.error("Kesalahan saat menambahkan kursus (Controller):", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat menyimpan kursus.",
    });
  }
};

const updateKursus = async (req, res) => {
  const kursusId = req.params.id;
  console.log(`LOG: Menerima permintaan PUT untuk memperbarui kursus ID: ${kursusId}`);

  const updatedData = req.body; // Data pembaruan dari body

  // Validasi ID
  if (!kursusId || isNaN(kursusId)) {
    return res.status(400).json({
      success: false,
      message: "ID kursus tidak valid.",
    });
  }

  // Validasi minimal data
  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada data yang dikirim untuk pembaruan.",
    });
  }

  try {
    // Panggil Model untuk melakukan pembaruan
    const result = await kursusModel.updateKursusDB(kursusId, updatedData);

    if (result.affectedRows === 0) {
      // Asumsi Model mengembalikan objek dengan properti affectedRows
      return res.status(404).json({
        success: false,
        message: `Kursus dengan ID ${kursusId} tidak ditemukan untuk diupdate.`,
      });
    }

    // Ambil data kursus yang baru saja diupdate (opsional, tergantung implementasi Model)
    const updatedKursus = await kursusModel.getKursusByIdDB(kursusId);

    res.status(200).json({
      success: true,
      message: `Kursus ID ${kursusId} berhasil diperbarui.`,
      data: updatedKursus,
    });
  } catch (error) {
    console.error(`Kesalahan saat memperbarui kursus ID ${kursusId} (Controller):`, error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat memperbarui kursus.",
    });
  }
};

/**
 * [DELETE] /api/kursus/:id
 * Menghapus data kursus.
 */
const deleteKursus = async (req, res) => {
  const kursusId = req.params.id;
  console.log(`LOG: Menerima permintaan DELETE untuk kursus ID: ${kursusId}`);

  if (!kursusId || isNaN(kursusId)) {
    return res.status(400).json({
      success: false,
      message: "ID kursus tidak valid.",
    });
  }

  try {
    // Panggil Model untuk melakukan penghapusan
    const result = await kursusModel.deleteKursusDB(kursusId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Kursus dengan ID ${kursusId} tidak ditemukan untuk dihapus.`,
      });
    }

    // Status 200: OK (berhasil dihapus)
    res.status(200).json({
      success: true,
      message: `Kursus ID ${kursusId} berhasil dihapus.`,
      data: { id_kursus: kursusId },
    });
  } catch (error) {
    console.error(`Kesalahan saat menghapus kursus ID ${kursusId} (Controller):`, error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat menghapus kursus.",
    });
  }
};

module.exports = {
  getSemuaKursus,
  getKursusById,
  createKursus,
  deleteKursus,
  updateKursus,
};
