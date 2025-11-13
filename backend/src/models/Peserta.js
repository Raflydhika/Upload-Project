const { DataTypes } = require("sequelize");
// PERBAIKAN: Mengganti { sequelize } menjadi { sequelizing } agar sesuai dengan export di database.js
const { sequelizing } = require("../config/database");

/**
 * Mendefinisikan model 'Peserta' yang merepresentasikan tabel 'users' di database.
 */
// Gunakan variabel 'sequelizing' yang sudah diimpor
const Peserta = sequelizing.define(
  "users",
  {
    // Kolom 'id' adalah Primary Key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // Kolom 'nama'
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Kolom 'email' (Harus Unik)
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Kolom 'password' (Untuk Hash Password)
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Pengaturan Model
    tableName: "users",
    timestamps: true,
  }
);

// Fungsi untuk membuat peserta baru (CREATE)
const createPesertaDB = async (pesertaData) => {
  return await Peserta.create(pesertaData);
};

// Fungsi untuk mengambil semua peserta (READ)
const getSemuaPesertaDB = async () => {
  return await Peserta.findAll();
};

// Fungsi untuk mengambil satu peserta berdasarkan ID (READ BY ID)
const getPesertaByIdDB = async (id) => {
  return await Peserta.findByPk(id);
};

/**
 * [UPDATE] Fungsi untuk memperbarui data peserta berdasarkan ID.
 * @param {number} id - ID unik dari peserta yang akan diperbarui.
 * @param {object} updateData - Objek yang berisi data baru.
 * @returns {Promise<number>} Mengembalikan jumlah baris yang berhasil diperbarui (0 atau 1).
 */
const updatePesertaDB = async (id, updateData) => {
  // Gunakan method .update() bawaan Sequelize
  const [affectedRows] = await Peserta.update(updateData, {
    where: { id: id },
  });
  // Jika update berhasil, kita bisa mengembalikan data yang baru diupdate
  if (affectedRows > 0) {
    return await getPesertaByIdDB(id);
  }
  return null; // Mengembalikan null jika ID tidak ditemukan atau tidak ada perubahan
};

/**
 * [DELETE] Fungsi untuk menghapus peserta berdasarkan ID.
 * @param {number} id - ID unik dari peserta yang akan dihapus.
 * @returns {Promise<number>} Mengembalikan jumlah baris yang berhasil dihapus (0 atau 1).
 */
const deletePesertaDB = async (id) => {
  const rowCount = await Peserta.destroy({
    where: { id: id },
  });
  return rowCount;
};

module.exports = {
  PesertaModel: Peserta,
  createPesertaDB,
  getSemuaPesertaDB,
  getPesertaByIdDB,
  updatePesertaDB,
  deletePesertaDB,
};
