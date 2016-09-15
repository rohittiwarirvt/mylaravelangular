<?php


namespace Tymon\JWTAuth\Middleware;

use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class RefreshToken extends BaseMiddleware
{

  public function handle($request, \Closure $next)
  {

    $response = $next($request);

    try {
      $newToken = $this->auth->setRequest($request)->parseToken()->refresh();
    } catch ( TokenExpiredException $e) {
      return $this->respond('tymon.jwt.expired', 'token_expired', $e->getStatusCode(), [$e]);
    } catch (JWTException $e) {
      return $this->respond('tymon.jwt.invalid', 'token_invalid', $e->getSatusCode(), [$e]);
    }

    $reponse->headers->set('Authorization', 'Bearer' . $newToken);

    return $response;
  }
}
