/**
 * The project was updated to use Gulp, but this grunt file was updated to the
 * new structure. To be able to run, the following packages need to be added:
{
"dependencies": {
    "grunt-cli": "~0.1.13"
  },
  "devDependencies": {
    "grunt-concurrent": "~1.0.0",
    "grunt-contrib-csslint": "^0.3.1",
    "grunt-contrib-cssmin": "~0.10.0",
    "grunt-contrib-jshint": "~0.10.0",
    "grunt-contrib-uglify": "~0.6.0",
    "grunt-contrib-watch": "~0.6.1",
    "grunt-env": "~0.4.1",
    "grunt-karma": "~0.9.0",
    "grunt-mocha-test": "~0.12.1",
    "grunt-ng-annotate": "~0.4.0",
    "grunt-node-inspector": "~0.1.3",
    "grunt-nodemon": "~0.3.0",
    "load-grunt-tasks": "~1.0.0"
  }
}
 */

'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['server/views/**/*.*'],
		serverJS: ['gruntfile.js', 'config/**/*.js', 'server/**/*.js'],
		clientViews: ['client/modules/**/views/**/*.html'],
		clientJS: ['client/js/*.js', 'client/modules/**/*.js'],
		clientCSS: ['client/modules/**/*.css'],
		mochaTests: ['tests/server/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'client/dist/application.min.js': 'client/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'client/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server/init.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'client/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server/init.js'
			}
		},
		karma: {
			unit: {
				configFile: 'tests/karma.conf.js'
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};
