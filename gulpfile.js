const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();

function scssTask () {
  return src('src/scss/style.scss', { sourcemaps: true })
  .pipe(sass())
  .pipe(postcss([cssnano()]))
  .pipe(autoprefixer({
    browsers: ['last 99 versions'],
    cascade: false
  }))
  .pipe(dest('dist', { sourcemaps: '.' }));
}

function jsTask () {
  return src('src/js/scripts.js', { sourcemaps: true })
  .pipe(terser())
  .pipe(dest('dist', { sourcemaps: '.' }));
}

function browsersyncServe (cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload (cb) {
  browsersync.reload();
  cb();
}

function watchTask () {
  watch('*.html', browsersyncReload);
  watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

exports.default = series (
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask,
);