(function (){
  'use strict';


  function permisssionDirective($log, Authorization, PermissionMap, PermissionStrategies) {
    'ngInject';

    return  {
      restrict: "A",
      bindToController: {
        only: '=?permissionOnly',
        except: '=?permissionExcept',
        onAuthorized: '&?permissionOnAuthorized',
        onUnAuthorized: '&?permissionOnUnauthorized'
      },
      controllerAs: 'permission',
      controller: function ($scope, $element) {
        var permission = this;

        $scope.$watchGroup(['permission.only', 'permmission.except'],
          function() {
            try {
              var permissionMap = new PermissionMap({
                only: permission.only,
                except: permission.except
              });

              Authorization
                .authorize(permissionMap)
                .then(function(){
                  onAuthorizedSuccess();
                })
                .catch(function(){
                  onUnAuthorizedAccess();
                });
            } catch (e) {
              onUnAuthorizedAccess();
            }
          });


        function onAuthorizedAccess() {
          if (angular.isFunction(permission.onAuthorized)) {
            permission.onAuthorized()($element);
          } else {
            PermissionStrategies.showElement($element);
          }
        }

        function onUnAuthorizedAccess() {
          if (angular.isFunction(permission.onUnAuthorized)) {
            permission.onUnAuthorized()($element);
          } else {
            PermissionStrategies.hideElement($element);
          }
        }
      }
    }
  }
  angular
    .module('permission')
    .directive('permission', permissionDirective);
}());
