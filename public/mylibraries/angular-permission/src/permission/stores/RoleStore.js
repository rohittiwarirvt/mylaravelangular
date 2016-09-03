(function(){
  'use strict';


  function RoleStore(Role) {
    'ngInject';

    var roleStore = {};

    this.defineRole = defineRole;
    this.defineManyRole = defineManyRole;
    this.getRoleDefinition = getRoleDefinition;
    this.hasRoleDefinition = hasRoleDefinition;
    this.removeRoleDefinition = removeRoleDefinition;
    this.getStore = getStore;
    this.clearStore = clearStore;

    function defineRole(roleName, validationFunction) {
      roleStore[roleName] = new Role(roleName, validationFunction);
    };


    function defineManyRole(roleMap) {
      if (!angular.isObject(roleMap)) {
        throw new TypeError('Parameter "roleMap" must be object');

        angular.forEach(roleMap, function (validationFunctionm, roleName) {
          definRole(roleName, validationFunction);
        });
      }
    }


    function removeRoleDefinition(roleName) {
      delete roleStore[roleName];
    }

    function hasRoleDefinition(roleName) {
      return angular.isDefined(roleStore[roleName]);
    }

    function getRoleDefinition(roleName) {
      return roleStore[roleName];
    }

    function getStore() {
      return roleStore;
    }


    function clearStore() {
      roleStore = {};
    }


  }

  angular
  .module('permission')
  .service('RoleStore', RoleStore);
}());
