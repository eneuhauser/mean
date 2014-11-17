'use strict';

module.exports = {
	app: {
		title: 'MEAN.JS',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'client/lib/bootstrap/dist/css/bootstrap.css',
				'client/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'client/lib/angular/angular.js',
				'client/lib/angular-resource/angular-resource.js',
				'client/lib/angular-animate/angular-animate.js',
				'client/lib/angular-ui-router/release/angular-ui-router.js',
				'client/lib/angular-ui-utils/ui-utils.js',
				'client/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'client/modules/**/css/*.css'
		],
		js: [
			'client/config.js',
			'client/application.js',
			'client/modules/*/*.js',
			'client/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'client/lib/angular-mocks/angular-mocks.js',
			'client/modules/*/tests/*.js'
		]
	}
};
