'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    server = require( 'gulp-develop-server'),
    karma = require('karma').server,
    mocha = require('gulp-mocha'),
    gulpProtractor = require('gulp-protractor'),
    protractor = gulpProtractor.protractor,
    webdriverStandalone = gulpProtractor.webdriver_standalone,
    webdriverUpdate = gulpProtractor.webdriver_update,
    livereload = require( 'gulp-livereload'),
    watchFiles = {
        serverViews: ['server/views/**/*.*'],
        serverScripts: ['gulpfile.js', 'config/**/*.js', 'server/*.js', 'server/**/*.js'],
        clientViews: ['client/modules/**/views/**/*.html'],
        clientScripts: ['client/**/*.js', '!client/dist/**'],
        clientStyles: ['./client/**/*.scss', '/client/**/*.css', '!client/dist/**'],
        mochaTests: ['tests/server/**/*.js']
    },
    nowServing = false,
    isDevelopment = (process.env.NODE_ENV !== 'development');

/* ***** RUNNING ***** */

gulp.task('serve', function() {
    if(nowServing) { return; }
    nowServing = true;
    return server.listen({
        path: './server/init.js',
        successMessage: function() {
            console.log('Hello World!!!')
        }
    }, livereload.listen );
});

/* ***** BUILDING ***** */

gulp.task('styles', function() {
    var stream = gulp.src(['client/**/*.scss', '!client/lib/**', '!client/dist/**']);
    console.log('TODO Run CSS Linter');
    if(isDevelopment) { stream = stream.pipe(sourcemaps.init()); }
    stream = stream.pipe(sass()).pipe(concat('application.css'));
    if(isDevelopment) { stream = stream.pipe(sourcemaps.write('./maps')); }
    else { stream = stream.pipe(csso()); }
    return stream.pipe(gulp.dest('client/dist/css'));
});

gulp.task('scripts', function() {
    var stream = gulp.src(['client/**/*.js', '!client/lib/**', '!client/dist/**']);

    console.log('TODO Run JSHint');
    if(isDevelopment) {
        stream = stream.pipe(sourcemaps.init());
    } else {
        stream = stream.pipe(ngAnnotate());
        stream = stream.pipe(uglify());
    }

    // TBD Potentially compile ES6/CoffeeScript/ATScript here

    stream = stream.pipe(concat('application.js'));
    if(isDevelopment) {
        stream = stream.pipe(sourcemaps.write('./maps'));
    }
    return stream.pipe(gulp.dest('client/dist/js'));
});

gulp.task('assets', function() {
   // Need to pull over the bootstrap fonts
   return gulp.src(['client/lib/bootstrap-sass/fonts/*']).pipe(gulp.dest('client/dist/fonts'));
});

gulp.task('clean', function() {
    return gulp.src('client/dist').pipe(clean());
});

gulp.task('build', function(callback) {
    return runSequence('clean', ['styles', 'scripts', 'assets'], callback);
});

/* ***** TESTING ***** */

gulp.task('test:server', function() {
    return gulp.src(['server/init.js'].concat(watchFiles.mochaTests), {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test:client', function(done) {
    return karma.start({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('webdriver:update', webdriverUpdate);

gulp.task('test:integration', ['serve', 'webdriver:update'], function() {
    return gulp.src('tests/integration/**/*.js')
        .pipe(protractor({
            configFile: 'tests/protractor.conf.js'
        }))
        .on('error', function(e) {
            throw e;
        });
});

gulp.task('test', ['test:client', 'test:server', 'test:integration']);

/* ***** WATCHING ***** */

gulp.task('watch:server', ['serve'], function() {
    function restart(file) {
        server.changed(function(error) {
            if(error) { return; }
            livereload.changed( file.path );
        });
    }
    gulp.watch(watchFiles.serverScripts).on('change', restart);
});

gulp.task('watch:client', ['build'], function() {
    function restart( file ) {
        livereload.changed(file.path);
    }

    gulp.watch(watchFiles.clientStyles, ['styles']);
    gulp.watch(watchFiles.clientScripts, ['scripts']).on('change', restart);
});

gulp.task('watch', ['watch:server', 'watch:client']);

gulp.task('default', ['watch']);
