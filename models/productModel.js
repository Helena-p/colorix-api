const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: String,
	producer: String,
	price: Number,
	size: Number,
	description: String,
	category: String,
	in_stock: Boolean,
	finish: [String],
	image: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
