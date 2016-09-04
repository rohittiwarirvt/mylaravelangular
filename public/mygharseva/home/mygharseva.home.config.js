(function(){
  'use strict';


  MygharsevaConfig.$injector = ['$stateProvider'];

  function MygharsevaConfig($stateProvider) {
    $stateProvider.state('mygharseva-home', {
      url: "/mygharseva",
      templateUrl: '/mygharseva/home/home.html',
      constroller: 'MgsHomeController',
      controllerAs: 'mgshomectrl'
    });
  }

  angular.module('myApp.mygharseva', ['myApp.mygharseva.home'])
    .config(MygharsevaConfig);

}());
