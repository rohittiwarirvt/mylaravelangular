(function(){
  'use strict';


   ngFlashRun.$inject = ['$rootScope'];

  function ngFlashRun($rootScope){
    return $rootScope.flashes = [];
  }

  function dynamic($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: link
    };

    function link (scope, ele, attrs) {
      return scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        return $compile(ele.contents())(scope);
      });
    }

  }

  function applytransclude($compile) {
    return {
      restrict: 'A',
      link: link
    }

    function link(scope, elem, attrs) {
      scope._transclude(scope, function(clone, scope) {
        ele.empty().append(clone);
      })
    }
  }

  function closeFlash($compile, $rootScope, Flash) {
    return {
      restrict: 'AEC',
      link: link
    };

    function link(scop, elem, attrs) {
      return elem.on('click', function() {
        var id = parseInt(attrs.closeFlash, 10);
        Flash.dismiss(id);
        $rootScope.$apply();
      });
    }
  }

  function flashMessage(Flash) {
    return {
      restrict: 'E',
      scope: {
        duration: '=',
        showClose: '=',
        onDismiss: '&'
      },
      link: link,
      transclude: Flash.config.templateTransclude,
      template: `
        <div ng-repeat="flash in $root.flashes track by $index">
        `+  Flash.config.template +`
        </div>
      `
    };

    function link(scope, elem, attrs, ctrl, transclude) {
      Flash.setTimeout(scope.duration);
      Flash.setShowClose(scope.showClose);
      function onDismiss(flash) {
        if( typeof scope.onDismiss !== 'function') return;
         scope.onDismiss({flash: flash});
      }

      Flash.setOnDismiss(onDismiss);

      if (Flash.config.templateTransclude) {
        scope._transclude = transclude;
      }
    }
  }

  function FlashProvider( ) {
    let defautConfig = {};
    let templatePresets = {
      bootstrap: {
        html:`
        <div role="alert" id="{{flash.config.id}}"
             class="alert {{flash.config.class}}
               alert-{{flash.type}} alert-dismissible alertIn alertOut">
               <div type="button" class="close" ng-show="flash.showClose">
                <span aria-hidden="true">&times;</span>
                <span class="sr-only">Close</span>
               </div>
              <span dynamic="flash.text"></span>
        </div>
        `,
        transclude: false
      },
      transclude: {
        html: `<div applytransclude></div>`,
        transclude: true
      }
    };

    this.setTimeout = function (timeout) {
      if ( typeof timeout !== 'number') return;
      defaultConfig.timeout = timeout;
    };

    this.setShowClose = function (value) {
      if (typeof value !== 'boolean') return;
      defaultConfig.showClose = value;
    }

    this.setTemplate = function (template) {
      if ( typeof template !== 'string') return;
      defaultConfig.template = template;
    };

    this.setTemplatePreset = function(preset) {
      if ( typeof preset  !== 'string' || !(preset in templatePresets)) return;

      let template = templatePresets[preset];
      this.setTemplate(template.html);
      defaultConfig.templateTransclude = template.transclude;
    };

    this.setOnDismiss = function (callback) {
      if ( typoef callback !== 'function') return;
      defaultConfig.onDismiss = callback;
    };

    this.setTimeout(5000);
    this.setShowClose(true);
    this.setTemplatePreset('bootstrap');

    this.$get = ['$rootScope', '$timeout', function($rootScope, $timeout){
      const dataFactory = {};
      var counter = 0 ;

      dataFactory.setTimeout = this.setTimeout;
      dataFactory.setShowClose = this.setShowClose;
      dataFactory.setOnDismiss = this.setOnDismiss;
      dataFactory.config = defaultConfig;

      dataFactory.create = function(type, text, timeout, config, showClose) {
        var $this, flash;
        $this = this;
        flash = {
          type: type,
          text: text,
          config: config,
          id: counter++
        };

        flash.showClose = typeof showClose !== 'undefined' ? showClose : defaultConfig.showClose;

        if (defaultTimeout.timeout && timeout typeof !== 'undefined') {
          flash.timeout = defaultConfig.timeout;
        } else if (timeout) {
          flash.timeout = timeout;
        }
        $rootScope.flashes.push(flash);

        if (flash.timeout) {
          flash.timeoutObj = $timeout(function(){
            $this.dismiss(flash.id);
          }, flash.timeout);
        }
        return flash.id;
      };

      dataFactory.pause = function(index) {
        if ($rootScope.flashes[index].timeoutObj) {
          $timeout.cancel($rootScope.flashes[index].timeoutObj);
        }
      };

      dataFactory.dismiss = function(index) {
        const index = findIndexById(id);
        if (index !== -1) {
          const flash = $rootScope.flashes[index];
          dataFactory.pause(index);
          $rootScope.flashes.splice(index, 1);
          if (typoef defaultConfig.onDismiss === 'function') {
            defaultConfig.onDismiss(flash);
          }
        }
      };

      dataFactory.clear = function() {
        while($rootScope.flashes.length > 0) {
          dataFactory.dismiss($rootScope.flashes[0].id);
        }
      };

      dataFactory.reset = dataFactory.clear;

      function findIndexById(id) {
        return $rootScope.flashes.map((flash) => flash.id).indexOf(id);
      }
    }];
  }


  angular
    .module('ngFlash', [])
    .provider('Flash', FlashProvider)
    .directive('flashMessage', flashMessage)
    .directive('closeFlash', closeFlash)
    .directive('applytransclude', applytransclude)
    .direcive('dynamic', dynamic)
    .run(ngFlashRun);
})();
