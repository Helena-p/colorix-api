const fs = require('fs');

let products = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/colors.json`)
);

exports.getAllProducts = (req, res) => {
	res.status(200).json({
		status: 'success',
		results: products.length,
		data: {
			products,
		},
	});
};

exports.createProduct = (req, res) => {
	const newID = products[products.length - 1].id + 1;
	const newProduct = { id: newID, ...req.body };

	products = [...products, newProduct];
	fs.writeFile(
		`${__dirname}/../dev-data/colors.json`,
		JSON.stringify(products),
		() => {
			res.status(201).json({
				status: 'success',
				data: {
					colour: newProduct,
				},
			});
		}
	);
};

exports.getOneProduct = (req, res) => {
	const id = parseInt(req.params.id);
	const product = products.find((el) => el.id === id);

	if (!product) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	res.status(200).json({
		status: 'success',
		data: {
			product,
		},
	});
};

exports.updateProduct = (req, res) => {
	console.log(req.body);
	res.send(`Updated product with id: ${req.params.id}`);
};

exports.deleteProduct = (req, res) => {
	res.send(`Deleted product with id: ${req.params.id}`);
};
