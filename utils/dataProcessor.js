class DataProcessor {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const { page, sort, limit, fields, ...queryObj } = this.queryString;
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`
		);

		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}
}

module.exports = DataProcessor;
