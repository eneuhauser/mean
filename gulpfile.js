'use strict';

var gulp = require('gulp'),
    server = require( 'gulp-develop-server'),
    livereload = require( 'gulp-livereload' );

/* ***** RUNNING ***** */

gulp.task('serve', function() {
    // FIXME Test if the server is already running
    server.listen( { path: './server/init.js' }, livereload.listen );
});

/* ***** BUILDING ***** */

gulp.task('styles', function() {
    console.log('TODO Run CSS Linter');
    console.log('TODO Compile SASS to CSS');
});

gulp.task('scripts', function() {
    console.log('TODO Run JSHint');
    console.log('TODO Uglify frontend if not development');
});

gulp.task('build', ['styles', 'scripts']);

/* ***** TESTING ***** */

gulp.task('test:unit', function() {
    console.log('TODO Run Karma tests');
});

gulp.task('test:e2e', function() {
    console.log('TODO Run Protractor tests');
});

gulp.task('test', ['test:unit', 'test:e2e']);

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
