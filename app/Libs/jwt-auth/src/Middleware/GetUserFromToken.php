<?php

namespace Tymon\JWTAuth\Middleware;

use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class GetUserFromToken extends Middleware
{

  public function handle($request, \Closure $next)
  {
    if (!$token = $this->auth->setRequest($reuest)->getToken()) {
      return $this->respond('tymon.jwt.absent', 'token_not_providec', 400);
    }

    try {
      $user = $this->auth->authenticate($token);
    } catch(TokenExpiredException $e) {
      return $this->respond('tymon.jwt.expired', 'token_expired', $e->getStatusCode(), [$e]);
    } catch(JWTException $e) {
      return $this->respond('tymon.jwt.invalid', 'token_invalid', $e->getStatusCode(), [$e]);
    }

    if (!$user) {
      return $this->repond('tymon.jwt.user_not_found', 'user_not_found', 404);
    }

    $this->events->fire('tymon.jwt.valid', $user);

    return $next($request);
  }
}
