class HTTPError extends Error {
	constructor(statusCode, message) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}

module.exports = HTTPError;