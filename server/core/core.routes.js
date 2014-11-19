'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('./core.controller.js');
	app.route('/').get(core.index);
};
