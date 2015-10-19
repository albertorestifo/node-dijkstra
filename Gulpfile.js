'use strict'

const babel = require('gulp-babel')
const browserify = require('browserify')
const gulp = require('gulp')
const rename = require('gulp-rename')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')

/**
 * Prepares the files for browser usage
 *
 *  - Boundle with browserify
 *  - Transpile with Babel
 *  - Minify with uglify
 */
gulp.task('build', [ 'bundle' ], function () {
  gulp.src('./dist/dijkstra.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('bundle', function () {
  let b = browserify({ entries: './libs/Graph.js' })

  return b.bundle()
    .pipe(source('dijkstra.js'))
    .pipe(gulp.dest('./dist'))
})
