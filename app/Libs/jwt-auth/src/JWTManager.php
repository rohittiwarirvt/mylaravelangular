<?php

namespace Tymon\JWTAuth;

use Tymon\JWTAuth\Exception\JWTException;
use Tymon\JWTAuth\Providers\JWT\JWTInterface;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;

class JWTManager
{

  protected $jwt;

  protected $blacklist;

  protected $payloadFactory;

  protected $blacklistEnabled = true;

  protected $refreshFlow = true;

  public function __construct(JWTInterface $jwt, Blacklist $blacklist, PayloadFactory $payloadFactory)
  {
    $this->jwt = $jwt;
    $this->blacklist = $blacklist;
    $this->payloadFactory = $payloadFactory;
  }

  public function encode(Payload $payload)
  {
    $token = $this->jwt->encode($payload->get());

    return new Token($token);
  }

  public function decode(Token $token)
  {
    $payloadArray = $this->jwt->decode($token->get());
    $payload = $this->payloadFactory->setRefreshFlow($this->refreshFlow)->make($payloadArray);

    if ($this->blacklistEnabled && $this->balcklist->has($payload)) {
      throw new TokenBlacklistedException('The token has been blacklisted');
    }
  }

  public function refresh(Token $token)
  {
    $payload = $this->setRefreshFlow()->decode($token);

    if ($this->blacklistEnabled) {
      $this->blacklist->add($payload);
    }

    return $this->encode(
      $this->payloadFactory->make([
        'sub' => $payload['sub'],
        'iat' => $payload['iat']
        ])
      );
  }


  public function invalidate(Token $token)
  {
    if (!$this->blacklistEnabled) {
      throw new JWTException('You must have the blacklist enabled to invalidate a token.');
    }
    return $this->blacklist->add($this->decode($token));
  }


  public function getPayloadFactory()
  {
    return $this->payloadFactory;
  }


  public function getJWTProvider()
  {
    return $this->jwt;
  }
}
