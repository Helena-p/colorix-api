const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name for the account'],
		maxlength: [
			100,
			'A name must have less or equal to 100 characters, got {VALUE}',
		],
		minLength: [
			5,
			'A name must have more or equal to 5 characters, got {VALUE}',
		],
		trim: true,
		validate: /^[A-Za-z\s]*$/,
	},
	email: {
		type: String,
		required: [true, 'Please provide an email address'],
		trim: true,
		lowercase: true,
		unique: [true, 'A user already exist with this email'],
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	password: {
		type: String,
		trim: true,
		required: [true, 'Please provide a password'],
		minlength: 8,
		select: false,
	},
	passwordRepeat: {
		type: String,
		trim: true,
		required: [true, 'User password do not match'],
		validate: {
			message: 'Passwords do not match',
			validator: function (pw) {
				return pw === this.password;
			},
		},
	},
	passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
	// run only if password was modified
	if (!this.isModified('password')) return next();
	// hash password with the cost of 12 (cpu)
	this.password = await bcrypt.hash(this.password, 12);
	// is only used for validation and unnecessary to store on db, so reset to undefined
	this.passwordRepeat = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
	return isCorrect;
};

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
		return jwtTimestamp < changedTimestamp;
	}
	return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
