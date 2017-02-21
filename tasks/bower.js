var bowerTask = function(gulp,plugins){
  return function () {
      gulp.src(plugins.mainBowerFiles(), {
        base: './bower_components'
      })
      .pipe(plugins.bowerNormalize({
        bowerJson: './bower.json',
        flatten: true
      }))
      .pipe(gulp.dest('public/libs'))
  }
}
module.exports = bowerTask;
