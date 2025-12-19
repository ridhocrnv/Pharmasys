// backend/controllers/reportController.js
const db = require('../config/db');

exports.getInventoryReport = async (req, res) => {
    try {
        // Laporan stok kritis (stok < 10) atau semua stok
        const [rows] = await db.execute(`
            SELECT m.nama_obat, m.stok, m.satuan, l.nama_rak, s.nama_supplier 
            FROM medicines m
            JOIN locations l ON m.id_lokasi = l.id
            JOIN suppliers s ON m.id_supplier = s.id
            ORDER BY m.stok ASC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                t.id, 
                t.tipe_transaksi, 
                t.jumlah, 
                t.tanggal, 
                m.nama_obat, 
                u.username 
            FROM transactions t
            JOIN medicines m ON t.id_obat = m.id
            JOIN users u ON t.id_user = u.id
            ORDER BY t.tanggal DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error SQL History:", err.message);
        res.status(500).json({ error: "Gagal mengambil riwayat transaksi" });
    }
};