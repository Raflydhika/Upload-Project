/**
 * Bertugas mengambil data dari backend API (http://localhost:3000/api/kursus)
 * dan menampilkannya sebagai card.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ID yang disesuaikan dengan ID di kursus.html
  const kursusContainer = document.getElementById("list-kursus-container");

  // URL Endpoint API dengan port server (3000)
  const API_URL = "http://localhost:3000/api/kursus";

  /**
   * Fungsi untuk mengambil data kursus dari API backend
   */
  async function fetchKursus() {
    // Menampilkan pesan loading sementara di container
    kursusContainer.innerHTML = '<p class="text-center text-gray-500">Memuat daftar kursus, mohon tunggu...</p>';

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        // Tangani respons HTTP non-200 (misal 404 atau 500)
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const dataKursus = result.data; // Mengambil array data

      kursusContainer.innerHTML = ""; // Kosongkan pesan loading

      if (dataKursus && dataKursus.length > 0) {
        // Tambahkan kelas grid untuk tata letak yang bagus
        kursusContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-4", "gap-8", "py-8");
        renderKursusCards(dataKursus);
      } else {
        kursusContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-4", "gap-8", "py-8");
        kursusContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full">Saat ini belum ada kursus yang tersedia.</p>';
      }
    } catch (error) {
      console.error("Gagal mengambil data kursus:", error);
      kursusContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-4", "gap-8", "py-8");
      kursusContainer.innerHTML = '<p class="text-red-500 text-center col-span-full">Gagal terhubung ke server API / Data belum tersedia</p>';
    }
  }

  /**
   * Fungsi untuk membuat dan menampilkan card kursus ke DOM
   * @param {Array<Object>} kursusArray - Array data kursus
   */
  function renderKursusCards(kursusArray) {
    kursusArray.forEach((kursus) => {
      // Format harga ke mata uang Rupiah
      const hargaFormatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(kursus.harga);

      // Membuat struktur HTML untuk satu card (Menggunakan kelas kustom yang diasumsikan ada di kursus.css)
      const cardHTML = `
                <div class="kursus-card">
                    <!-- Gambar Kursus -->
                    <img src="${kursus.url_gambar}" alt="Gambar kursus ${kursus.nama_kursus}" class="kursus-img">
                    <div class="kursus-content">
                        <!-- Level -->
                        <div class="kursus-meta">
                            <span class="kursus-level">${kursus.level}</span>
                        </div>
                        
                        <!-- Nama Kursus -->
                        <h3 class="kursus-title">${kursus.nama_kursus}</h3>
                        
                        <!-- Deskripsi Singkat -->
                        <p class="kursus-deskripsi">${kursus.deskripsi}</p>
                        
                        <!-- Durasi dan Harga -->
                        <div class="kursus-footer">
                            <span class="kursus-durasi">${kursus.durasi} Jam</span>
                            <span class="kursus-harga">${hargaFormatted}</span>
                        </div>
                        <div class="daftar-button">
                          <a href="/form.html">Daftar</a>
                        </div>
                      
                    </div>
                </div>
            `;

      // Tambahkan card ke container
      kursusContainer.innerHTML += cardHTML;
    });
  }

  // Panggil fungsi utama saat DOM siap
  fetchKursus();
});
