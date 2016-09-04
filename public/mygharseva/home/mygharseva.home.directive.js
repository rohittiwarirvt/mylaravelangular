(function(){
  'use strict';


  // MgsHeader.$injector = ['scope', 'element'];



  mgsHeaderDirective.$injector = ['MenuFactory'];

  function mgsHeaderDirective(MenuFactory) {
    var directive =  {
      restrct: 'AE',
      scope: {},
      replace: true,
      templateUrl: '/mygharseva/home/header.html',
      link: link
    }
    return directive;

    function link(scope, element, attrs) {
       MenuFactory.headerMenu()
          .then(function(result){
            scope.myAccount = result;
          });
    }

  }

  mgsFooterDirective.$injector = [];

  function mgsFooterDirective() {
    var directive =  {
      restrct: 'AE',
      scope: {},
      replace: true,
      templateUrl: '/mygharseva/home/footer.html',
      link: link
    }
    return directive;

    function link(scope, element, attrs) {

    }
  }


  mgsContainerDirective.$injector = [];

  function mgsContainerDirective() {
    var directive =  {
      restrct: 'AE',
      scope: {},
      replace: true,
      templateUrl: '/mygharseva/home/container.html',
      link: link
    }
    return directive;

    function link(scope, element, attrs) {
       MenuFactory.headerMenu()
          .then(function(result){
            scope.myAccount = result;
          });
    }
  }

  angular.module('myApp.mygharseva.home', [])
    .directive('mgsHeader', mgsHeaderDirective)
    .directive('mgsContainer', mgsContainerDirective)
    .directive('mgsFooter', mgsFooterDirective);

})();
