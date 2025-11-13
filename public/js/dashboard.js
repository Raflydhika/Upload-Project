// URL dasar API
const API_URL = "http://localhost:3000/api/kursus";

// Variabel DOM
const kursusForm = document.getElementById("kursusForm");
const messageDiv = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const kursusIdInput = document.getElementById("kursusIdInput");
const tabelKursusBody = document.querySelector("#tabelKursus tbody");

// Status Mode Edit: false = Mode Tambah (POST), true = Mode Edit (PUT)
let isEditMode = false;

// Fungsi untuk menampilkan pesan status
function displayMessage(text, isSuccess) {
  messageDiv.textContent = text;
  messageDiv.className = "message " + (isSuccess ? "success" : "error");

  // Hilangkan pesan setelah 5 detik
  setTimeout(() => {
    messageDiv.textContent = "";
    messageDiv.className = "message";
  }, 5000);

  if (isSuccess) {
    // Jika sukses (Create/Update/Delete), muat ulang tabel
    tampilkanDataKursus();
  }
}

const formatRupiah = (angka) => {
  // Pastikan angka adalah bilangan
  if (typeof angka !== "number" || isNaN(angka)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const tampilkanDataKursus = async () => {
  tabelKursusBody.innerHTML = '<tr><td colspan="5">Memuat data...</td></tr>';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dataKursus = await response.json();

    tabelKursusBody.innerHTML = ""; // Kosongkan tabel sebelum diisi

    const kursusArray = dataKursus.data || [];

    if (kursusArray.length === 0) {
      tabelKursusBody.innerHTML = '<tr><td colspan="5">Belum ada data kursus.</td></tr>';
      return;
    }

    kursusArray.forEach((kursus) => {
      const row = tabelKursusBody.insertRow();
      row.insertCell().textContent = kursus.id_kursus;
      row.insertCell().textContent = kursus.nama_kursus;
      row.insertCell().textContent = kursus.level;
      row.insertCell().textContent = formatRupiah(parseFloat(kursus.harga));

      const cellAksi = row.insertCell();

      // Tombol EDIT
      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Edit";
      btnEdit.classList.add("btn-edit");
      btnEdit.addEventListener("click", () => muatDataUntukEdit(kursus.id_kursus));

      // Tombol HAPUS
      const btnHapus = document.createElement("button");
      btnHapus.textContent = "Hapus";
      btnHapus.classList.add("btn-hapus");
      btnHapus.addEventListener("click", () => hapusKursus(kursus.id_kursus, kursus.nama_kursus));

      cellAksi.appendChild(btnEdit);
      cellAksi.appendChild(btnHapus);
    });
  } catch (error) {
    console.error("Gagal mengambil data kursus:", error);
    tabelKursusBody.innerHTML = '<tr><td colspan="5">Gagal memuat data kursus. Pastikan server berjalan.</td></tr>';
  }
};

kursusForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nama_kursus: document.getElementById("nama_kursus").value,
    deskripsi: document.getElementById("deskripsi").value,
    // Pastikan durasi diubah menjadi angka integer
    durasi: parseInt(document.getElementById("durasi").value),
    level: document.getElementById("level").value,
    // Pastikan harga diubah menjadi angka float
    harga: parseFloat(document.getElementById("harga").value),
    url_gambar: document.getElementById("url_gambar").value || null,
  };

  let url;
  let method;
  let successMessage;

  if (isEditMode) {
    // Mode UPDATE (PUT)
    const id = kursusIdInput.value;
    url = `${API_URL}/${id}`;
    method = "PUT";
    successMessage = "✅ Kursus berhasil diperbarui!";
  } else {
    // Mode CREATE (POST)
    url = API_URL;
    method = "POST";
    successMessage = "✅ Kursus baru berhasil ditambahkan!";
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      displayMessage(successMessage, true);
      kursusForm.reset();
      resetForm(); // Kembalikan ke mode Tambah
    } else {
      const errorMessage = result.message || result.msg || "Terjadi kesalahan saat menyimpan data.";
      displayMessage(`❌ Gagal menyimpan: ${errorMessage}`, false);
    }
  } catch (error) {
    console.error("Error submit form:", error);
    displayMessage("❌ Koneksi gagal. Pastikan Backend Anda berjalan.", false);
  }
});

// Fungsi untuk menyiapkan form dalam mode Edit
const muatDataUntukEdit = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data kursus ID ${id}`);
    }
    const data = await response.json();
    const kursus = data.data;

    // 1. Isi ID dan field form
    kursusIdInput.value = kursus.id_kursus;
    document.getElementById("nama_kursus").value = kursus.nama_kursus;
    document.getElementById("deskripsi").value = kursus.deskripsi;
    document.getElementById("durasi").value = kursus.durasi;
    document.getElementById("level").value = kursus.level;
    document.getElementById("harga").value = kursus.harga;
    document.getElementById("url_gambar").value = kursus.url_gambar || "";

    // 2. Ubah tampilan form ke mode Edit
    isEditMode = true;
    formTitle.textContent = `Edit Kursus: ${kursus.nama_kursus}`;
    submitButton.textContent = "Simpan Perubahan";
    cancelEditButton.style.display = "inline-block";

    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Gagal memuat data kursus untuk edit:", error);
    displayMessage("❌ Gagal memuat data kursus untuk edit.", false);
  }
};

// Fungsi untuk mengembalikan form ke mode Tambah
const resetForm = () => {
  isEditMode = false;
  kursusForm.reset();
  kursusIdInput.value = "";
  formTitle.textContent = "Tambah Kursus Baru";
  submitButton.textContent = "Tambah Kursus";
  cancelEditButton.style.display = "none";
};

// Tambahkan event listener untuk tombol Batal Edit
cancelEditButton.addEventListener("click", resetForm);

const hapusKursus = async (id, nama) => {
  const isConfirmed = window.prompt(`Untuk menghapus kursus "${nama}", ketik 'HAPUS' (huruf besar):`);

  if (isConfirmed !== "HAPUS") {
    displayMessage("Penghapusan dibatalkan.", false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      displayMessage(`✅ Kursus "${nama}" berhasil dihapus!`, true);
    } else {
      const errorMessage = result.message || "Terjadi kesalahan saat menghapus data.";
      displayMessage(`❌ Gagal menghapus: ${errorMessage}`, false);
    }
  } catch (error) {
    console.error("Error saat menghapus:", error);
    displayMessage("❌ Koneksi gagal. Terjadi kesalahan jaringan.", false);
  }
};

document.addEventListener("DOMContentLoaded", tampilkanDataKursus);
