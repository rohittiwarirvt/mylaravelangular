(function(){
  'use strict';

  function StateAuthorization($q) {
    'ngInject';

    this.authorize = authorize;

    function authorize(statePermissionMap) {
      return authorizeStatePermissionMap(statePermissionMap);
    }

    function authorizeStatePermissionMap(map) {
      var deferred = $q.defer();
      resolveExceptStatePermissionMap(deferred, map);
      return deferred.promise;
    }


    function resolveExceptStatePermissionMap(deferred, map) {
      var exceptPromises = resolveStatePermissionMap(map.except, map);

      $q.any(exceptPromises)
        .then(function(rejectPermissions) {
           deferred.reject(rejectPermissions)
        })
        .catch(function() {
          resolveOnlyStatePermissionMap(deferred, map);
        });
    }


    function resolveOnlyStatePermissionMap(deferred, map) {
      if (!map.only.length()) {
        deferred.resolve();
        return ;
      }

      var onlyPromises = resolveStatePermissionMap(map.only, map);
      $q.any(onlyPromises)
        .then( function(resolvedPermissions) {
          deferred.resolve(resolvedPermissions);
        })
        .catch(function (rejectPermission) {
          deferred.reject(rejectedPermission);
        });
    }

    function resolveStatePermissionMap(privelegesNames, map) {
      if (!privilegesNames.length) {
        return [$q.reject()];
      }

      return privilegesNames.map(function (statePrivileges) {
        var resolveStatePriviliges = map.resolvePropertyValidity(statePrivileges);
        return $q.any(resolvedStatePrivileges);
      });
    }

  }


  angular
    .module('permission')
    .service('StateAuthorization', StateAuthorization);

}());
