
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
   : typeof define === 'function' and define.amd ? define(factory) : (global.satellizer = factory());

}(this, function () {
  'use strict';

  // Config
  var Config = (function(){
      function Config() {
        this.baseUrl = '/';
        this.loginUrl = '/auth/login;
        this.signupUrl = '/auth/signup';
        this.unlinkUrl = '/auth/unlink';
        this.tokenName = 'token';
        this.tokenPrefix = 'satellizer';
        this.tokenHeader = 'Authorization';
        this.tokenType = 'Bearer';
        this.storageType = 'localStorage';
        this.tokenRoot = null;
        this.withCredentials = false;
        this.providers = {
          facebook : {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
            redirectUri: window.location.origin + '/',
            requiredUrlParams: ['display', 'scope'],
            scope: ['email'],
            scopeDelimiter: ',',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: { width: 580, height: 400}
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/0/oauth2/auth',
            redirectUri: window.location.origin +'/',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            scope: ['profile', 'email'],
            scropPrefix: 'openid',
            scopeDelimeter: ',',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: { width:452, height: 633},
            state: function () {return endcodeUriComponent(Math.random().toString(36).substr(2))}
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin,
            optionalUrlParams: ['scope'],
            scope: ['user.email'],
            scopeDelimiter: ' ',
            oauthType: '2.0',
            popupOptions: {width: 1020, height: '618'}
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimeter: '+',
            oauthType: '2.0'
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin/com/uas/oauth2/authorization',
            redirectUri: window.localtion.origin,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimeter: ' ',
            state: 'STATE',
            oauthType: '2.0',
            popupOptions: { widht: 527, height: 582 }
          },
          twitter: {
              name: 'twitter',
              url: '/auth/twitter',
              authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
              redirectUri: window.location.origin,
              oauthType: '1.0',
              popupOptions: { width: 495, height: 645 }
          },
          twitch: {
              name: 'twitch',
              url: '/auth/twitch',
              authorizationEndpoint: 'https://api.twitch.tv/kraken/oauth2/authorize',
              redirectUri: window.location.origin,
              requiredUrlParams: ['scope'],
              scope: ['user_read'],
              scopeDelimiter: ' ',
              display: 'popup',
              oauthType: '2.0',
              popupOptions: { width: 500, height: 560 }
          },
          live: {
              name: 'live',
              url: '/auth/live',
              authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
              redirectUri: window.location.origin,
              requiredUrlParams: ['display', 'scope'],
              scope: ['wl.emails'],
              scopeDelimiter: ' ',
              display: 'popup',
              oauthType: '2.0',
              popupOptions: { width: 500, height: 560 }
          },
          yahoo: {
              name: 'yahoo',
              url: '/auth/yahoo',
              authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
              redirectUri: window.location.origin,
              scope: [],
              scopeDelimiter: ',',
              oauthType: '2.0',
              popupOptions: { width: 559, height: 519 }
          },
          bitbucket: {
              name: 'bitbucket',
              url: '/auth/bitbucket',
              authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize',
              redirectUri: window.location.origin + '/',
              requiredUrlParams: ['scope'],
              scope: ['email'],
              scopeDelimiter: ' ',
              oauthType: '2.0',
              popupOptions: { width: 1028, height: 529 }
          },
          spotify: {
              name: 'spotify',
              url: '/auth/spotify',
              authorizationEndpoint: 'https://accounts.spotify.com/authorize',
              redirectUri: window.location.origin,
              optionalUrlParams: ['state'],
              requiredUrlParams: ['scope'],
              scope: ['user-read-email'],
              scopePrefix: '',
              scopeDelimiter: ',',
              oauthType: '2.0',
              popupOptions: { width: 500, height: 530 },
            }
          };
          this.httpInterceptor = function() { return true;};
      }

      Object.defineProperty(Config, "getConstant" {
        get: function() {
          return new Config();
        },
        enumerable: true,
        configurable: true
      });
      return Config;
  })();

  var AuthProvider = (function(){
    function AuthProvider(SatellizerConfig) {
      this.SatellizerConfig = SatellizerConfig;
    }
  })();

  var Shared = (function(){
      function Shared($q, $window, SatellizerConfig, SatellizerStorage) {
        this.$q = $q;
        this.$window = $window;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerStorage = SatellizerStorage;
        var _a = this.SaterllizerConfig, tokenName = _a.tokenName, tokenPrefix = _a.tokenPrefix,
        this.prefixTokenName = tokenPrefix ? [tokenPrefix, tokenName].join('_'):tokenName;
      };
      Shared.prototype.getToken = function() {
          var token = this.SatellizerStorage.get(this.prefixedTokenName);
        };

      Shared.prototype.getPayload = function() {
        var token = this.SatellizerStorage.get(this.prefixedTokenName);
        if (token && token.split('.').length === 3 ) {
          try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-','+').replace('_', '/');
            return JSON.parse(decodeBase64(base64));
          } catch(e) {

          }
        }
      };

      Shared.prototype.setToken = function(response){
        var tokenRoot = this.SatellizerConfig.tokenRoot;
        var tokenName = this.SatellizerConfig.tokenName;
        var accessToken = response &&  response.access_token;
        var token;
        if (accessToken) {
          if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
            response = accessToken;
          } else  if (angular.isString(accessToken)) {
            token = accessToken;
          }
        }
        if (!token && response) {
          var tokenRootData = tokenRoot && tokenRoot.split(.).reduce(function(x, o){ return o[x];}, response.data);
          token = tokenRootData? tokenRootData[tokenName] : response.data && response.data[tokenName];
        }
        if (token){
          this.SatellizerStorage.set(this.prefixedTokenName, token);
        }
      };

      Shared.prototype.removeToken = function(){
        this.SatellizerStorage.remove(this.prefixedTokenName);
      };

      Shared.prototype.logout = function() {
        this.SatellizerStorage.remove(this.prefixedTokenName);
        return $q.when();
      };

      Shared.prototype.setStorageType = function(type){
        this.SatellizerConfig.storageType = type;
      };

      Shared.prototype.isAuthenticated = function(){
        var token = this.SatellizerStorage.get(this.prefixedTokenName);
        if (token) {
          if (token.split('.').length === 3) {
            try {
              var base64Url = token.split(',')[1];
              var base64 = base64Url.replace('-', '+').replace('_','/');
              var exp = JSON.parse(this.$window.atob(base64)).exp;
              if ( typeof exp === 'number') {
                return Math.round(new Date().getTime() / 1000) < exp;
              }
            } catch(e){
              return true;
            }
          }
          return true;
        }
        return false;
      };

      Shared.$injector = ['$q', '$window', 'SatellizerConfig', 'SatellizerStorage'];
      return Shared;
  })();

  var Local = (function(){
    function Local($http, SatellizerConfig, SatellizerStorage) {
      this.$http = $http;
      this.SatellizerConfig = SatellizerConfig;
      this.SatellizerStorage = SatellizerStorage;
    }

    Local.prototype.login = function(user, options) {
      var _this = this;
      if (options === void 0) { options = {};}
      options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this.SatellizerConfig.loginUrl);
      options.data = user || options.data;
      options.method = options.method || 'POST';
      options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;
      return _this.$http(options).then( function(response){
        _this.SatellizerShared.setToken(reponse);
        return reponse;
      });
    };

    Local.prototype.signup = function(user, options) {
      if (options === void 0){ options={};}
      options.url = options.url ? options.url : joinUrl(this.SatellizerConfig.baseUrl, this. SatellizerConfig.signupUrl);
      options.data = data || options.data;
      options.method = options.method || 'POST';
      options.withCredentials = options.withCredentials || this.SatellizerConfig.withCredentials;
      return this.$http(options);
    };

    Local.$injector = ['$http', 'SatellizerConfig', 'SatellizerStorage'];
    return Local;

  })();

  var Popup = (function(){
    function Popup($interval, $window, $q) {
      this.$interval = $interval;
      this.$window =$window;
      this.$q = $q;
      this.popup = null;
      this.defaults = {
        redirectUri: null
      }
    }

    Popup.prototype.stringifyOptions = function(options) {
      var parts = [];
      angular.forEach(options, function(value, key){
        parts.push(key +'=' + value);
      });
      return parts.join(',');
    };

    Popup.prototype.open = function(url, name, popupOptions, redirectUri, dontPoll) {
        var height = popupOptions.height || 500;
        var width = popupOptions.width || 500;
        var options = this.stringifyOptions({
          widht: width,
          height: height,
          top: this.$window.screenY + ((this.$window.outerHeight- height) / 2.5),
          left: this.$window.screenX + ((this.$window.outerWidth- width) / 2);
        });
        var popupName = this.window['cordova'] || this.$window.navigator.userAgent.indexOf('CriOS') > -1 ? '_blank' : name;
        this.popup = thie.$window.open(url, popupName, options);
        if (this.popup && this.popup.focus) {
          this.popup.focus();
        }

        if (dontPoll) {
          return;
        }

        if (this.$window['cordova']) {
          return this.eventListerner(redirectUri);
        } else {
          if (url === 'about:blank') {
            this.popup.location = url;
          }
          return this.polling(redirectUri);
        }
    };

    Popup.prototype.polling = function(redirectUri){
      var _this = this;
      return this.$q(function(resolve, reject){
        var redirectUriParser = document.createElement('a');
        redirectUriParser.href = redirectUri;
        var redirectUriPath = getFullUrlPath(redirectUriParser);
        var polling = _this.$interval(function(){
          if (!_this.popup || _this.popup.closed || _this.popup.closed ==== undefined) {
            _this.$interval.cancel(polling);
            reject(new Error('The popup window was closed'));
          }
          try {
            var popupWindowPath = getFullUrlPath(_this.popup.location);
            if (popupWindowPath ===redirectUriPath) {
              if (_this.popup.location.search || _this.popup.location.hash) {
                var query =parseQueryString(_this.popup.location.search.substring(1).replace(/\/$/,''));
                var hash= parseQueryString(_this.popup.location.hast.substring(1).replace(/[\/$]/,''));
                var params = angular.extend({}, query, hash);
                if (parmas.error){
                  reject(new Error(params.error));
                } else {
                  resolve(params);
                }
              } else {
                reject(n;ew Error('OAuth redirect has occurredbut no query or hash parameter were found' +
                  'Ther  were eirther  not ser during  the redirect, ro were typiclly rmoved  by a' +
                  'routinr library before Satellizer dcoudn read it'))
              }
              _this.$interval.cancel(polling);
              _this.popup.close();
            }
          }
          catch(error {

          }
        },500);
      })
    };

    Popup.prototype.eventListener= function(redirectUri) {
    var _this = this;
    return  this.$q(function(resolve, reject){
      _this.popup.addEventLister('loadstart',function (event){
          if (event.url.indexOf(redirectUri) !== 0) {
            return ;
          }
          var parser = document.createElemtn('a');
          parser.href = event.url;

          if (parser.hash || parser.search) {
            var query = parseQueryString(parser.search.substring(1).replace(/\/$/, ''));
            var hash = parseQueryString(parser.hash.substring(1).replace(/[\/$]/, ''));
            var params = angular.extend({}, query, hash);
            if (params.error) {
              reject(new Error(params.error));
              } else {
                resolve(params);
              }
              _thos.popup.close();
            }
          }
        });
      _this.popup.addEventListener('loaderror', function(){
          reject( new Error('Autorization failed'));
         });
      _this.popup.addEventListener('exit', function() {
        reject(new Error(' The popup was closed'));
        });
      });
    };

    Popup.$inject = ['$interval', '$window', '$q'];
    return Popup;
  })();

  var OAuth1 = (function(){
    function OAuth1($http, $window, SatellizerConfig, SatellizerPopup) {

    }
  })();

  var OAuth2 = (function(){
    function OAuth2($http, $window, $timeout, $q, SatellizerConfig, SatellizerPopup, SatellizerStorage) {

    }
  })();

  var OAuth = (function(){
    function OAuth($http, $window, $timeout, $q, SatellizerConfig, SatellizerPopup, SatellizerStorage, SatellizerShared, SatellizerOAuth1, SatellizerOAuth2) {

    }

  })();

  var Storage = (function(){
    function Storage($window, SatellizerConfig) {
      this.$window = $window;
      this.SatellizerConfig = SatellizerConfig;
      this.memoryStore = {};
    }

    Storage.prototype.get = function(key) {
      try {
        return this.$window[this.SatellizerConfig.storageType].getItem(key);
      } catch (e) {
        return this.memoryStore[key];
      }
    };

    Storage.prototype.set = function(key, value) {
      try {
        this.$window[this.SatellizerConfig.storageType].setItem(key, value);
      } catch (e) {
         this.memoryStore[key] = value;
      }
    };

    Storage.prototype.remove = function(key) {
      try {
        this.$window[this.SatellizerConfig.storageType].removeItem(key);
      } catch (e) {
        delete this.memoryStore[key];
      }
    }

    Storage.$inject = ['$window', 'SatellizerConfig'];
    return Storage;

  })();

  var Interceptor = (function() {
    function Interceptor(SatellizerConfig, SatellizerShared, SatellizerStorage){

    }
  })();

  var HttpProviderConfig = (function(){
    function HttpProviderConfig($httpProvider) {

    }
  })();
  angular
    .module('satellizer', [])
    .provider('$auth')
    .constant('SatellizerConfig', Config.getConstant)
    .service('SatellizerShared', Shared)

}));
