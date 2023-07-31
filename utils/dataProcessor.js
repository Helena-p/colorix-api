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

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			// sort by default
			this.query = this.query.sort('category');
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const limitedFields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(limitedFields);
		} else {
			// by default exclude mongoose __v prop
			this.query = this.query.select('-__v');
		}
		return this;
	}
	// pagination
}

module.exports = DataProcessor;
