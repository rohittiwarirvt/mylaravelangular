(function(){
  'use strict';


  function RoleFactory(){
    'ngInject';

    function Role( roleName, validationFunction) {
      validateConstructor(roleName, validationFunction);
      this.roleName = roleName;
      this.validationFunction = validationFunction
    }

    // To do after RoleStore.js
    Role.prototype.validateRole = function () {

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
  }

  angular
    .module('permission')
    .factory('Role', RoleFactory);

})();
