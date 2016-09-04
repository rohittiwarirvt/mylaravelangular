(function(){
  'use strict';

  MenuFactory.$injector = ['$q'];

  function MenuFactory($q) {
    var menus = {
      headerMenu: headerMenu
    };
    return menus;

    function headerMenu() {
      var menus = [
        { state: "mygharseva-home", text: 'Home' },
        { state: "myaccount", text: 'MyAccount' }
      ];
      return $q.
        when(menus);
    }
  }

  angular
    .module('myApp.mygharseva.home')
    .factory('MenuFactory', MenuFactory);
})();
