const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const autoPrefixer = require('gulp-autoprefixer');
const htmlMin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const img = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const del = require('del');
const browserSync = require('browser-sync').create();

const htmlMinify = () => {
  return src('src/*.html')
  .pipe(htmlMin({
    collapseWhitespace: true
  }))
  .pipe(dest('docs'))
  .pipe(browserSync.stream())
}

const styles = () => {
  return src('src/css/**/*.css')
  .pipe(autoPrefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(dest('docs/css'))
  .pipe(browserSync.stream())
}

const images = () => {
  return(src(['src/img/*.jpg', 'src/img/*.png', 'src/img/*.svg', 'src/img/*.jpeg']))
  .pipe(img())
  .pipe(dest('docs/img'))
  .pipe(browserSync.stream())
}


const scripts = () => {
  return src('src/js/**/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('script.js'))
  .pipe(uglify().on('error', notify.onError()))
  .pipe(dest('docs/js'))
  .pipe(browserSync.stream())
}

const plugins = () => {
  return src('src/plugins/**/*')
  .pipe(dest('docs/plugins'))
  .pipe(browserSync.stream())
}

const clean = () => {
  return del(['docs'])
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'docs'
    }
  })
}

watch('src/*.html', htmlMinify);
watch('src/css/**/*.css', styles);
watch('src/js/**/*.js', scripts);
watch('src/plugins/**/*.js', plugins);
watch(['src/img/*.jpg', 'src/img/*.png', 'src/img/*.svg', 'src/img/*.jpeg'], images);

exports.default = series( clean, htmlMinify, styles, scripts, plugins, images, watchFiles );
