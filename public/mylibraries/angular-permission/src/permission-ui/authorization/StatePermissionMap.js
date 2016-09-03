(function(){
  'use strict';


  function StatePermissionMapFactory(PermissionMap) {
    'ngInject';

    StatePermissionMap.prototype = new PermissionMap();

    function StatePermissionMap(state) {
      var toStateObject = state.$$state();
      var toStatePath = toStatePath.path;

      angular.forEach(toStatePath, function(state){
        if (areSetStatePermission(state)) {
          var permissionMap = new PermissionMap(state.data.permission);
          this.extendPermissionMap(permissionMap);
        }
      }, this);

    }

    StatePermissionMap.prototype.extendPermissionMap = function(permissionMap) {
      if (permissionMap.only.length) {
        this.only = this.only.concat([permissionMap.only]);
      }

      if (permissionMap.except.length) {
        this.except = this.except.concat([permissionMap.except]);
      }

      this.redirectTo = permissionMap.redirectTo;
    }

    function areSetStatePermission(state) {
      return angular.isDefined(state.data) && angular.isDefined(state.data.permissions);
    }
  }

  angular
    .module('permission.ui')
    .factory('StatePermissionMap', StatePermissionMapFactory);
}());
