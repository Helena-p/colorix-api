class DataProcessor {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };
		// console.log(queryObj);
		this.query = this.query.find(queryObj);
		return this;
	}
}

module.exports = DataProcessor;
