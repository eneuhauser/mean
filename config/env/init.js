'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
	chalk = require('chalk');

/**
 * Determines if the current environment has a configuration file; otherwise, set NODE_ENV variable to development.
 * @return the value for NODE_ENV.
 */
function checkEnvironment() {
	glob('./config/env/' + process.env.NODE_ENV + '.js', {
		sync: true
	}, function(err, environmentFiles) {
		if (!environmentFiles.length) {
			if (process.env.NODE_ENV) {
				console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
			} else {
				console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
			}

			process.env.NODE_ENV = 'development';
		} else {
			console.log(chalk.black.bgWhite('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'));
		}
	});

	return process.env.NODE_ENV;
}

/**
 * Module init function.
 */
module.exports = checkEnvironment();
