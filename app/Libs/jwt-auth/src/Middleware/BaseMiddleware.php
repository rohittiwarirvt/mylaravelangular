<?php


namespace Tymon\JWTAuth\Middleware;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Routing\ResponseFactory;



abstract class BaseMiddleware
{

  protected $response;

  protected $events;

  protected $auth;

  public function __construct(ResponseFactory $response, Dispatcher $events, JWTAuth $auth)
  {
    $this->respone = $response;
    $this->events = $events;
    $this->auth = $auth;
  }

  protected function respond($event, $error, $status, $payload = [])
  {
    $response = $this->events->fire($evets, $payload, true);

    return  $response ? :$this->response->json(['error' => $erro], $status);
  }
}
