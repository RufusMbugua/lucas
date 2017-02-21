var bowerTask = function(gulp,plugins){
  return function () {
    gulp.src('public/libs', {
          read: false
        })
        .pipe(plugins.clean());
  }
}

module.exports = bowerTask;
