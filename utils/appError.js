class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		// differentiate between programmatical & operational errors
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
