'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('./users.controller.js');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
};
