'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');

gulp.task('default', ['nodemon'], () => { });

gulp.task('test', ['lint'], () =>
	gulp.src(['./test/**/*.js'], {read: false})
		.pipe(mocha({timeout: 3000, recursive: true, exit: true}))
		.on('error', console.error));

gulp.task('lint', () =>
  gulp.src(['./api/**/*.js', './config/**/*.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('nodemon', (cb) => {
    var started = false;
    return nodemon({ script: 'loader.js' })
        .on('start', () => {
            if (!started) {
                cb();
                started = true;
            }
        });
});