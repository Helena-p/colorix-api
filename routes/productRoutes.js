const {
	getAllProducts,
	createProduct,
	getOneProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/productController');
const { protect, restrictTo } = require('./../controllers/authController');
const express = require('express');

const router = express.Router();

router
	.route('/')
	.get(getAllProducts)
	.post(protect, restrictTo('admin'), createProduct);
router
	.route('/:id')
	.get(getOneProduct)
	.patch(protect, restrictTo('admin'), updateProduct)
	.delete(protect, restrictTo('admin'), deleteProduct);

module.exports = router;
