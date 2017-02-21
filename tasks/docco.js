var docco = function(gulp,plugins){
  return function () {
    gulp.src(["./app/**/*.js"])
      .pipe(docco())
      .pipe(gulp.dest('./documentation'))
  }
}

module.exports = docco;
