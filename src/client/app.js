'use strict';

var angular = require('angular');
require('angular-clipboard');
require('./controllers');

angular.element(document).ready(function () {
  var requires = ['angular-clipboard', 'app.controllers'];
  window.app = angular.module('github-issue-template', requires);

  angular.bootstrap(document, ['github-issue-template']);
});
