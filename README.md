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

## Endpoint API yang digunakan

- `GET /health` untuk status koneksi API.
- `POST /api/v1/auth/register` untuk pendaftaran staf.
- `POST /api/v1/auth/login` untuk masuk dan menerima session.
- `GET /api/v1/auth/profile` untuk memuat profil dengan Bearer access token.
- `POST /api/v1/auth/logout` untuk mencabut session dengan Bearer access token.

Access token disimpan di `localStorage` dan hanya dikirim pada endpoint profil dan logout. Jika pendaftaran tidak menghasilkan session, halaman menampilkan instruksi verifikasi email. Jika session tersedia, frontend mencabut session tersebut lalu tetap mengarahkan pengguna ke halaman masuk.

## Checklist pengerjaan Frontend

`[x]` selesai di frontend. `[ ]` belum selesai; alasan dan dependensi dicatat pada tiap bagian.

### 1. Setup dasar dan PWA

- [x] Inisialisasi Next.js, Tailwind CSS, dan Axios untuk request ke API.
- [ ] Buat `manifest.json`, ikon PWA ukuran 192px dan 512px, serta service worker.
  - Belum dikerjakan. Perlu aset ikon aplikasi dan keputusan tentang perilaku saat offline. Tidak terblokir oleh endpoint API.

### 2. Auth dan layout navigasi

- [x] Halaman login terhubung ke `POST /api/v1/auth/login`.
- [x] Halaman register terhubung ke `POST /api/v1/auth/register`, termasuk alur verifikasi email dan respons session.
- [x] Logout terhubung ke `POST /api/v1/auth/logout`; token lokal dihapus setelah proses logout.
- [x] Dashboard mengambil profil melalui `GET /api/v1/auth/profile` dan memeriksa `GET /health`.
- [ ] Middleware RBAC dan halaman `403`.
  - Belum bisa diterapkan dengan benar. Kontrak saat ini menyatakan role hanya informasi profil dan API belum memberlakukan otorisasi role. Kontrak menggunakan role `staff`, `inventory_officer`, dan `admin`, sedangkan rancangan awal menyebut `admin`, `petugas`, dan `peminjam`. Perlu keputusan role dan aturan akses dari backend/produk.
- [ ] Sidebar admin dan bottom navbar HP untuk Pindai, Aktif, dan Riwayat.
  - Belum dibuat. Rute dan API untuk transaksi aktif serta riwayat belum tersedia. Dashboard saat ini memiliki sidebar profil sederhana pada desktop.

### 3. Halaman admin (desktop)

- [ ] Dashboard berisi total barang, jumlah dipinjam, keterlambatan, barang rusak, grafik mingguan, dan daftar keterlambatan.
  - Belum dibuat karena backend belum menyediakan endpoint statistik, transaksi, kondisi barang, atau daftar keterlambatan. Dashboard saat ini hanya menampilkan profil dan status API agar tidak memakai angka contoh.
- [ ] CRUD kategori (`/categories`).
  - Menunggu endpoint daftar, tambah, ubah, dan hapus kategori beserta schema request/response.
- [ ] CRUD barang (`/items`) dan cetak label barcode.
  - Menunggu endpoint barang, validasi keunikan barcode, serta spesifikasi format barcode/label.
- [ ] Manajemen pengguna (`/users`) dan perubahan role/status.
  - Menunggu endpoint user serta kebijakan perubahan role dan status. Kontrak saat ini hanya menyediakan profil pengguna saat ini.

### 4. Scanner dan transaksi (mobile)

- [ ] Scanner kamera (`/scan`) menggunakan `html5-qrcode` atau `zxing-js`.
  - Paket `html5-qrcode` tersedia, tetapi scanner belum dipasang pada halaman. Pemindaian belum dapat mencari data tanpa endpoint lookup barcode/barang.
- [ ] Input barcode manual dan pencarian barang.
  - Menunggu endpoint pencarian barang berdasarkan barcode.
- [ ] Form pinjam dan kembali setelah pemindaian.
  - Menunggu endpoint transaksi peminjaman/pengembalian, data peminjam, status barang, jatuh tempo, dan pilihan kondisi.
- [ ] Alur barang tersedia: pilih peminjam dan tanggal jatuh tempo.
  - Menunggu endpoint peminjaman dan referensi daftar peminjam.
- [ ] Alur barang sedang dipinjam: tampilkan peminjam aktif dan pilih kondisi saat kembali.
  - Menunggu endpoint detail peminjaman aktif dan pengembalian.

Halaman `/pindai` saat ini menjelaskan bahwa fitur belum tersedia karena endpoint pendukung belum ada.

### 5. Pemantauan dan riwayat

- [ ] Peminjaman aktif (`/loans/active`) beserta penanda keterlambatan.
  - Menunggu endpoint daftar peminjaman dan aturan perhitungan keterlambatan.
- [ ] Riwayat barang (`/items/[id]/logs`).
  - Menunggu endpoint log peminjaman dan perubahan kondisi per barang.
- [ ] Riwayat peminjam (`/my-loans`).
  - Menunggu endpoint riwayat berdasarkan pengguna yang sedang masuk dan definisi role peminjam.
- [ ] Laporan (`/reports`, opsional).
  - Belum dikerjakan. Perlu format laporan dan endpoint rekap setelah kebutuhan laporan disepakati.

## Yang belum tersedia pada backend

Menurut [KONTRAK.md](./KONTRAK.md), route aplikasi backend saat ini hanya `GET /health` dan endpoint autentikasi (`register`, `login`, `logout`, `profile`). Belum ada endpoint CRUD inventaris, kategori, pengguna, barcode, transaksi, riwayat, statistik, atau laporan. Endpoint refresh token juga belum tersedia. Item checklist yang memerlukan data tersebut tetap terbuka sampai kontrak API diperbarui dan endpoint backend siap.

## Catatan implementasi

- Role profil ditampilkan sebagai informasi; role belum dipakai untuk otorisasi di frontend maupun backend.
- Dashboard tidak menampilkan angka inventaris statis sebagai data nyata.
- Halaman pindai belum membuka kamera atau memproses transaksi.
- Daftar route dan bentuk respons yang menjadi acuan integrasi ada di [KONTRAK.md](./KONTRAK.md).
