const Product = require('./../models/productModel');
const DataProcessor = require('./../utils/dataProcessor');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllProducts = catchAsync(async (req, res, next) => {
	const processedData = new DataProcessor(Product.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	const products = await processedData.query;
	res.status(200).json({
		status: 'success',
		results: products.length,
		data: {
			products,
		},
	});
});

exports.createProduct = catchAsync(async (req, res, next) => {
	const newProduct = await Product.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			tour: newProduct,
		},
	});
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new AppError('No product with this id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			product,
		},
	});
});

exports.updateProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!product) {
		return next(new AppError('No product with this id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			product,
		},
	});
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);

	if (!product) {
		return next(new AppError('No product with this id', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
