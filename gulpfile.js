const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');

gulp.task('js:dev', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(replace('process.env.DEBUG', 'true'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
  return gulp.src('dist/').pipe(clean());
});

gulp.task('copy', () => {
  return gulp
    .src(['src/**/*.json', 'src/**/*.wxss', 'src/**/*.wxml'])
    .pipe(gulp.dest('dist'));
});

gulp.task('dev:pre', gulp.series('clean', 'js:dev', 'copy'));

gulp.task('watch', () => {
  return gulp.watch('src/**/*.js', gulp.task('js:dev'));
});

gulp.task('dev', gulp.series('dev:pre', 'watch'));

gulp.task('js:prod', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(replace('process.env.DEBUG', 'false'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('prod', gulp.series('clean', gulp.parallel('js:prod', 'copy')));
