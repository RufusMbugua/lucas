var bowerTask = function(gulp,plugins,paths){
  return function () {
    // Watch for changes
      plugins.refresh.listen();
      gulp.watch(paths.scripts, ['scripts']);
      gulp.watch(paths.sass, ['sass']);
      gulp.watch(paths.html, ['scripts']);
    };
}

module.exports = bowerTask;
