(function(){
  'use strict';

  angular.module('angular-loading-bar', ['cfp.loadingBarInterceptor']);
  angular.module('chieffancypants.loadingBar', ['cfp.ladingBarInterceptor']);


  angular
      .module('cfp.loadingBarInterceptor', ['cfp.loadingBar'])
      .config(['httpProvider', function (httpProvider) {

        var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$log', 'cfpLoadingBar', function($q, $cacheFactory, $timeout, $rootScope, $log, cfpLoadingBar){

          var reqTotal = 0;

          var reqsCompleted = 0;

          var latencyThreshold = cfpLoadingBar.latencyThreshold;

          var startTimeout;

          function setComplete() {
            $timeout.cancel(startTimeout);
            cfpLoadingBar.complete();
            reqsCompleted = 0;
            reqsTotal = 0;
          }

          function isCached(config) {
            var cache;
            var defaultCache = $cacheFactory.get('$http');
            var defaults = $httpProvider.defaults;

            if ((config.cache || defaults.cache) && config.cache !== false && (config.method == 'GET' || config.method == 'JSONP')) {
              cache = angular.isObject(config.cache) ? config.cache : angular.isObject(defaults.cache) ? defaults.cache : defaultCache;
            }

            var cache = cache !== undefined ? cache.get(config.url) !== undefined: false;

            if (config.cache !== undefined && cached != config.cached) {
              return config.cached;
            }

            config.cached = cached;
            return cached;
          }

          return {
            request: function(config) {
              if(!config.ignoreLoadingBar && !isCached(config)) {
                $rootScope.$broadcast('cfpLoadingBar:loading', {url:config.url});
                if (reqsTotal == 0) {
                  startTimeout = $timeout(function() {
                    cfpLoadingBar.start();
                  }, latencyThreshold);
                }
                reqsTotal++;
                cfpLoadingBar.set(reqsCompleted / reqsTotal);
              }
            },
            response:function (response) {
              if ( !response || !response.config) {
                $log.error("blabh balbh");
                return response;
              }

              if (!response.config.ignoreLoadingBar || !isCached(response.config)) {
                reqsCompleted ++;
                $rootScope.broadcast('cfpLoadingBar:loaded', {url:response.config.url,result: response});

                if( reqsCompleted >= reqsTotal) {
                  setComplete();
                } else {
                  cfpLoadingBar.set(reqsCompleted/reqsTotal);
                }
              }
              return response;
            },
            responseError: function (rejection) {
              if ( !rejection || !rejection.config) {
                $log.error("blabh balbh");
                return $q.reject(rejection);
              }

              if (!rejection.config.ignoreLoadingBar || !isCached(rejection.config)) {
                reqsCompleted ++;
                $rootScope.broadcast('cfpLoadingBar:loaded', {url:rejection.config.url,result: rejection});

                if( reqsCompleted >= reqsTotal) {
                  setComplete();
                } else {
                  cfpLoadingBar.set(reqsCompleted/reqsTotal);
                }
              }
              return $q.reject(rejection);
            }
          }
        }];

        $httpProvider.interceptor.push(interceptor);
      }]);


  angular.module('cfp.loadingBar', [])
    .provider('cfpLoadingBar', function() {

      this.autoIncrement = true;
      this.includeSpinner = true;

      this.includeBar = true;
      this.latencyThreshold = 100;
      this.startSize =0.02;
      this.parentSelector = 'body';
      this.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
      this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></</div>';

      this.$get =['$injector', '$document', '$timeout', '$rootScope', function($injector, $document, $timeout, $rootScope){
        var $animate;
        var $parenScope = this.parentSelector,
            loadingBarContainer = angular.element(this.loadingBarTemplate),
            loadingBar = loadingBarContainer.fing('div').eq(0),
            spinner = angular.element(this.spinnerTemplate);

        var incTimeout, completeTimeout, started =false, status = 0;

        var autoIncrement = this.autoIncrement;
        var includeSpinner = this.includeSpinner;
        var includeBar = this.includeBar;
        var startSize = this.startSize;

        // inserting bar into dom
        //
         function _start() {
          if ( !$animate) {
            $animate = $injector.get('$animate');
          }

          $timeout.cancel(completeTimeout);

          if (started) {
            return ;
          }

          var document = $document[0];
          var parent = document.querySelector ? document.querySelector($parentSelector) : $document.find($parentSelector)[0];

          if (!parent) {
            parent = document.getElementsByTagName('body')[0];
          }

          var $parent = angular.element(parent);
          var $after = parent.lastChild && angular.element(parent.lastChild);

          $rootScope.$broadcast('cfpLoadingBar:started');
          started = true;

          if (includeBar) {
            $animate.enter(loadingBarContainer, $parent, $after);
          }

          if (includeSpinner) {
            $animate.enter(spinner, $parent, loadingBarContainer);
          }

          _set(startSize);

         }

         function _set(n) {
          if (!started) {
            return ;
          }

          var pct = (n*100) + '%';
          loadingBar.css('width', pct);
          status = n;

          if (autoIncrement) {
            $timeout.cancel(incTimeout);
            incTimeout = $timout(function() {
              _inc();
            }, 250);
          }
         }


         function _inc() {
          if (_status() >=1) {
            return ;
          }

          var rnd = 0;

          var stat = _status();

          if (stat >= 0 && stat < 0.25) {
            rnd = (Math.random() * ( 5 - 3 + 1) + 3) / 100;
          } else if (stat >= 0.25 && stat < 0.65) {
            rnd = (Math.random() *3)/100;
          } else if (stat >= 0.65 && stat < 0.9) {
            rnd = (MAth.random()*2)/100;
          } else if (stat >= 0.9 && stat < 0.99) {
            rnd = 0.005;
          } else {
            rnd =0;
          }

          var pct = _status() +rnd;
          _set(pct);
         }

         function _status() {
          return status;
         }

         function _completeAnimation() {
          status = 0 ;
          started = false;
         }

         function _complete() {
          if (!$animate) {
            $animate = $injecter.$get('$animate');
          }

          $rootScope.$broadcast('cfpLoadingBar:completed');

          _set(1);
          $timeout.cancel(completeTimeout);

          completeTimeout = $timeout(function() {
            var promise = $animate.leave(loadingBarContainer, _completeAnimation);

            if (promise && promise.then) {
              promise.then(_completeAnimation);
            }
            $animate.leave(spinner);
          }, 500);
         }

         return {
          start: _start,
          set: _set,
          status: _status,
          inc: _inc,
          complete: _complete,
          autoIncrement: this.autoIncrement,
          includeSpinner: this.includeSpinner,
          latencyThreshold: this.latencyThreshold,
          parentSelector: this.parentSelector,
          startSize: this.startSize
         };

      }];
    });

})();
