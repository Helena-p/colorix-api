const express = require('express');
const productRouter = require('./routes/productRoutes');
const app = express();

app.use(express.json());

app.use('/api/v1/products', productRouter);
// handle non-existing routes for all HTTP methods (GET, POST ...)
app.all('*', (req, res, next) => {
	res.status(404).json({
		status: 'fail',
		message: `Cannot find ${req.originalUrl} on this server`,
	});
	next();
});
module.exports = app;
