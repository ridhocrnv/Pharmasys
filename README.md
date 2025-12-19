# 💊 PHARMASYS - Sistem Penyimpanan Obat Modern

![Version](https://img.shields.io/badge/Version-1.0.0-emerald)
![License](https://img.shields.io/badge/Academic-Project-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?logo=tailwind-css)

**PHARMASYS** adalah platform manajemen inventori farmasi digital yang dirancang untuk meningkatkan akurasi data stok obat, memantau mutasi barang, dan mempermudah pelaporan. Proyek ini dibangun dengan arsitektur **Fullstack JavaScript** menggunakan database relasional.


---

## 🚀 Fitur Utama Berdasarkan Role

Aplikasi ini menggunakan sistem **Multi-Level User** untuk menjaga keamanan data:

### 1. 🛡️ Admin (Akses Penuh)
* **Dashboard Analytics:** Melihat ringkasan stok dan statistik sistem.
* **Master Data Obat:** Mengelola data obat (Tambah, Edit, Hapus).
* **Master Data Supplier:** Mengelola data kemitraan dengan pemasok.
* **Laporan Komprehensif:** Mengakses riwayat transaksi dan status stok.

### 2. 📦 Petugas Gudang (Logistik)
* **Mutasi Obat:** Mencatat "Obat Masuk" dan "Obat Keluar".
* **Riwayat Transaksi:** Memantau log aktivitas transaksi logistik secara real-time.
* **Cek Stok:** Melihat ketersediaan obat untuk keperluan distribusi.

### 3. 👩‍⚕️ Apoteker (Monitoring)
* **Laporan Inventori:** Memantau status stok (Tersedia vs Kritis).
* **Export Data:** Mengunduh laporan stok dalam format **CSV** untuk keperluan manajemen.

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend** | Vue.js 3 (Vite), Tailwind CSS v3 |
| **Backend** | Express.js (Node.js) |
| **Database** | MySQL (Ubuntu Local Server) |
| **UI Icons** | FontAwesome 6 (Stable) |
| **Notifications** | SweetAlert2 |
| **Authentication** | JSON Web Token (JWT) & Bcryptjs |

---

## 📂 Struktur Folder Proyek
```text
Manajemen-Obat/
├── backend/                # Server-side logic (MVC)
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic handler
│   ├── middleware/         # Auth & Role guards
│   ├── routes/             # API Endpoints definition
│   └── .env                # Environment variables
└── frontend/               # Client-side (Single Page Application)
    ├── src/
    │   ├── api/            # Axios instance & Interceptors
    │   ├── components/     # Reusable components (Sidebar)
    │   ├── views/          # Main page views
    │   └── router/         # Vue Router configurations
    └── tailwind.config.js  # Tailwind CSS configuration
```
---

# ⚙️ Panduan Instalasi
## 1. Persiapan Database
Jalankan perintah berikut di terminal MySQL untuk membuat skema dasar:
```
CREATE DATABASE db_obat;
USE db_obat;

-- Pastikan tabel users, medicines, suppliers, locations, 
-- dan transactions telah terbuat sesuai skema awal.
```
## 2. Konfigurasi Backend
```
cd backend
npm init -y
npm install express mysql2 dotenv jsonwebtoken bcryptjs cors
npm install --save-dev nodemon
```

Buat file .env dan sesuaikan dengan konfigurasi MySQL Anda:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_obat
JWT_SECRET=rahasia_sangat_kuat_123
```

Jalankan server:
```
npx nodemon index.js
```

## 3. Konfigurasi Frontend
```
cd ../frontend
npm install
npm install axios sweetalert2 vue-router
npm run dev
```

Instalasi Tailwind CSS v3 (Stable):
```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```


# 🔑 Akun Login Uji Coba
Semua password default adalah: 123456

Cara Hash Password Lewat Terminal Menggunakan Node.js:
```
node -e "console.log(require('bcryptjs').hashSync('123456', 10))"
```

* Admin: admin

* Petugas Gudang: gudang

* Apoteker: apoteker

---

# 🛡️ Keamanan & Validasi
<strong> 1. JWT Authentication:</strong> Semua request ke database dilindungi oleh Token yang disimpan di LocalStorage.

<strong> 2. Navigation Guard:</strong> User tidak dapat mengakses halaman yang bukan hak aksesnya (Contoh: Gudang tidak bisa masuk ke menu Admin).

<strong> 3. Stock Validation:</strong> Sistem secara otomatis menolak transaksi "Obat Keluar" jika jumlahnya melebihi stok yang tersedia.

<strong> 4. UI Interactivity:</strong> Menggunakan SweetAlert2 untuk konfirmasi penghapusan data dan notifikasi sukses/gagal.

---



#### © 2025 PHARMASYS - Tugas Akhir Basis Data