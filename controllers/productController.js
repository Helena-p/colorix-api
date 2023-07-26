const Product = require('./../models/productModel');

exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({
			status: 'success',
			results: products.length,
			data: {
				products,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: error,
		});
	}
};

exports.createProduct = async (req, res) => {
	try {
		const newProduct = await Product.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				tour: newProduct,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

exports.getOneProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				status: 'fail',
				message: 'Invalid ID',
			});
		}

		res.status(200).json({
			status: 'success',
			data: {
				product,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: error,
		});
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			status: 'success',
			data: {
				product,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};
