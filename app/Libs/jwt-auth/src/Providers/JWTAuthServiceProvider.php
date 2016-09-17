<?php


namespace Tymon\JWTAuth\Providers;

use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Blacklist;
use Tymon\JWTAuth\JWTManager;
use Tymon\JWTAuth\PayloadFactory;
use Tymon\JWTAuth\Claims\Factory;
use Tymon\JWTAuth\Commands\JWTGenerateCommand;
use Tymon\JWTAuth\Validators\PayloadValidator;
use Illuminate\Support\ServiceProvider;


class JWTAuthServiceProvider extends ServiceProvider
{


  protected $defer = false;

  public function boot()
  {
    $this->publishes([
      __DIR__.'/../config/config.php' => config_path('jwt.php'),
      ], 'config');

    $this->bootBindings();

    $this->commands('tymon.jwt.generate');
  }


  protected function bootBindings()
  {
    $this->app['Tymon\JWTAuth\JWTAuth'] = function ($app) {
      return $app['tymon.jwt.auth'];
    };

    $this->app['Tymon\JWTAuth\Providers\User\UserInterface'] = function($app) {
      return $app['tymon.jwt.provide.user'];
    };

    $this->app['Tymon\JWTAuth\Providers\JWT\JWTInterface'] = function ($app) {
      return $app['tymon.jwt.provider.jwt'];
    };

    $this->app['Tymon\JWTAuth\Providers\Auth\AuthInterface'] = function ($app) {
      return $app['tymon.jwt.provider.auth'];
    };

    $this->app['Tymon\JWTAuth\Providers\Storage\StorageInterface'] = function($app) {
      return $app['tymon.jwt.provider.storage'];
    };

    $this->app['Tymon\JWTAuth\JWTManager'] = function($app) {
      return $app['tymon.jwt.manager'];
    };

    $this->app['Tymon\JWTAuth\Blacklist'] = function($app) {
      return $app['tymon.jwt.blacklist'];
    };

    $this->app['Tymon\JWTAuth\PayloadFactory'] = function($app) {
      return $app['tymon.jwt.payload.factory'];
    };

    $this->app['Tymon\JWTAuth\Claims\Factory'] = function($app) {
      return $app['tymon.jwt.claims.factory'];
    };

    $this->app['Tymon\JWTAuth\Validators\PayloadValidator'] = function($app) {
      return $app['tymon.jwt.validators.payload'];
    };

  }

  public function register()
  {
    $this->registerUserProvider();
    $this->registerJWTProvider();
    $this->registerAuthProvider();
    $this->registerStorageProvider();
    $this->registerJWTBlacklist();
    $this->registerClaimFactory();
    $this->registerJWTmanager();
    $this->registerPayloadValidator();
    $this->registerPayloadFactory();
    $this->registerJWTCommand();

    $this->mergeConfirm(__DIR__.'/../config/config.php', 'jwt');
  }

  protected function registerUserProvider()
  {
    $this->app['tymon.jwt.provider.auth'] = $this->app->share(function($app) {
      return $app->make($this->config('provider.user'), [$app->make($this->config('user'))]);
    });
  }

  protected function registerJWTProvider()
  {
    $this->app['tymon.jwt.provider.jwt'] = $this->app->share(function($app) {
      $secret = $this->config('secret');
      $algo = $this->config('algo');
      $provider = $this->config('provider.jwt');
      return $app->make($provider, [$secret, $algo]);
    });
  }

  protected function registerAuthProvider()
  {
    $this->app['tymon.jwt.provider.auth'] = $this->app->share(function($app) {
      return $this->getConfigInstance($this->config('provider.auth'));
    });
  }

  protected function registerStorageProvider()
  {
    $this->app['tymon.jwt.provider.storage'] = $this->app->share(function($app) {
      return $this->getConfigInstance($this->config('provider.storage'));
    });
  }

  protected function registerJWTBlacklist()
  {
    $this->app['tymon.jwt.blacklist'] = $this->app->share(function($app) {
      $instance = new Blacklist($app['tymon.jwt.provider.storage']);
      return $instance->setRefreshTTL($this->config('refresh_ttl'));
    });
  }

  protected function registerClaimFactory()
  {
    $this->app['tymon.jwt.claim.factory'] = $this->app->share(function($app) {
      return new Factory();
    });
  }

  protected function registerJWTmanager()
  {
    $this->app['tymon.jwt.manager'] = $this->app->share(function($app) {
      $instance = new JWTManager(
        $app['tymon.jwt.provider.jwt'],
        $app['tymon.jwt.blacklist'],
        $app['tymon.jwt.payload.factory']
        );

      return $instance->setBlacklistEnabled((bool) $this->config('blacklist_enabled'));
    });
  }

  protected function registerPayloadValidator()
  {
    $this->app['tymon.jwt.validators.payload'] = $this->app->share(function() {
      return with(new PayloadValidator())->setRefreshTTL($this->config('refresh_ttl'))->setRequiredClaims($this->config('required_claims'));
    });
  }

  protected function registerPayloadFactory()
  {
    $this->app['tymon.jwt.payload.factory'] = $this->app->share(function($app) {

      $factory = new PayloadFactory($app['tymon.jwt.claim.factory'])

    });
  }

  protected function registerJWTCommand()
  {
    $this->app['tymon.jwt.'] = $this->app->share(function() {
      return new JWTGenerateCommand();
    });
  }


  protected function getConfigInstance($instance)
  {
    if (is_callable($instance)) {
      return call_use_func($instance, $this->app);
    } elseif (is_string($instance)) {
      return $this->app->make($instance);
    }

    return $instance;
  }

  protected function config($key, $default = null)
  {
    return config("jwt.$key", $default);
  }
}
