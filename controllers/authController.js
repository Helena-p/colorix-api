const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// utility jwt sign function
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordRepeat: req.body.passwordRepeat,
		passwordChangedAt: req.body.passwordChangedAt,
	});
	// on signup, log user in by sending token to client
	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
	next();
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) check password and email exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}
	// 2) check if user exist and password is correct
	const user = await User.findOne({ email }).select('+password');
	// only run correctPassword fn if user exist
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}
	// 3) if ok send token to client
	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
	next();
});

exports.protect = catchAsync(async (req, _, next) => {
	// verify user is logged in by checking for token in req header
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Please log in to get access', 401));
	}
	// verify token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	// check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token, no longer exist.',
				401
			)
		);
	}
	// check that user hasn't modified password after token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				'User recently changed the password. Please log in again.',
				401
			)
		);
	}
	req.user = currentUser;
	next();
});
