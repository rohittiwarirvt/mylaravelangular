'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ui.bootstrap',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$urlRouterProvider', '$stateProvider', function($locationProvider,$urlRouterProvider, $stateProvider) {

  $urlRouterProvider.otherwise('/view1');
}]);
