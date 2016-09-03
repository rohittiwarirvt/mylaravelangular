(function(){
  'use strict';

  var PermissionStrategies = {
    enableElement: function($element) {
      $element.removeAttr('disabled');
    },
    disableElement: function($element) {
      $element.attr('disabled','disabled');
    },
    showElement: function($element) {
      $element.removeClass('ng-hide');
    },
    hideElement: function($element) {
      $element.addClass('ng-hide');
    }
  };

  angular
    .module('permission')
    .constant('PermissionStrategies', PermissionStrategies);
}());
