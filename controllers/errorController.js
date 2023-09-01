const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldErrorDB = (err) => {
	const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value.`;
	return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
	// loop over error array and format as message
	const errors = Object.values(err.errors).map((e) => e.message);
	const message = `Invalid input data: ${errors.join('. ')}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
	new AppError('The token have expired. Please log in again', 401);

const sendDevelopmentError = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendProductionError = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
		// on unknown error, do not leek details to client
	} else {
		console.error('Error', err);
		res.status(500).json({
			status: 'error',
			message: 'Unknown error occured',
		});
	}
};

module.exports = (err, _, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendDevelopmentError(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = Object.assign(err);
		/* 
            set mongoose errors as operational by passing error through apperror class
            and send meaningful error message to client
        */
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidatorErrorDB(error);
		if (error.name === 'JsonWebTokenError') error === handleJWTError();
		if (error.name === 'TokenExpiredError')
			error === handleJWTExpiredError();

		sendProductionError(error, res);
	}

	next();
};
