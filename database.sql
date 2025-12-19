CREATE DATABASE db_obat;
USE db_obat;

-- 1. Tabel Users (3 Level: Admin, Gudang, Apoteker)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Petugas Gudang', 'Apoteker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Supplier
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_supplier VARCHAR(100) NOT NULL,
    kontak VARCHAR(50),
    alamat TEXT
);

-- 3. Tabel Lokasi Penyimpanan
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_rak VARCHAR(50) NOT NULL
);

-- 4. Tabel Obat
CREATE TABLE medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_obat VARCHAR(100) NOT NULL,
    jenis_obat VARCHAR(50),
    satuan VARCHAR(20),
    stok INT DEFAULT 0,
    id_supplier INT,
    id_lokasi INT,
    FOREIGN KEY (id_supplier) REFERENCES suppliers(id),
    FOREIGN KEY (id_lokasi) REFERENCES locations(id)
);

-- 5. Tabel Transaksi (Obat Masuk/Keluar)
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_obat INT,
    tipe_transaksi ENUM('Masuk', 'Keluar') NOT NULL,
    jumlah INT NOT NULL,
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT,
    FOREIGN KEY (id_obat) REFERENCES medicines(id),
    FOREIGN KEY (id_user) REFERENCES users(id)
);


-- 1. Dummy Suppliers
INSERT INTO suppliers (nama_supplier, kontak, alamat) VALUES 
('PT Kalbe Farma', '021-897654', 'Kawasan Industri Delta Silicon, Bekasi'),
('Kimia Farma Tbk', '0812-9988-7766', 'Jl. Veteran No.9, Jakarta Pusat'),
('Sanbe Farma', '022-601567', 'Jl. Tamansari No.10, Bandung'),
('Dexa Medica', '021-789012', 'Bintaro Jaya, Tangerang Selatan'),
('Phapros', '024-354123', 'Jl. Simongan No.131, Semarang');

-- 2. Dummy Locations (Rak)
INSERT INTO locations (nama_rak) VALUES 
('Rak A - Antibiotik'), ('Rak B - Analgetik'), ('Rak C - Sirup/Cair'), 
('Rak D - Salep/Topikal'), ('Rak E - Injeksi'), ('Kulkas - Vaksin/Suhu Dingin');

-- 3. Dummy Medicines (Obat)
INSERT INTO medicines (nama_obat, jenis_obat, satuan, stok, id_supplier, id_lokasi) VALUES 
('Amoxicillin 500mg', 'Tablet', 'Strip', 120, 1, 1),
('Paracetamol 500mg', 'Tablet', 'Pcs', 500, 2, 2),
('OBH Combi Plus', 'Sirup', 'Botol', 45, 2, 3),
('Betadine Solution', 'Cair', 'Botol', 30, 5, 3),
('Amlodipine 10mg', 'Tablet', 'Strip', 8, 3, 2), -- Stok Kritis
('Cefixime 100mg', 'Kapsul', 'Strip', 60, 4, 1),
('Salep Pi Kang Shuang', 'Salep', 'Tube', 15, 3, 4),
('Neurobion Forte', 'Tablet', 'Strip', 100, 1, 2),
('Insulin Lantus', 'Injeksi', 'Vial', 5, 4, 6), -- Stok Kritis
('Sanmol Drop', 'Cair', 'Botol', 25, 3, 3);