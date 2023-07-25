const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./../models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
// connect to DB with some settings for deprecation warnings
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful'));

const products = JSON.parse(
	fs.readFileSync(`${__dirname}/colors.json`, 'utf-8')
);

const importData = async () => {
	try {
		await Product.create(products);
		console.log('Successfully imported data');
	} catch (error) {
		console.log(error);
	}
};

const deleteData = async () => {
	try {
		await Product.deleteMany();
		console.log('Data successfully deleted');
	} catch (error) {
		console.log(error);
	}
	process.exit();
};

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
}
