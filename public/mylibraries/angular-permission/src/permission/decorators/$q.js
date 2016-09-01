(function(){
  'use strict';

  function $q($delegate) {
    'ngInject';

    $delegate.any = any;


    function any(promises) {
      var deferred = $delegate.deferred,
          counter = 0,
          results = angular.isArray(promises) ? [] : {};

      angular.forEach(promises, function ( promise, key) {
        counter++;
        $delegate
          .when(promise)
          .then( function (value) {
            deferred.resolve(value);
          })
          .catch( function (reason) {
            results[key] = reason;
            if (!(--counter)) {
              deferred.reject(reason);
            }
          });
      });

      if (counter === 0) {
        deferred.reject(results);
      }
      return deferred.promise;
    }
    return $delegate;
  }

  angular
    .module('permission')
    .decorator('$q', $q);
})();
