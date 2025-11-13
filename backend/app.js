// Import Express module
const express = require("express");
const path = require("path");
const cors = require("cors");

const { connectMyDB } = require("./src/config/database");

// Import Routes yang sudah dibuat
const pesertaRoutes = require("./src/routes/pesertaRoute");
const kursusRoutes = require("./src/routes/kursusRoute");

// Inisialisasi express
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// MIDDLEWARE UNTUK HALAMAN WEB
app.use(express.static(path.join(__dirname, "..", "public")));

const apiRoutes = ["/api/peserta", "/api/kursus"];
app.use(apiRoutes, cors());

// Membuat Endpoint
app.use("/api/peserta", pesertaRoutes);
app.use("/api/kursus", kursusRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "beranda.html"));
});

// DATABASE KONEKSI
async function startServer() {
  try {
    // Uji koneksi ke Database
    console.log("Mencoba koneksi ke database...");
    await connectMyDB();

    // OUTPUT JIKALAU BERHASIL (LISTEN)
    app.listen(port, () => {
      console.log(`Server Express berjalan di http://localhost:${port}`);
      console.log(`Endpoint Kursus: http://localhost:${port}/api/kursus`);
    });
  } catch (error) {
    // JIKA KONEKSI KE DATABASE GAGAL
    console.error("Server Gagal Diaktifkan. Periksa konfigurasi DB.");
  }
}

// STARTING THE SERVER CONNECTION TO DB
startServer();
