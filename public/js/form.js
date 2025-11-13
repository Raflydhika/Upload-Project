document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registerForm");
  const messageDiv = document.getElementById("message");

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    messageDiv.textContent = "Memproses...";
    messageDiv.style.color = "blue";

    const formData = {
      nama: document.getElementById("nama").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    // FORM VALIDASI
    if (!formData.nama || !formData.email || !formData.password) {
      messageDiv.textContent = "Semua field wajib diisi!";
      messageDiv.style.color = "red";
      return;
    }

    try {
      const response = await fetch("/api/peserta/daftar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = `✅ Pendaftaran berhasil!`;
        messageDiv.style.color = "green";
        registrationForm.reset();
      } else {
        messageDiv.textContent = `Pendaftaran gagal: ${result.message || "Server error."}`;
        messageDiv.style.color = "red";
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      messageDiv.textContent = "Terjadi kesalahan koneksi atau server tidak merespons.";
      messageDiv.style.color = "red";
    }
  });
});
