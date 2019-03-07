'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');

gulp.task('lint', 
    gulp.series(() =>
        gulp.src(['./api/**/*.js', './config/**/*.js'])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish')
        )
    )
);

gulp.task('test', 
    gulp.series('lint', gulp.parallel(() =>
        gulp.src(['./test/**/**.spec.js'], {read: false})
            .pipe(mocha({timeout: 3000, recursive: true, exit: true}))
            .on('error', console.error),
        // gulp.src('./test/**/*.jest.js')
        //     .pipe(jest({"preprocessorIgnorePatterns": [ "<rootDir>/node_modules/"], "automock": false }))
    ))
);

gulp.task('nodemon', 
    gulp.series((cb) => {
        var started = false;
        return nodemon({ script: 'loader.js' })
            .on('start', () => {
                if (!started) {
                    cb();
                    started = true;
                }
            });
    })
);

gulp.task('default', gulp.series('nodemon', () => { }));