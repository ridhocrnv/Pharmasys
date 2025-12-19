// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// IZINKAN Petugas Gudang di sini!
router.get('/history', 
    verifyToken, 
    authorizeRole(['Admin', 'Apoteker', 'Petugas Gudang']), // TAMBAHKAN Petugas Gudang
    reportController.getTransactionHistory
);

// Jika gudang juga perlu melihat ringkasan stok di dashboard, izinkan juga di sini
router.get('/inventory', 
    verifyToken, 
    authorizeRole(['Admin', 'Apoteker', 'Petugas Gudang']), 
    reportController.getInventoryReport
);

module.exports = router;