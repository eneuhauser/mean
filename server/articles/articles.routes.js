'use strict';

/**
 * Module dependencies.
 */
var authorization = require('../auth/authorization.controller.js'),
	articles = require('./articles.controller.js');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(articles.list)
		.post(authorization.requiresLogin, articles.create);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(authorization.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(authorization.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
