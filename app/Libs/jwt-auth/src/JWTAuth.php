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

  public function setRequest(Request $request)
  {
    if ()
  }


}
