// backend/routes/medicineRoutes.js
const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// SEMUA role yang login (Admin, Gudang, Apoteker) HARUS bisa melihat daftar obat
router.get('/', verifyToken, medicineController.getAllMedicines);

// HANYA Admin yang boleh Tambah, Ubah, Hapus
router.post('/', verifyToken, authorizeRole(['Admin']), medicineController.addMedicine);
router.put('/:id', verifyToken, authorizeRole(['Admin']), medicineController.updateMedicine);
router.delete('/:id', verifyToken, authorizeRole(['Admin']), medicineController.deleteMedicine);

module.exports = router;