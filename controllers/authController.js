const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordRepeat: req.body.passwordRepeat,
	});

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
	next();
});
