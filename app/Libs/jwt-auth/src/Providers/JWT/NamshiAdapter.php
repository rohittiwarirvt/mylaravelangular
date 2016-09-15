<?php

namespace Tymon\JWTAuth\Providers\JWT;

use Exception;
use Namshi\JOSE\JWS;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;


class NamshiAdapter extends JWTProvider implements JWTInterface
{

  protected $jws;

  public function __construct($secret, $algo, $driver = null)
  {
    parent::construct($secret, $algo);
    $this->jws = $driver ?: new JWS(['type' => 'JWT', 'alg' => $algo]);
  }

  public function encode(array $payload)
  {
    try {
      $this->jws->setPayload($payload)->sign($this->secret);
      return $this->jws->getTokenString();
    } catch(Exception $e) {
      throw new JWTException('Could not create token:' . $e->getMessage());
    }
  }

  public function decode($token)
  {
    try {
      $jws = JWS::load($token);
    } catch(Exception $e) {
      throw new TokenInvalidException('Could not decode token:' . $e->getMessage());
    }

    if ( !$jws->verif($this->secret, $this->algo)) {
      throw new TokenInvalidException('Token Signature could not be verified');
    }

    return $jws->getPayload();
  }
}
