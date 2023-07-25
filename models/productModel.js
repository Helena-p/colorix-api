const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A product must have a name'],
		unique: true,
		trim: true,
		maxlength: [
			50,
			'A product must have less or equal to 30 characters, got {VALUE}',
		],
		minlength: [
			8,
			'A product must have above or equal to 8 characters, got {VALUE}',
		],
	},
	supplier: {
		type: String,
		default: 'Colorix',
		maxlength: [
			30,
			'A name must have less or equal to 30 characters, got {VALUE}',
		],
		minlength: [
			5,
			'A name must have above or equal to 5 characters, got {VALUE}',
		],
	},
	description: {
		type: String,
		trim: true,
	},
	category: {
		type: String,
		required: [true, 'A product category must be specified'],
		enum: {
			values: ['watercolor', 'acrylic', 'oil'],
			message:
				'{VALUE} is not supported, either watercolor, acrylic or oil',
		},
	},
	price: {
		type: Number,
		required: [true, 'Please provide a price per unit'],
	},
	volume: {
		type: Number,
		required: [true, 'Please provide a volume in ml'],
		max: [1000, 'Please provide a valid volume in ml'],
	},
	units: {
		type: Number,
		default: 1,
	},
	multipack: {
		type: Boolean,
		default: false,
	},
	image: {
		type: String,
		// TODO add required property for cover image
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
