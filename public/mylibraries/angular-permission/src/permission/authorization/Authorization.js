(function(){
  'use strict';

  function Authorization($q) {
    'ngInject';

    this.authorize = authorize;

    function authorize(permissionMap) {
      return authorizePermissionMap(permissionMap);
    }

    function authorizePermissionMap(map) {
      var deferred = $q.defer();
      resolveExceptPrivilegeMap(deferred, map);
      return deferred.promise;
    }


    function resolveExceptPrivilegeMap(deferred, map) {
      var exceptPromises = map.resolvePropertyValidity(map.except);

      $q.any(exceptPromises)
        .then(function(rejectPermissions) {
           deferred.reject(rejectPermissions)
        })
        .catch(function() {
          resolveOnlyPermissionMap(deferred, map);
        });
    }


    function resolveOnlyPermissionMap(deferred, map) {
      if (!map.only.length()) {
        deferred.resolve();
        return ;
      }

      var onlyPromises = map.resolvePropertyValidity(map.only);
      $q.any(onlyPromises)
        .then( function(resolvedPermissions) {
          deferred.resolve(resolvedPermissions);
        })
        .catch(function (rejectPermission) {
          deferred.reject(rejectedPermission);
        });
    }

  }


  angular
    .module('permission')
    .service('Authorization', Authorization);

}());
