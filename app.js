const express = require('express');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const app = express();

app.use(express.json());

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
// handle non-existing routes for all HTTP methods (GET, POST ...)
app.all('*', (req, _, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
