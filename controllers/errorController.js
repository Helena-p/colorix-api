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
		console.err('Error', err);
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
		sendProductionError(err, res);
	}

	next();
};
