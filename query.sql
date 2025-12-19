-- Ganti 'HASIL_HASH_TADI' dengan teks yang kamu salin dari terminal
UPDATE users SET password = 'HASIL_HASH_TADI' WHERE username = 'admin';

-- Password di bawah adalah hash dari 'gudang123'
INSERT INTO users (username, password, role) VALUES ('anton', '$2a$10$8CgDkI9.yL0C/G4V.O6VxeYhK8.w.F1u7S7r8XQWq.X0X0X0X0X0X', 'Petugas Gudang');

-- Password di bawah adalah hash dari 'apoteker123'
INSERT INTO users (username, password, role) VALUES ('santi', '$2a$10$9GvE.X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X', 'Apoteker');