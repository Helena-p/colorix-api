const express = require('express');
const productRouter = require('./routes/productRoutes');
const AppError = require('./utils/appError');
const app = express();

app.use(express.json());

app.use('/api/v1/products', productRouter);
// handle non-existing routes for all HTTP methods (GET, POST ...)
app.all('*', (req, _, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use((err, _, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
	next();
});

module.exports = app;
