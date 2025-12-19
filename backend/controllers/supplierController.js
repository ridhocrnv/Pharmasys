// backend/controllers/supplierController.js
const db = require('../config/db');

exports.getAllSuppliers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM suppliers');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addSupplier = async (req, res) => {
    const { nama_supplier, kontak, alamat } = req.body;
    try {
        await db.execute('INSERT INTO suppliers (nama_supplier, kontak, alamat) VALUES (?, ?, ?)', 
        [nama_supplier, kontak, alamat]);
        res.status(201).json({ message: "Supplier berhasil ditambahkan" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { nama_supplier, kontak, alamat } = req.body;
    try {
        await db.execute('UPDATE suppliers SET nama_supplier=?, kontak=?, alamat=? WHERE id=?', 
        [nama_supplier, kontak, alamat, id]);
        res.json({ message: "Supplier berhasil diperbarui" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM suppliers WHERE id=?', [id]);
        res.json({ message: "Supplier berhasil dihapus" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};