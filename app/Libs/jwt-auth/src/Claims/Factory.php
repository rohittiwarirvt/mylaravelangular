<?php

namespace Tymon\JWTAuth\Claims;

class Factory
{

  private static $classMap = [
  'aud' => 'Tymon\JWTAuth\Claims\Audience',
  'exp' =>'Tymon\JWTAuth\Claims\Expiration',
  'iat' => 'Tymon\JWTAuth\Claims\IssuedAt',
  'iss' => 'Tymon\JWTAuth\Claims\Issuer',
  'jti' => 'Tymon\JWTAuth\Claims\JwtId',
  'nbf' => 'Tymon\JWTAuth\Claims\NotBefore',
  'sub' => 'Tymon\JWTAuth\Claims\Subject'
  ];


  public function get($name, $value)
  {
    if ($this->has($name)) {
      return new self::$classMap[$name]($value);
    }

    return new Custom($name, $value);
  }

  public function has($name)
  {
    return array_key_exists($name, self::$classMap);
  }
}
