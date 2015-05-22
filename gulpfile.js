var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var babel = require('gulp-babel');


gulp.task('default', function() {
  gulp.src('src/**/*.es6')
    .pipe(babel({
      blacklist: [
        'es6.forOf',
        'regenerator',
        'es6.arrowFunctions',
        'es6.constants',
        'es6.blockScoping'
      ]
    }))
    .pipe(gulp.dest('dist'));
  gulp.src('src/cache.json')
    .pipe(gulp.dest('dist'));
  plugins.nodemon({
    script: 'dist/app.js',
    ext: 'js',
    env: { DEBUG: 'koa*', NODE_ENV: 'dev' }
  }).on('change', 'test');
});
