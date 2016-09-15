<?php

namespace Tymon\JWTAuth\Providers\Auth;

use Illuminate\Auth\AuthManager;

class IlluminateAuthAdapter implements AuthInterface
{

  protected $auth;

  public function __construct(AuthManager $auth)
  {
    $this->auth = $auth;
  }

  public function byCredentials(array $credentials = [])
  {
    return $this->auth->once($credentials);
  }

  public function byId($id)
  {
    return $this->auth->onceUsingId($id);
  }

  public function user()
  {
    $this->auth->user();
  }
}
