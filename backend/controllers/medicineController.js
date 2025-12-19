// backend/controllers/medicineController.js
const db = require('../config/db');

// Get All Medicines (Bisa dilihat semua role)
exports.getAllMedicines = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT m.*, s.nama_supplier 
            FROM medicines m 
            LEFT JOIN suppliers s ON m.id_supplier = s.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Medicine (Admin Only)
exports.addMedicine = async (req, res) => {
    const { nama_obat, jenis_obat, satuan, stok, id_supplier, id_lokasi } = req.body;
    try {
        await db.execute(
            'INSERT INTO medicines (nama_obat, jenis_obat, satuan, stok, id_supplier, id_lokasi) VALUES (?, ?, ?, ?, ?, ?)',
            [nama_obat, jenis_obat, satuan, stok || 0, id_supplier, id_lokasi]
        );
        res.status(201).json({ message: "Data obat berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Medicine (Admin Only)
exports.updateMedicine = async (req, res) => {
    const { id } = req.params;
    const { nama_obat, jenis_obat, satuan, id_supplier, id_lokasi } = req.body;
    try {
        await db.execute(
            'UPDATE medicines SET nama_obat=?, jenis_obat=?, satuan=?, id_supplier=?, id_lokasi=? WHERE id=?',
            [nama_obat, jenis_obat, satuan, id_supplier, id_lokasi, id]
        );
        res.json({ message: "Data obat berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Medicine (Admin Only)
exports.deleteMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM medicines WHERE id = ?', [id]);
        res.json({ message: "Data obat berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};