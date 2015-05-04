'use strict';

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')({
    rename: {
      'gulp-6to5': 'to5'
    }
  });

gulp.task('default', function() {
  plugins.nodemon({
    script: 'app.js',
    ext: 'js',
    env: { DEBUG: 'koa*', NODE_ENV: 'dev' }
  }).on('change', 'test');
});
