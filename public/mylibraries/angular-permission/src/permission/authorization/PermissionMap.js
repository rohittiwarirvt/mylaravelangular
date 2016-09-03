(function(){
  'use strict';


  function PermissionMapFactory($q, TransitionProperties, RoleStore, PermissionStore) {
    'ngInject';

    function PermissionMap(permissionMap) {
      permissionMap = permissionMap || {};

      this.only = normalizeMapProperty(permissionMap.only);
      this.except = normalizeMapProperty(permissionMap.except);
      this.redirectTo = permissionMap.redirectTo;
    }

    PermissionMap.prototype.resolveRedirectState = function (rejectedPermissionName) {
      if (angular.isFunction(this.redirecTo)) {
        return resolveFunctionRedirect(this.redirecTo, rejectedPermissionName);
      }

      if (angular.isObject(this.redirectTo)) {
        return resolveObjectRedirect(this.redirectTo, rejectedPermissionName);
      }

      if (angular.isString(this.redirecTo)) {
        return $q.resolve({
          state: this.redirectTo
        });
      }
    }

    PermissionMap.prototype.resolvePropertyValidity = function(property) {
      return property.map(function(privilegeName){
        if (RoleStore.hasRoleDefinition(privilegeName)) {
           var role = RoleStore.getRoleDefinition(privilegeName);
           return role.validateRole();
        }

        if (PermissionStore.hasPermissionDefinition(privilegeName)) {
          var permission = PermissionStore.getPermissionDefinition(privilegeName);
          return permission.validateRole();
        }

        return $q.reject(privilegeName);
      });
    }

    function resolveFunctionRedirect(redirectFunction, rejectedPermissionName) {
      return $q
              .when(redirectFunction.call(null, rejectedPermissionName, TransitionProperties))
              .then(function (redirectState){
                if (angular.isString(redirectState)) {
                  return {
                    state : redirectState
                  }
                }

                if (angular.isObject(redirectState)) {
                  return redirectState;
                }

                return $q.reject();
              });
    }


    function resolveObjectRedirect(redirectObject, permission) {
      if (!angular.isDefined(redirectObject['default'])) {
        throw new ReferrenceError('When used "redirectTo" as object, property "default" must be defined');
      }

      var redirectState = redirectObject[permission];

      if (!angular.isDefined(redirectState)) {
        redirectState = redirectObject['default'];
      }

      if (angular.isFunction(redirectState)) {
        return resolveFunctionRedirect(redirecState, permission);
      }

      if (angular.isObject(redirectState)) {
        return $q.resolve(redirectState);
      }

      if (angular.isString(redirectState)) {
        return $q.resolve({
          state : redirectState
        })
      }
    }


    function normamizeMapProperty(property) {
      if (angular.isString(property)) {
        return [property];
      }

      if (angular.isArray(property)) {
        return property;
      }

      if (angular.isFunction(property)) {
        return property.call(null, TransitionProperties);
      }
    }
  }

  angular
    .module('permission')
    .factory('PermissionMap', PermissionMapFactory);

}());
