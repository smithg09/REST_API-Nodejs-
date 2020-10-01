go = (status, message, body) => {
	return ({
		status: status,
		message: message,
		body: body
	});
}

// Map outgoing response

module.exports = { go };
