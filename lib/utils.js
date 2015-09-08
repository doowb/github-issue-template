'use strict';


var async = require('async');
var utils = module.exports = {};

utils.parallel = function (streams, done) {
  var fns = streams.map(function (stream) {
    return function (next) {
      if (typeof stream === 'function') {
        stream = stream();
      }
      stream
        .once('error', next)
        .once('end', next);
    };
  });
  async.parallel(fns, done);
};

utils.series = function (streams, done) {
  var fns = streams.map(function (stream) {
    return function (next) {
      if (typeof stream === 'function') {
        stream = stream();
      }
      stream
        .once('error', next)
        .once('end', next);
    };
  });
  async.series(fns, done);
};

utils.copy = function (assemble) {
  return function (src, dest) {
    return function () {
      return assemble.copy(src, dest);
    };
  };
};
