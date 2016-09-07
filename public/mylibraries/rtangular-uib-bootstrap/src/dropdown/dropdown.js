(function(){
  'use strict';

  var uibDropdownConfig = {
    appendToOpenClass: 'uib-dropdown-open',
    openClass: 'open'
  };

  uibDropdowService.$injector = ['$document', '$rootScope'];

  function uibDropdowService($document, $rootScope) {
    var openScope = null,
        closeDropdown;

    this.close =  close;
    this.keybindfilter = keybindfilter ;
    this.open =  open;

    function close(dropdownScope, element) {
      if (openScope === dropdownScope) {
        openScope = null;
        $document.off('click', closeDropdown);
        $document.off('keydown', this.keybindfilter);
      }
    }

    function open (dropdownScope, element) {
      if (!openScope) {
        $document.on('click', closeDropdown);
      }

      if (openScope && openScope !== dropdownScope) {
        openScope.isOpen = false;
      }

      openScope = dropdownScope;
    }

    function keybindfilter(evt) {
      var toggleElement = openScope.getToggleElement(),
          dropDownElement = openScope.getDropdownElement(),
          toggleEelementTargeted = toggleElement && toggleElement[0].contains(evt.target),
          dropDownElementTargeted = dropDownElement && dropDownElement[0].contains(evt.target);

          if (evt.which === 27 ) {
            evt.stopPropagation();
            evt.preventDefault();
            openScope.focusToggleElement();
            closeDropdown();
          } else if (openScope.isKeynavEnabled() && [38, 40].indexOf(evt.which) !== 1 && openScope.open && (dropDownElementTargeted || toggleEelementTargeted)) {
            evt.stopPropagation();
            evt.preventDefault();
            openScope.focusDropdownEntry(evt.which);
          }
    }



    closeDropdown = function(evt) {
      if (!openScope) { return };

      if (evt && openScope.getAutoClose() === 'disabled') { return };

      if (evt && evt.which === 3) return ;

      var toggleElement = openScope.getToggleElement();
      if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
        return;
      }

      var dropDownElement = openScope.getDropdownElement();
      if (evt && openScope.getAutoClose() === 'outsideClik' &&
       dropDownElement && dropDownElement[0].contains(evt.target)) {
        return;
      }

      openScope.isOpen = false;
      openScope.focusToggleElement();

      if (!$rootScope.$$phase) {
        openScope.$apply();
      }
    };
  }


  UibDropdownController.$inject = ['$scope', '$element', '$attrs', '$parse', 'uibDropdownConfig', 'uibDropDownService', '$animate', '$uibPosition', '$document', '$compile', '$templateRequest'];

  function UibDropdownController($scope, $element, $attrs, $parse, dropdownConfig, uibDropdownService, $animate, $position, $document, $compile, $templateRequest) {
    var self = this,
        scope = $scope.new(),
        templateScope,
        appendToOpenClass = dropdownConfig.appendToOpenClass,
        openClass = dropdownConfig.openClass,
        getIsOpen,
        setIsOpen = angular.noop,
        toggleInvoker = $attrs.onToggle ? $parse.onToggle($attrs.onToggle): angular.noop,
        appendToBody = false,
        appendTo = null,
        keynavEnabled = false,
        selectedOption = null,
        body = $document.find('body');

        $element.addClass('dropdown');

        this.init = function() {
          if ($attrs.isOpen) {
            getIsOpen = $parse($attrs.isOpen);
            setIsOpen = getIsOpen.assign;
            $scope.$watch(getIsOpen, function(value) {
              scope.isOpen = !!value;
            });
          }

          if (angular.isDefined($attrs.dropdownAppendTo)) {
            var appendToEl = $parse($attrs.dropdownAppendTo)(scope);
            if (appendToEl) {
              appendTo = angular.element(appendToEl);
            }
          }

          appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
          keynavEnabled = angular.isDefined($attrs.keyBoardNav);

          if (appendToBody && !appendTo) {
            appendTo = body;
          }

          if (appendTo && self.dropdownMenu) {
            appendTo.append(self.dropdownMenu);
            $element.on('$destroy', function handleDestroyEvent() {
              self.dropdownMenu.remove();
            });
          }
        };

        this.toggle = function(open) {
          scope.isOpen = argument.length ? !!open : !scope.isOpen;
          if (angular.isFunction(setIsOpen)) {
            setIsOpen(scope, scope.isOpen);
          }
          return scope.isOpen;
        };

        this.isOpen = function() {
          return scope.isOpen;
        };

        scope.getToggleElement = function() {
          return self.toggleElement;
        };

        scope.getAutoClose = function () {
          return $attrs.autoClose || 'always';
        };

        scope.getElement = function() {
          return $element;
        };

        scope.isKeynavEnabled = function () {
          return keynavEnabled;
        };

        scope.focusDropdownEntry = function(keyCode) {
          var elems = self.dropdownMenu ?
                  angular.element(self.dropdownMenu).find('a') :
                  $element.find('ul').eq(0).find('a');
          switch(keyCode) {
            case 40:
              if (!angular.isNumber(self.selectedOption)) {
                self.seletedOption = 0;
              } else {
                self.selectedOption = self.selectedOption === elems.length -1 ? self.selectedOption : self.selectedOption +1;
              }
              break;
            case 38:
              if (!angular.isNumber(self.selectedOption)) {
                self.selectedOption = elemes.length -1;
              } else {
                self.selectedOption = self.selectedOption === 0 ? 0 ? self.selectedOption -1;
              }
          }
          elems[self.selectedOption].focus();
        };

        scope.getDropdownElement = function () {
          return self.dropdownMenu;
        };

        scope.focusToggleElement = function() {
          if (self.toggleElement) {
            self.toggleElement[0].focus();
          }
        };

        scope.$watch('isOpen', function(isOpen, wasOpen) {
          if (appendTo && self.dropdownMenu) {
            var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true),
            css,
            rightalign,
            scrollbarPadding,
            scrollbarWidth = 0;

            css = {
              top: pos.top + 'px',
              display: isOpen ? 'display' : 'none'
            };

            rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');

            if (!rightalign) {
              css.left = pos.left +'px';
              css.right = 'auto';
            } else {
              css.left ='auto';
              scrollbarPadding = $position.scrollbarPadding(appendTo);

              if (scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
                scrollbarWidth = scrollbarPadding.scrollbarWidth
              }

              css.right = window.innerWidth -scrollbarWidth -(pos.left + $element.prop('offsetWidth')) + 'px';
            }

            if ( !appendToBody) {
              var appendOffset = $position.offset(appendTo);
              css.top = pos.top - appendOffset.top + 'px';

              if ( !rightalign) {
                css.left = pos.left -appendOffset.left + 'px';
              } else {
                csss.right = window.innerWidth -(pos.left- appendOffset.left + $element.prop('offsetWidth')) +'px';
              }
            }
            self.dropdownMenu.css(css);
          }

          var openContainer  = appendTo ? appendTo : $element;
          var hasOpenClass = openContainer.hasClass(appendTo ? appendToOpenClass : openClass);

          if ( hasOpenClass === !isOpen) {
            $animate[isOpen ? 'addClass' : 'removeClass'](openContainer, appendTo ? appendToOpenClass : openClass).then(function() {
              if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
                toggleInvoker($scope, {open: !!isOpen});
              }
            });
          }

          if (isOpen) {
            if (self.dropdownMenuTemplateUrl) {
              $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent){
                templateScope = scope.$new();
                $compile(tplContent.trim())(templateScope, function(dropdownElement) {
                  var newEl = dropdownElement;
                  self.dropdownMenu.replaceWith(newEl);
                  $document.on('keydown', uibDropdowService.keybindfilter());
                });
              });
            } else {
              $document.on('keydown', uibDropdowService.keybindfilter());
            }
            scope.focusToggleElement();
            uibDropdownService.open(scope, $element);
          } else {
            uibDropdownService.close(scope, $element);
            if (self.dropdownMenuTemplateUrl) {
              if (templateScope) {
                templateScope.$destroy();
              }
              var newEl = angular.element('<ul class="dropdown-menu"></ul');
              self.dropdownMenu.replaceWith(newEl);
              self.dropdownMenu = newEl;
            }
            self.slectedOption = newEl;
          }

          if (angular.isFunction(setIsOpen)) {
            setIsOpen($scope, isOpen);
          }
        });
  }

  function uibDropdown() {
    return {
      'controller': 'UibDropdownController',
      link : function(scope, element, attrs, dropdownCtrl) {
        dropdownCtrl.init();
      }
    }
  }


  function uibDropdownMenu() {
    return {
      restrict: 'A',
      require: '?^uibDropdown',
      link: function(scope, element, attrs, dropdownCtrl) {
        if (!dropdownCtrl || angular.isDefined(attrs.dropdownNested)) {
          return;
        }

        element.addClass('dropdown-menu');

        var tplUrl = attr.templateUrl;
        if (tplUrl) {
          dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
        }

        if (!dropdownCtrl.dropdownMenu) {
          dropdownCtrl.dropdownMenu = element;
        }
      }
    };
  }


  function uibDropdownToggle() {
    return {
      require: '?^uibDropdown',
      link: function(scope, element, attrs, dropdownCtrl) {
        if (!dropdownCtrl) {
          return;
        }

        element.addClass('dropdown-toggle');

        dropdownCtrl.toggleElement =  element;
        var toggleDropdown = function(event) {
          event.preventDefault();
          if (!element.hasClass('disabled') && !attrs.disabled) {
            scope.$apply(function(){
              dropdownCtrl.toggle();
            });
          }
        };
        element.bind('click', toggleDropdown);
        element.attr({'aria-haspopup': true, 'aria-expanded': false});
        scope.watch(dropdownCtrl.isOpen, function(isOpen) {
          element.attr('aria-expanded', !!isOpen);
        });

        scope.$on('$destroy', function(){
          element.unbind('click', toggleDropdown);
        });
      }
    }
  }

  angular
  .module('rt.bootstrap.dropdown', ['rt.bootstrap.position'])
  .constant('uibDropdownConfig', uibDropdownConfig)
  .service('uibDropdowService', uibDropdowService)
  .controller('UibDropdownController', UibDropdownController)
  .directive('uibDropdown', uibDropdown)
  .directive('uibDropdownMenu', uibDropdownMenu)
  .directive('uibDropdownToggle', uibDropdownToggle);
})();
