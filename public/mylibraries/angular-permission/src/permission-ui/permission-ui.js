(function(){
  'use strict';

  function config($stateProvider) {
    'ngInject';
    $stateProvider.decorator('parent', funtion(state, parentFn){
      state.self.$$state = function() {
        return state;
      };

      return parentFn(state);
    });
  }


  function config($rootScope, $state, TransitionProperties, TransitionEvents, StateAuthorization, StatePermissionMap) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      if (!isAuthorizationFinished()) {
          setStateAuthorizationStatus(true);
          setTransitionProperties();

          if (!TransitionProperties.areEventDefaultPrevented()) {
            TransitionEvents.broadcastPermissionStartEvent();
            event.preventDefault();

            var statePermissionMap = new StatePermissionMap(TransitionProperties.toState);

            StatePermissionMap
              .authorize(statePermissionMap)
                .then(function() {
                  handleAuthorizedState();
                })
                .catch(function (rejectedPermission) {
                  handleUnauthorizedState();
                })
                .finally(function () {
                  setStateAuthorizationStatus(false);
                });
          }

      }


      function handleAuthorizedState() {
        TransitionEvents.broadcastPermissionAcceptedEvent();

        var transitionOptions = angular.extend({}, TransitionProperties.options, {notify: false, location: true});

        $state
          .go(TransitionProperties.toState.name, TransitionProperties.toParams, transitionOptions)
          .then(function() {
            TransitionEvents.broadcastStateChangeSuccessEvent();
          });
      }

      function handleUnauthorizedState(rejectedPermission, statePermissionMap) {
        TransitionEvents.broadcastPermissionDeniedEvent();

        statePermissionMap
          .resolvedRedirectState(rejectedPermission)
            .then(function (redirect) {
              $state.go(redirect.state, redirect.params, redirect.options);
            });
      }

      function setTransitionProperties() {
        TransitionProperties.toState = toStatel
        TransitionProperties.toParams = toParams;
        TransitionProperties.fromState = fromState;
        TransitionProperties.fromParams = fromParams;
        TransitionProperties.options = options;
      }


      function setStateAuthorizationStatus(status) {
        angular.extend(toState, {'$$isAuthorizationFinished': status });
      }

      function isAuthorizationFinished() {
        return toState.$$isAuthorizationFinished;
      }

    });
  }


  angular
    .module('permissoin.ui',['permission', 'ui.router'])
    .config(config)
    .run(run);
}());
