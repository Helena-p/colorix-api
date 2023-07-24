const {
	getAllProducts,
	createProduct,
	getOneProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/productController');
const express = require('express');

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);
router
	.route('/:id')
	.get(getOneProduct)
	.patch(updateProduct)
	.delete(deleteProduct);

module.exports = router;
