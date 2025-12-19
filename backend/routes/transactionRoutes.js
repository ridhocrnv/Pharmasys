const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Petugas Gudang dan Admin bisa mencatat transaksi
router.post('/', verifyToken, authorizeRole(['Admin', 'Petugas Gudang']), transactionController.createTransaction);

module.exports = router;