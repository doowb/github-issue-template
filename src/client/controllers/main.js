'use strict';

var controllersModule = require('./');
var issue = require('helper-issue');

/**
 * @ngInject
 */
function MainCtrl($scope, $location, $q) {
  $scope.ctx = {};
  populate('owner');
  populate('repo');
  populate('title');
  populate('body');

  $scope.generate = function () {
    if (typeof $scope.ctx.owner === 'string' && typeof $scope.ctx.repo === 'string') {
      return issue(clone($scope.ctx));
    }
    return '';
  };

  function populate (prop) {
    if (angular.isString(($location.search())[prop])) {
      $scope.ctx[prop] = ($location.search())[prop];
    }
  }

  function clone(obj) {
    var res = {};
    for (var key in obj) {
      res[key] = obj[key];
    }
    return res;
  }
}

controllersModule.controller('MainCtrl', MainCtrl);
