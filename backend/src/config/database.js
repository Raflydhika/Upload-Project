// backend/src/config/database.js

const { Sequelize } = require("sequelize");

const DB_NAME = "db_kursus_skilltanam";
const DB_USER = "root";
const DB_PASSWORD = "";
const DB_HOST = "127.0.0.1";
const DB_PORT = 3309;

const sequelizing = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

async function connectMyDB() {
  try {
    await sequelizing.authenticate();
    console.log("✅ Koneksi ke database MySQL berhasil.");
  } catch (error) {
    console.error("❌ Koneksi ke database MySQL gagal:", error.message);
    process.exit(1);
  }
}

module.exports = {
  sequelizing,
  connectMyDB,
};
