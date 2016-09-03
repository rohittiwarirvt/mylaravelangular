(function(){
  'use strict';


  var TransitionEventNames = {
    permissionStart : '$stateChangePermissionStart',
    permissionAccepted : '$stateChangePermissionAccepted',
    permissionDenies : '$stateChangePermissionDenied'
  };

  angular
    .module('permission.ui')
    .value('TransitionEventNames', TransitionEventNames);
}());
