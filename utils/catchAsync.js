// credited J.Schmedtmann, coding heroes, on refactoring async fn
module.exports = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((err) => next(err));
	};
};
