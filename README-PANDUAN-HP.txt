MAS FINANCE PWA v0.1 — PANDUAN ANDROID

ISI VERSI INI
- Dashboard ringkasan pemasukan/pengeluaran bulan berjalan
- Tambah transaksi pemasukan dan pengeluaran
- Kategori dan tanggal transaksi
- Penyimpanan lokal browser (localStorage)
- Ekspor dan impor backup JSON
- PWA service worker untuk cache/offline setelah dibuka online pertama kali

PENTING
- Data hanya ada di browser/perangkat ini. Jangan hapus data situs sebelum backup.
- Backup JSON berisi data keuangan. Simpan secara pribadi.
- AI, alokasi gaji otomatis, multi-dompet, tagihan, dan investasi belum aktif pada v0.1.
- PWA harus di-host melalui HTTPS untuk instalasi dan service worker. GitHub Pages gratis.

LANGKAH DARI HP ANDROID
1. Unduh ZIP dan ekstrak menggunakan Files/ZArchiver.
2. Buka browser Chrome, masuk ke https://github.com dan buat akun/masuk.
3. Buat repository baru bernama mas-finance. Pilih Public agar GitHub Pages gratis dapat dipakai; jangan unggah data transaksi pribadi ke repository.
4. Pada repository, pilih Add file > Upload files.
5. Unggah ISI folder proyek (index.html, style.css, app.js, manifest.json, sw.js, icon.svg). Jangan unggah folder pembungkusnya saja.
6. Tekan Commit changes.
7. Buka Settings > Pages.
8. Pada Build and deployment, pilih Deploy from a branch.
9. Pilih branch main dan folder /(root), lalu Save.
10. Tunggu proses deployment. Buka alamat https://USERNAME.github.io/mas-finance/ (ganti USERNAME dengan username GitHub).
11. Buka alamat itu di Chrome Android. Tunggu sampai dashboard tampil.
12. Buka menu titik tiga Chrome > Add to Home screen atau Install app.
13. Buka MAS FINANCE dari ikon di layar utama.

MENGGUNAKAN
- Tekan Transaksi > Tambah transaksi.
- Pilih pemasukan/pengeluaran, isi nominal, kategori, tanggal, lalu simpan.
- Menu Data > Ekspor backup untuk menyimpan file JSON.
- Untuk memulihkan, pilih file JSON pada menu Data > Pulihkan data.

TROUBLESHOOTING
- Jika GitHub Pages belum tampil, pastikan Pages memakai main /(root), lalu tunggu beberapa menit dan refresh.
- Jika update kode tidak muncul, tutup aplikasi, buka ulang saat online, atau bersihkan cache aplikasi (jangan hapus data situs sebelum backup).
- Jangan bagikan repository berisi backup transaksi pribadi.
