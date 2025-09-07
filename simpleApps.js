// SIMPLE APPS, IMPLEMENT ARRAY

// Simple Cart Operation

let arrayOfCart = [];

function tambahBarang(namaBarang) {
  if (typeof namaBarang !== `string`) {
    console.log("Tipe data tidak sesuai");
  } else {
    console.log("Data Berhasil dimasukkan");
    arrayOfCart.push(namaBarang);
  }
}

function tampilkanBarang() {
  let number = 1;

  console.log("===== MENAMPILKAN LIST BARANG =====");

  for (let i = 0; i < arrayOfCart.length; i++) {
    console.log(`${number}. ${arrayOfCart[i]}`);
    number += 1;
  }
}

function hapusBarangElementAkhir() {
  arrayOfCart.pop();
}

function hapusBarangElementPertama() {
  arrayOfCart.shift();
}

function checkKetersediaan(nama) {
  let hasilPencarian = arrayOfCart.includes(nama, 0);

  console.log(`Barang yang dicari : ${nama}`);

  if (hasilPencarian === true) {
    console.log(`Ketersediaan : ${hasilPencarian}`);
  } else {
    console.log(`Ketersediaan : ${hasilPencarian}`);
  }
}

tambahBarang("Sepatu");
tambahBarang("Sendal");
tambahBarang("Tas");

tampilkanBarang();
checkKetersediaan("Tas");
checkKetersediaan("Semvak");
