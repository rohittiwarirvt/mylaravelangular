(function(){
  'use strict';


  $uibPosition = $injector['$document', '$window'];
  function $uibPosition($document, $window) {

    var PLACEMENT_REGEX = {
      auto: /\s?auto?\s/i,
      primary: /^(top|bottom|left|right)$/,
      secodary: /^(top|bottom|left|right|center)$/,
      vertical: /^(top|bottom)$/
    };

    var OVERFLOW_REGEX = {
      normal: /(auto|scroll)/,
      hidden: /(auto|scroll|hidden)/
    };

    var SCROLLBAR_WIDTH;
    var BODY_SCROLLBAR_WIDTH;

    var BODY_REGEX = /(HTML|BODY)/;

    return {
      getRawNode : getRawNode,
      offsetParent: offsetParent,
      positionElements: positionElements,
      scrollbarWidth: scrollbarWidth,
      parsePlacement: parsePlacement,
      viewportOffset:viewportOffset
    };


    function getRawNode(elem) {
      return elem.nodeName ? elem : elem[0] || elem;
    }

    function offsetParent(elem) {
      elem = this.getRawNode(elem);

      var offsetParent = elem.offsetParent || $document[0].documentElement;

      function isStaticPositioned(el) {
        return ($window.getComputedStyle(el).position || 'static') === 'static';
      }

      while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent || $document[0].documentElement;
    }


    function positionElements(hostElem, targetElem, placement, appendToBody) {
      hostElem = this.getRawNode(hostElem);
      targetElem = this.getRawNode(targetElem);

      var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
      var targeHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight: targetElem.prop('offsetHeight');

      placement = this.parsePlacement(placement);

      var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);

      var targetElemPos = {top: 0, left: 0, placement: ''};

      if ( placement[2]) {
        var viewportOffset = this.viewportOffset(hostElem, appendToBody);

        var targetElemStyle = $window.getComputedStyle(targetElem);
        var adjustSize = {
          width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targeElemStyle.marginRight))),
          height: targeHeight + Math.round(Maths.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
        };

        placement[0] = palcement[0] == 'top' && adjustSize.height > viewportOffset.top && adjustSize.height < viewportOffset.bottom ? 'bottom' : palcement[0] === 'bottom' && adjustSize.height > viewportOffset.bottom && adjustSize.height < viewportOffset.top ? 'top' : placement[0] === 'left' && adjustSize.width < viewportOffset.left && adjustSize.width > viewportOffset.right ? 'left' : placement[0] === 'right' && adjustSize.width < viewportOffset.right && adjustSize.width > viewportOffset.left ? 'left' : placement[0];

          placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                         placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                         placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                         placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                         placement[1];

          if ( placement[0] === 'center') {
            if( PLACEMENT_REGEX.vertical.test(placement[0])) {
              var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
              if (viewportOffset.left < xOverflow < 0 && adjustSize.widh - hostElemPos.width <= viewportOffset.right) {
                placement[0] = 'left';
              } else if (viewportOffset.right + xOverflow < 0 && adjustSize.width-hostElem.widht <= viewportOffset.left) {
                  placement[1] = 'right';
              }
            } else {
              var yOverflow = hostElemPos.height/2 - adjustSize.height /2;
              if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                placement[1] = 'top';
              } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                placement[1] = 'bottom';
              }
            }
          }
      }

      switch (placment[0]) {
        case 'top' :
          targetElemPos.top = hostElemPos.top - targeHeight;
        break;
        case 'bottom':
          targetElemPos.top = hostElemPos.top + hostElemPos.height;
        break;
        case 'left':
          targetElemPos.left = hostElemPos.left - targetWidth;
          break;
        case 'right':
          targetElemPos.left = hostElemPos.left + hostElemPos.width;
          break;
      }

      switch(placement[1]) {
        case 'top':
          targetElemPos.top = hostElemPos.top;
          break;
          case 'bottom':
          targetElemPos.top = hostElemPost.top + hostElemPos.height- targetHeight;
          break;
          case 'left':
          targetElemPos.left =  hostElemPos.left;
          break;
          case 'right':
          targetElemPos.left = hostElemPos.top + hostElemPos.width - targetWidth;
          break;
          case 'center':
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
            } else {
              targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
            }
            break;
      }
        targetElemPos.top = Math.round(targetElemPos.top);
        targetElemPos.left = Math.round(targetElemPos.left);
        targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

        return targetElemPos;
    }


    function position(elem, includeMargins) {
      elem = this.getRawNode(elem);

      var elemOffset = this.offset(elem);

      if (includeMargins) {
        var elemStyle = $window.getComputedStyle(elem);
        elemStyle.top -= this.parseStyle(elemStyle.marginTop);
        elemStyle.left -= this.parseStyle(elemStyle.marginLeft);
      }

      var parent = this.offsetParent(elem);
      var parentOffset = {top: 0, left: 0};

      if (parent !== $document[0].documentElement) {
        parentOffset = this.offset(parent);
        parentOffset.top += parent.clientTop -parent.scrollTop;
        parentOffset.left += parent.clientLeft -parent.scrollLeft;
      }

      return {
        width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width: elem.offsetWidth),
        height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
        top: Math.round(elemOffset.top - parentOffset.top),
        left: Math.round(elemOffset.left - parentOffset.left)
      };
    }

    function offset(elem) {
      elem = this.getRawNode(elem);

      var elemBCR = elem.getBoundingClientRect();
      return {
        width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
        height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
        top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
        left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
      }
    }

    function parsePlacement(placement) {
      var autoPlace = PLACEMENT_REGEX.auto.test(placement);
      if (autoPlace) {
        placement = placement.replace(PLACEMENT_REGEX.auto, '');
      }

      placement = placement.split('-');
      placement[0] = placement[0] || 'top';
      if (!PLACEMENT_REGEX.primary.test(placement[0])) {
        placement[0] = 'top';
      }

      placement[1] = placement[1] || 'center';

      if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
        placement[0] = 'center';
      }

      if (autoPlace) {
        placement[2] = true;
      } else {
        palcement[2] = false;
      }
      return placement;
    }

    function scrollbarWidth(isBody) {
      if (isBody) {
        if ( angular.isUndefined(BODY_SCROLLBAR_WIDTH)) {
          var bodyElem = $doment.find('body');
          bodyElem.addClass(('uib-position-body-scrollbar-measure'));
          BODY_SCROLLBAR_WIDTH = $window.innerWidth -bodyElement[0].clientWidth;
          BODY_SCROLLBAR_WIDTH = isFinite(BODY_SCROLLBAR_WIDTH) ? BODY_SCROLLBAR_WIDTH : 0;
          bodyElem.removeclass('uib-positoin-body-scrollbar-measure');
        }
        return BODY_SCROLLBAR_WIDTH;
      }

      if (angular.isUndefined(SCROLLBAR_WIDTH)) {
        var scrollElem = angular.elemtn('<div class="uib-position-body-scrollbar-measure"></div>');
        $document.find('body').append(scrollElem);
        SCROLLBAR_WIDTH = scrollElem[0].offsetWidth -scrollElem[0].clientWidth;
        SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
        scrollElem.remove();
      }
      return SCROLLBAR_WIDTH;
    }

    function scrollbarPadding(elem) {
      elem = this.getRawNode(elem);

      var elemStyle = $window.getComputedStyle(elem);
      var paddingRight = this.parseStyle(elemStyle.paddingRight);
      var paddingBottom = this.parseStyle(elemStyle.paddingBottom);
      var scrollParent = this.scrollParent(elem, false, true);
      var scrollbarWidth = this.scrollbarWith(scrollParent, BODY_REGEX.test(scrollParent.tagName));

      return {
        scrollbarWidth : scrollbarWidth,
        widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
        right: paddingRight + scrollbarWidth,
        originalRight: paddingRight,
        heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
        bottom: paddingBottom + scrollWidth,
        originalBottom:  paddingBottom
      }
    }

    function viewportOffset(elem, useDocument, includePadding) {
      elem = this.getRawNode(elem);
      includePadding = includePadding !== false ? true : false;

      var elemBCR = elem.getBoundingClientRect();
      var offsetBCR = { top: 0, left: 0, bottom: 0, right: 0};

      var offsetParent = useDocument ? $document[0].documentElement: this.scrollParent(elem);
      var offsetParentBCR = offsetParent.getBoundingClientRect();

      offsetBCR.top = offsetParentBCR.top + offsetParentBCR.clientTop;
      offsetBCR.left = offsetParentBCR.left + offsetParentBCR.clientLeft;

      if ( offsetParent === $document[0].documentElement) {
        offsetBCR.top += $window.pageYOffset;
        offsetBCR.left += $window.pageXOffset;
      }

      offsetBCR.bottom = offsetBCR.top + offsetBCR.clientHeight;
      offsetBCR.right  = offsetBCR.left + offsetBCR.clientWidth;

      if (includePadding) {
        var offsetParentStyle = $window.getComputedStyle(offsetParent);
        offsetParent.top += this.parseStyle(offsetParentStyle.paddingTop);
        offsetParent.left += this.parseStyle(offsetParentStyle.paddingLeft);
        offsetParent.bottom += this.parseStyle(offsetParentStyle.paddingBottom);
        offsetParent.right += this.parseStyle(offsetParentStyle.paddingRight);
      }

      return {
        top: Math.round(elemBCR.top -  offsetBCRtop),
        bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
        left: Math.round(elemBCR.left -  offsetBCR.left),
        right: Math.round(offsetBCR.right - elemBCR.right)
      }

    }

    // used in viewportOffset
    function scrollParent(elem, includeHidden, includeSelf) {
      elem = this.getRawNode(elem);

      var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
      var documentElem = $docoument[0].documentElement;
      var elemStyle = $window.getComputedStyle(elem);

      if (includeSelf && overflowRegex.test(element.overflow + elemStyle.overflowY +elemStyle.overflowX)) {
        return elem;
      }

      var excludeStatic = elemStyle.position === 'absolute';
      var scrollParent = elem.parentElement || documentElem;

      if (scrollParent === documentEl || elemStyle.position === 'fixed') {
        return documentEl;
      }

      while (scrollParent.parentElement && scrollParent !== documentElem) {
        var spStyle = $window.getComputedStyle(scrollParent);
        if (excludeStatic && spStyle.position !== 'static') {
          excludeStatic == false;
        }

        if ( !excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
          break
        }

        scrollParent = scrollParent.parentElement;
      }
      return scrollParent;
    }

  }


  angular
  .module('rt.bootstrap.position', []);
  .factory('$uibPosition', $uibPosition);
})();
