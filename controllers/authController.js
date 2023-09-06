const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

// utility jwt sign function
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		role: req.body.role,
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

exports.protect = catchAsync(async (req, res, next) => {
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
	// store current user with its user role in the request body
	req.user = currentUser;
	next();
});

// use a wrapper fn to be able to send params to middleware
exports.restrictTo = (...roles) => {
	return (req, _, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You have no permission to perform this action',
					403
				)
			);
		}
		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(
			new AppError('There is no user with this email address', 404)
		);
	}
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/resetPassword/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 minutes).',
			message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email.',
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an error sending the email. Please, try again later.',
				500
			)
		);
	}

	next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// to compare tokens we need to encrypt the user reset token first
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(new AppError('Token is invalid or have expired.', 400));
	}
	// update password, but don't store resetToken or expire date in db
	user.password = req.body.password;
	user.passwordRepeat = req.body.passwordRepeat;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	// validate and save new password
	await user.save();
	// log user in
	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});

	next();
});
