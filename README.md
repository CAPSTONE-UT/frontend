# InvenSMK Web

Frontend Next.js dan Tailwind CSS untuk School Inventory Backend. Kontrak endpoint yang tersedia saat ini ada di [KONTRAK.md](./KONTRAK.md).

## Menjalankan aplikasi

1. Jalankan backend pada `http://localhost:3000`.
2. Atur URL API di `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. Jalankan frontend pada port lain:

   ```bash
   pnpm dev -- --port 3001
   ```

4. Buka `http://localhost:3001`.

Jika backend berjalan pada alamat berbeda, ubah `NEXT_PUBLIC_API_URL`. Pastikan backend mengizinkan origin frontend.

## Halaman dan peran

| Route | Peran | Fungsi |
|---|---|---|
| `/login`, `/register` | Publik | Masuk dan pendaftaran akun |
| `/dashboard` | Admin, Petugas | Admin: ringkasan, grafik mingguan, daftar terlambat. Petugas: peminjaman aktif dan terlambat |
| `/pindai` | Admin, Petugas | Pemindai kamera + input manual, lalu pinjam atau kembalikan |
| `/loans`, `/loans/history` | Admin, Petugas | Peminjaman aktif/terlambat dan riwayat, dengan aksi pengembalian |
| `/items`, `/items/[id]` | Admin, Petugas | Daftar barang, detail, dan riwayat; tambah/ubah/hapus khusus admin |
| `/items/labels?ids=...` | Admin, Petugas | Cetak label barcode Code 128 |
| `/categories` | Admin | Kelola kategori |
| `/users` | Admin | Kelola akun, peran, dan status |
| `/my-loans` | Peminjam | Riwayat peminjaman milik sendiri |
| `/profil` | Semua | Profil akun dan status API |

Peran `admin` = Admin, `inventory_officer` = Petugas, `staff` = Peminjam. Navigasi menampilkan
menu sesuai peran (sidebar di desktop, bottom navbar Pindai/Aktif/Riwayat/Profil di HP), dan halaman
yang dibuka tanpa izin menampilkan pesan 403. Otorisasi sebenarnya tetap ditegakkan backend.

Endpoint yang dipakai dirangkum di [KONTRAK.md](./KONTRAK.md).

## Checklist pengerjaan Frontend

`[x]` selesai di frontend. `[ ]` belum selesai.

### 1. Setup dasar dan PWA

- [x] Inisialisasi Next.js, Tailwind CSS, dan Axios untuk request ke API.
- [ ] Buat `manifest.json`, ikon PWA ukuran 192px dan 512px, serta service worker.
  - Belum dikerjakan. Perlu aset ikon aplikasi. Pemasangan PWA (U-13) juga memerlukan deployment HTTPS.

### 2. Auth dan layout navigasi

- [x] Login, register, logout, dan profil terhubung ke API.
- [x] Refresh token otomatis melalui interceptor Axios.
- [x] Guard halaman per peran dan tampilan 403.
- [x] Sidebar admin dan bottom navbar HP untuk Pindai, Aktif, dan Riwayat.

### 3. Halaman admin (desktop)

- [x] Dashboard berisi total barang, jumlah dipinjam, keterlambatan, barang rusak, grafik mingguan, dan daftar keterlambatan.
- [x] CRUD kategori (`/categories`).
- [x] CRUD barang (`/items`) dan cetak label barcode (`/items/labels`).
- [x] Manajemen pengguna (`/users`) serta perubahan peran dan status.

### 4. Scanner dan transaksi (mobile)

- [x] Scanner kamera (`/pindai`) menggunakan `html5-qrcode` (Code 128, Code 39, EAN-13, QR).
- [x] Input barcode manual dan pencarian barang.
- [x] Barang tersedia: pilih peminjam dan tanggal jatuh tempo.
- [x] Barang sedang dipinjam: tampilkan peminjam aktif dan pilih kondisi saat kembali.

### 5. Pemantauan dan riwayat

- [x] Peminjaman aktif (`/loans`) beserta penanda keterlambatan.
- [x] Riwayat barang (`/items/[id]`), berisi peminjaman dan log kondisi.
- [x] Riwayat peminjam (`/my-loans`).
- [ ] Laporan (`/reports`, opsional).
  - Belum ada endpoint rekap. Data dapat diambil dari `GET /api/v1/loans` dengan filter tanggal.

## Catatan implementasi

- Kamera hanya dapat dibuka melalui HTTPS atau `localhost`. Untuk uji di HP pada jaringan lokal, gunakan HTTPS (misalnya `next dev --experimental-https`) atau input kode manual.
- Tanggal jatuh tempo dikirim sebagai `YYYY-MM-DD` dan dihitung backend sebagai pukul 23.59 WIB.
- Status barang (`Tersedia`, `Dipinjam`, `Rusak`) dikelola backend dan tidak dapat diubah langsung dari form barang.
