var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*','main-*']
});

var paths = {
  scripts: './**/*.js',
  sass: './**/*.scss',
  html: './**/*.html'
};

gulp.task('bower', require('./tasks/bower')(gulp, plugins));
gulp.task('clean', require('./tasks/clean')(gulp, plugins));
gulp.task('watch', require('./tasks/watch')(gulp, plugins,paths));
gulp.task('docco', require('./tasks/docco')(gulp, plugins));
// Default Task
gulp.task('default', ['clean','bower']);
