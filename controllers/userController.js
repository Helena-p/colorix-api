const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const DataProcessor = require('./../utils/dataProcessor');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const processedData = new DataProcessor(User.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	const users = await processedData.query;
	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
});

exports.createUser = catchAsync(async (req, res, next) => {
	const newUser = await User.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});

exports.getOneUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new AppError('No user with this id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			user,
		},
	});
});

exports.updateUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return next(new AppError('No user with this id', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			user,
		},
	});
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(new AppError('No user with this id', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
