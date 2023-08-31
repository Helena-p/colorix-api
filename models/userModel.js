const mongoose = require('mongoose');
const validator = require('validator');

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
	password: {
		type: String,
		trim: true,
		required: [true, 'Please provide a password'],
		minlength: 8,
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
});

const User = mongoose.model('User', userSchema);
module.exports = User;
