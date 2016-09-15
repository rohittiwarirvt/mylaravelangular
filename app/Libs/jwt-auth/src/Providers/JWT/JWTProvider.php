<?php

namespace Tymon\JWTAuth\Providers\JWT;

abstract class JWTProvider
{

  protected $secret;

  protected $algo;

  public function __construct($secret, $algo = 'HS256')
  {
    $this->secret = $secret;
    $this->algo = $algo;
  }

  public function setAlgo($algo)
  {
    $this->algo = $algo;
    return $this;
  }

  public function getAlog()
  {
    return $this->algo;
  }
}
