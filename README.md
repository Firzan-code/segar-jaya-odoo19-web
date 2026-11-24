# Website Representasi Proyek — CV Segar Jaya Distribusi (Odoo 19)

Website statis sederhana (HTML, CSS, dan Vanilla JavaScript) yang merepresentasikan proyek **Smart Expiry & Batch Management ERP** berbasis **Odoo 19 Community** untuk objek simulasi **CV Segar Jaya Distribusi**.

## Isi Halaman

1. **Beranda & Ringkasan ERP:** Profil singkat distributor makanan/minuman dan pratinjau struktur lot produk utama `Susu UHT 1 Liter (SU1L)`.
2. **Profil & Latar Belakang:** Gambaran tantangan proses awal (As-Is) vs pendekatan terintegrasi di Odoo 19.
3. **Katalog Produk:** Menampilkan produk uji utama Odoo 19 (`SU1L`) beserta beberapa contoh kategori distribusi, lengkap dengan filter kategori dan modal detail.
4. **Alur Operasional Odoo 19:** Alur 5 tahap (`WH/IN` & Lot → Sales Order → Reservasi FEFO → Delivery `WH/OUT` → Traceability).
5. **Simulasi Interaktif FEFO:** Kalkulator simulasi alokasi multi-batch (default skenario 120 unit), termasuk opsi eksklusi lot kedaluwarsa (`B-EXP`) dan pengecekan stok berlebih (*over-stock*).
6. **Info Proyek & Akses Odoo Lokal:** Ringkasan RQ1/RQ2 dari Research Canvas dan pintasan port lokal Odoo 19 (`11019` / `10019`).

## Cara Menjalankan

- **Paling cepat (tanpa instalasi):** klik dua kali file `index.html` untuk langsung membukanya di browser.
- **Via server lokal (opsional):**
  ```powershell
  python -m http.server 8080
  ```
  Lalu buka `http://localhost:8080`.

## Cara Membagikan ke Tim / Deploy Gratis

Seluruh website hanya terdiri dari 3 file inti (`index.html`, `styles.css`, `app.js`):
- Kirim folder ini sebagai ZIP ke rekan tim (langsung bisa dibuka lewat `index.html`), atau
- Unggah ke **GitHub Pages** / **Netlify Drop** / **Vercel** untuk mendapatkan tautan publik.

## Batasan Klaim

Website ini adalah representasi front-end statis dan simulasi ilustratif alur FEFO (bukan toko transaksi aktif dan bukan hasil pengujian pengguna manusia).
