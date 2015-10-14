'use strict'

const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const gulp = require('gulp')
const minifyCSS = require('gulp-minify-css')
const sass = require('gulp-sass')
const sourceMaps = require('gulp-sourcemaps')

/**
 * Compile SASS files
 */
gulp.task('style', () => {
  return gulp.src('./style/*.scss')
    .pipe(sourceMaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCSS())
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('./dist/style'))
    .pipe(browserSync.stream())
})

/**
 * Whatch files and serve them with BrowserSync
 */
gulp.task('watch', [ 'style' ], () => {

  gulp.watch('./style/**.scss', [ 'style' ])

  return browserSync.init({ server: './' })
})

gulp.task('dev', [ 'watch' ])

gulp.task('build', [ 'style' ])
