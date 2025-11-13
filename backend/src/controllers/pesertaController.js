// backend/src/controllers/pesertaController.js

const Peserta = require("../models/Peserta");
const bcrypt = require("bcrypt"); // Untuk enkripsi password

// Fungsi untuk menangani pendaftaran peserta baru (CREATE)
exports.registerPeserta = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // 1. Validasi: Cek apakah semua field wajib terisi
    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Semua field (nama, email, password) wajib diisi.",
      });
    }

    // 2. Cek duplikasi email (Email harus unik)
    const existingPeserta = await Peserta.findOne({ where: { email } });
    if (existingPeserta) {
      return res.status(409).json({
        message: "Pendaftaran gagal. Email sudah terdaftar.",
      });
    }

    // 3. Hashing Password
    // Salting rounds 10 adalah standar keamanan yang baik
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan Peserta Baru ke Database
    const newPeserta = await Peserta.create({
      nama,
      email,
      password: hashedPassword, // Simpan HASH password
    });

    // 5. Kirim Respons Sukses (Status 201 Created)
    // Hindari mengirim hash password kembali ke frontend
    res.status(201).json({
      message: "Pendaftaran peserta berhasil!",
      pesertaId: newPeserta.id,
      email: newPeserta.email,
    });
  } catch (error) {
    console.error("Gagal mendaftarkan peserta:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mendaftar",
      error: error.message,
    });
  }
};

exports.tampilSemuaPeserta = async (req, res) => {
  try {
    // Menggunakan method bawaan Sequelize: findAll()
    const allPeserta = await PesertaModel.findAll({
      // Pilih kolom yang aman untuk ditampilkan di dashboard (tidak termasuk password!)
      attributes: ["id", "nama", "email", "createdAt", "updatedAt"],
    });

    res.status(200).json({
      message: "Data semua peserta berhasil diambil.",
      data: allPeserta,
    });
  } catch (error) {
    console.error("Gagal mengambil data peserta:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil data peserta.",
      error: error.message,
    });
  }
};

exports.updatePeserta = async (req, res) => {
  const pesertaId = req.params.id;
  const updateData = req.body;

  // Pengecekan keamanan: Jika password diupdate, harus di-hash ulang!
  if (updateData.password) {
    try {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } catch (hashError) {
      console.error("Gagal melakukan hashing password saat update:", hashError);
      return res.status(500).json({ message: "Gagal memproses password baru." });
    }
  }

  try {
    // Menggunakan method bawaan Sequelize: update()
    const [affectedRows] = await PesertaModel.update(updateData, {
      where: { id: pesertaId },
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        message: `Peserta dengan ID ${pesertaId} tidak ditemukan atau tidak ada perubahan data.`,
      });
    }

    // Ambil data peserta yang baru diupdate (tanpa password)
    const updatedPeserta = await PesertaModel.findByPk(pesertaId, {
      attributes: ["id", "nama", "email", "createdAt", "updatedAt"],
    });

    res.status(200).json({
      message: "Data peserta berhasil diperbarui.",
      data: updatedPeserta,
    });
  } catch (error) {
    console.error("Gagal update peserta:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat memperbarui data peserta.",
      error: error.message,
    });
  }
};

exports.hapusPeserta = async (req, res) => {
  const pesertaId = req.params.id;

  if (!pesertaId) {
    return res.status(400).json({ message: "ID Peserta wajib diisi untuk penghapusan." });
  }

  try {
    // Menggunakan method bawaan Sequelize: destroy()
    const deletedCount = await PesertaModel.destroy({
      where: { id: pesertaId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: `Peserta dengan ID ${pesertaId} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      message: `Data peserta ID ${pesertaId} berhasil dihapus.`,
    });
  } catch (error) {
    console.error("Gagal hapus peserta:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat menghapus data peserta.",
      error: error.message,
    });
  }
};

module.exports = {
  registerPeserta: exports.registerPeserta,
  tampilSemuaPeserta: exports.tampilSemuaPeserta,
  updatePeserta: exports.updatePeserta,
  hapusPeserta: exports.hapusPeserta,
};
