// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct // Check that this matches the controller export
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.post('/', protect, createProduct); // Error happens here if createProduct is undefined
router.get('/:id', getProductById);

module.exports = router;