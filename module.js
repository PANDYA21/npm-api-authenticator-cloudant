const jwt = require('jsonwebtoken');
const default_expiration_time = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour

function getToken(msg, secret, callback, exp) {
  return jwt.sign({
    exp: exp || default_expiration_time,
    data: msg
  }, secret, callback);
}

function decodeToken(token, secret, callback) {
	return jwt.verify(token, secret, callback);
}

module.exports = {
	getToken,
	decodeToken
};
