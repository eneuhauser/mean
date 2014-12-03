'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concatJs = require('gulp-concat'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
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
        serverJS: ['gulpfile.js', 'config/**/*.js', 'server/*.js', 'server/**/*.js'],
        clientViews: ['client/modules/**/views/**/*.html'],
        clientJS: ['client/js/*.js', 'client/modules/**/*.js'],
        clientCSS: ['client/modules/**/*.css'],
        mochaTests: ['tests/server/**/*.js']
    },
    del = require('del'),
    nowServing = false,
    isDevelopment = true; // FIXME Make this dynamic

/* ***** RUNNING ***** */

gulp.task('serve', function() {
    if(nowServing) { return; }
    nowServing = true;
    server.listen({
        path: './server/init.js',
        successMessage: function() {
            console.log('Hello World!!!')
        }
    }, livereload.listen );
});

/* ***** BUILDING ***** */

gulp.task('styles', function() {
    var stream = gulp.src(['client/styles/**/*.scss']);
    if(isDevelopment) { stream = stream.pipe(sourcemaps.init()); }
    stream = stream.pipe(sass());
    if(isDevelopment) { stream = stream.pipe(sourcemaps.write('./maps')); }
    else { stream = stream.pipe(csso()); }
    stream.pipe(gulp.dest('client/dist/css'));

    console.log('TODO Run CSS Linter');
    console.log('TODO Compile SASS to CSS');
});

gulp.task('scripts', function() {
    var stream = gulp.src('client/**/*.js');

    console.log('TODO Run JSHint');
    if(isDevelopment) {
        stream = stream.pipe(sourcemaps.init());
    } else {
        stream = stream.pipe(uglify());
    }

    // TBD Potentially compile ES6/CoffeeScript/ATScript here

    stream.pipe(concatJs('application.js'));
    if(isDevelopment) {
        stream = stream.pipe(sourcemaps.write('./maps'));
    }
    stream.pipe(gulp.dest('client/dist/js'));
});

gulp.task('clean', function() {
    del(['client/dist'], { force:true });
});

gulp.task('build', ['styles', 'scripts']);

/* ***** TESTING ***** */

gulp.task('test:server', function() {
    return gulp.src(['server/init.js'].concat(watchFiles.mochaTests), {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test:client', function(done) {
    karma.start({
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
    gulp.watch('./server/**/*.js').on('change', restart);
});

gulp.task('watch:client', ['build'], function() {
    function restart( file ) {
        livereload.changed(file.path);
    }

    gulp.watch(['./client/**/*.css', '/client/**/*.scss'], ['styles']);
    gulp.watch(['./client/**/*.js'], ['scripts']).on( 'change', restart );
});

gulp.task('watch', ['watch:server', 'watch:client']);

gulp.task('default', ['watch']);
