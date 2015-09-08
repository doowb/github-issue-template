/*!
 * github-issue-template <https://github.com/doowb/github-issue-template>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var assemble = require('assemble');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var connect = require('gulp-connect');
var extname = require('gulp-extname');
var deploy = require('gulp-gh-pages');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

var ngAnnotate = require('browserify-ngannotate');
var browserify = require('browserify');
var debowerify = require('debowerify');
var watchify = require('watchify');

assemble.task('load', function (done) {
  assemble.data('src/data/*.json');
  assemble.layouts('src/templates/layouts/*.hbs');
  assemble.partials('src/templates/partials/*.hbs');
  done();
});

assemble.task('site', ['load'], function(){
  return assemble.src('src/templates/pages/*.hbs')
    .pipe(assemble.renderFile())
    .pipe(extname())
    .pipe(assemble.dest('_gh_pages'))
    .pipe(connect.reload());
});

assemble.task('vendor', function () {
  return assemble.copy(['vendor/**/*'], '_gh_pages/assets/vendor')
    .pipe(connect.reload());
});

assemble.task('assets', function () {
  return assemble.copy('src/assets/styles/**/*.*', '_gh_pages/assets/css')
    .pipe(connect.reload());
});

assemble.task('client', function () {
  // return assemble.copy('src/client/**/*.*', '_gh_pages/assets/js')
  //   .pipe(connect.reload());
  var bundler = browserify({
    entries: ['src/client/app.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: false
  });

  bundler = watchify(bundler);
  bundler.on('update', function () {
    rebundle();
  });

  var transforms = [
    debowerify,
    ngAnnotate,
    'brfs',
    'bulkify'
  ];

  transforms.forEach(function (transform) {
    bundler.transform(transform);
  });

  function rebundle() {
    var stream = bundler.bundle();
    console.log('Rebundle...');

    return stream.on('error', console.error)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      // .pipe(streamify(uglify({
      //   compress: {drop_console: true}
      // })))
      .pipe(sourcemaps.write('./'))
      .pipe(assemble.dest('_gh_pages/assets/js'))
      .pipe(connect.reload());
  };

  return rebundle();
});

assemble.task('deploy', function(){
  return assemble.src('_gh_pages/**/*', {dot: true})
    .pipe(deploy());
});

assemble.task('connect', function () {
  connect.server({
    root: '_gh_pages',
    livereload: true
  });
});

assemble.task('watch', ['default'], function () {
  assemble.watch('src/**/*', ['default']);
});

assemble.task('default', ['site', 'vendor', 'assets', 'client']);
assemble.task('dev', {flow: 'parallel'}, ['connect', 'watch']);
