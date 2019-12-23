go = (status, message, body) => {
	return ({
		status: status,
		message: message,
		body: body
	});
}

module.exports = { go };