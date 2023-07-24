const mongoose = require('mongoose');
const Product = require('./models/productModel');
const dotenv = require('dotenv');
const app = require('./app');

const testProd = new Product({
	name: 'Yellow',
	price: 800,
});

testProd
	.save()
	.then((document) => {
		console.log(document);
	})
	.catch((error) => console.log(error));

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
