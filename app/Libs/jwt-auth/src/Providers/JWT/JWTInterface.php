<?php

namespace  Tymon\JWTAuth\Providers\JWT;

interface JWTInterface
{
  public function encode(array $payload);

  public function decode($token);
}

