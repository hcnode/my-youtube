/**
 * Created by harry on 16/4/21.
 */
var basic = require('express-authentication-basic');

module.exports = function () {
	return basic(function (challenge, callback) {
		if (challenge.username === 'xxx' && challenge.password === 'xxx') {
			callback(null, true, {user: 'admin'});
		} else {
			callback(null, false, {error: 'INVALID_PASSWORD'});
		}
	})
}