const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, supplierController.getAllSuppliers);
router.post('/', verifyToken, authorizeRole(['Admin']), supplierController.addSupplier);
router.put('/:id', verifyToken, authorizeRole(['Admin']), supplierController.updateSupplier);
router.delete('/:id', verifyToken, authorizeRole(['Admin']), supplierController.deleteSupplier);

module.exports = router;