(function(){
  'use strict';


  function RoleFactory($q, TransitionProperties){
    'ngInject';

    function Role( roleName, validationFunction) {
      validateConstructor(roleName, validationFunction);
      this.roleName = roleName;
      this.validationFunction = validationFunction
    }

    // To do after RoleStore.js
    Role.prototype.validateRole = function () {
      if (angular.isFunction(this.validationFunction)) {
        var validationResult = this.validationFunction.call(null, this.roleName, TransitionProperties);
        if (!angular.isFunction(validationResult.then)) {
          validationResult = wrapInPromise(validationResult, this.roleName);
        }
        return validationResult;
      }

      if (angular.isArray(this.validationFunction)) {
        var promises = this.validationFunction.map(function(permissionName) {
          if(PermissionStore.hasPermissionDefinition(permissionName)) {
            var permission = PermissionStore.getPermissionDefinition(permissionName);
            return permission.validatePermission();
          }
          $q.reject(permissionName);
        });

        return $q.all(promises);
      }


    }

    function wrapInPromise(result, roleName) {
      var dfd = $q.defer();
      if (result) {
        dfd.resolve(roleName);
      } else {
        dfd.reject(roleName);
      }
      return dfd.promise;
    }

    function validateConstructor(roleName, validationFunction) {
      if (!angular.isString(roleName)) {
        throw new TypeError('Parameter "roleName" must be String');
      }

      if (!angular.isArray(validationFunction) && !angular.isFunction(validationFunction)) {
        throw new TypeError('Parameter "validationFunction" must be an array or string');
      }
    }

    return Role;
  }

  angular
    .module('permission')
    .factory('Role', RoleFactory);

}());
