<?php

namespace Tymon\JWTAuth;

use Illuminate\Http\Request;
use  Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Providers\Auth\AuthInterface;
use Tymon\JWTAuth\Providers\Users\UserInterface;

class JWTAuth
{

  protected $manager;

  protected $user;

  protected $auth;

  protected $request;

  protected $identifier = 'id';

  protected $token;

  public function __construct(JWTManager $manager, UserInterface $user, AuthInterface $auth, Request $request)
  {
    $this->manager = $manager;
    $this->user = $user;
    $this->auth = $auth;
    $this->request = $request;
  }

  public function toUser($token = false)
  {
    $payload = $this->getPayload($token);

    if (!$user = $this->user->getBy($this->identifier, $payload['sub'])) {
      return false;
    }

    return $user;
  }


  public function getPayload($token = false)
  {
    $this->requireToken($token);
    return $this->manager->decode($this->token);
  }


  public function requireToken()
  {
    if (! $token = $token? : $this->token)
    {
      throw new JWTException('A token is required', 400);
    }

    return $this->setToken($token);
  }


  public function fromUser($user, array $customClaims = [])
  {
    $payload = $this->makePayload($user->{$this->identifier}, $customClaims);

    return $this->manager->encode($payload)->get();
  }

  public function makePayload($subject, array customClaims = [])
  {
    return $this->manager->getPayloadFactory->make(array_merge($customClaims, ['sub' => $subject]));

  }

  public function attempt(array $credentials =[], array $customClaims = [])
  {
    if (!$this->auth->byCredentials($credentials)) {
      return false;
    }

    return $this->fromUser($this->auth->user(), $customClaims);
  }

  public function authenticate($token = false)
  {
    $id = $this->getPayload($token)->get('sub');

    if (! $this->auth->byId($id)) {
      return false;
    }

    return $this->auth->user();
  }

  public function refresh($token =false)
  {
    $this->requireToken($token);
    return $this->manager->refresh($this->token)->get();
  }

  public function invalidate($token = false)
  {
    $this->requireToken($token);

    return $this->manager->invalidate($this->token);
  }

  public function getToken()
  {
    if (!$this->token) {
      try {
        $this->parseToken();
      } catch (JWTException $e) {
        return false;
      }
    }

    return $this->token;
  }

  public function parseToken($method = 'bearer', $header = 'authorization', $query = 'token')
  {
    if (! $token = $this->parseAuthHeader($header, $method)) {
      if (!$token = $this->request->query($query, false)) {
        throw new JWTException('The token could not be parsed from the request', 400);
      }
    }

    return $this->setToken($token);
  }

  protected parseAuthHeader($header ='authorization', $method = 'bearer')
  {
    $header = $this->request->headers->get($header);

    if ( ! starts_with(strtolower($header), $method)) {
      return false;
    }

    return trim(str_ireplace($method, '', $header));
  }

  public function setIdentifier($identifier)
  {
    $this->identifier = $identifier;

    return $this;
  }

  public function getIdentifier()
  {
    return $this->identifier;
  }

  public function setToken($token)
  {
    $this->token = new Token($token);

    return $this;
  }

  public function setRequest(Request $request)
  {
    $this->request = $request;
  }

  public function manager()
  {
    return $this->manager;
  }

  public function __call($method, $paramters)
  {
    if (method_exists($this->manager, $method)) {
      return call_user_func_array([$this->manager, $method], $parameters);
    }

    throw new \BadMethodCallException("Method [$method] does not exist.");
  }
}
