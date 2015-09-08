'use strict';

var angular = require('angular');
require('./controllers');

angular.element(document).ready(function () {
  var requires = ['app.controllers'];
  window.app = angular.module('github-issue-template', requires);

  angular.bootstrap(document, ['github-issue-template']);
});
