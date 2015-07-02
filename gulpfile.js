var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', function() {
  plugins.nodemon({
    script: 'src/index.es6',
    ext: 'js',
    nodeArgs: ['--debug', '--harmony'],
    env: { DEBUG: '*', NODE_ENV: 'dev' }
  }).on('change', 'test');
});
