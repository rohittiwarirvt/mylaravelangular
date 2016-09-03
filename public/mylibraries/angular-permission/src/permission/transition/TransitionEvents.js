(function(){
  'use strict';

  function TransitionEvents() {
    'ngInject';

    this.broadcastPermissionStartEvent = function() {
      throw new Error('Method broadcastPermissionStartEvent in TransitionEvents interface must be implemented');
    };

    this.broadcastPermissionAcceptedEvent = function() {
      throw new Error('Method broadcastPermissionAcceptedEvent in TransitionEvents interface must be implemented');
    };

    this.broadcastPermissionDeniedEvent = function() {
      throw new Error('Method broadcastPermissionDeniedEvent in TransitionEvents interface must be implementd');
    }
  }

  angular
  .module('permission')
   .service('TransitionEvents', TransitionEvents);
}());
