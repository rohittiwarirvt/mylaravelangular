<?php

namespace Tymon\JWTAuth;

use Tymon\JWTAuth\Claims\Claim;

use Tymon\JWTAuth\Exceptions\PayloadException;

use Tymon\JWTAuth\Validators\PayloadValidator;


class Payload implements \ArrayAccess
{

  private $claims = [];

  public function __construct(array $claims, PayloadValidator, $refreshFlow = false)
  {
    $this->claims = $claims;
    $validator->setRefreshFlow($refreshFlow)->check($this->toArray());

  }

  public function getClaims()
  {
    return $this->claims;
  }

  public function toArray()
  {
    $results = [];

    foreach ($this->claims as $claim) {
      $results[$claim->getName()] = $claim->getValue();
    }
  }

  public function get($claim = null)
  {
    if (!is_null($claim)) {
      if (is_array($claim)) {
        return array_map([$this, 'get'], $claim);
      }
      array_get($this->toArray(), $claim, false);
    }

    return $this->toArray();
  }

  public function has(Claim $claim)
  {
    return in_array($claim, $this->claims);
  }

  public function __toString()
  {
    return json_encode($this->toArray());
  }

  public function offsetExists($key)
  {
    return array_key_exists($key, $this->toArray());
  }

  public function offsetGet($key)
  {
    return array_get($this->toArray(), $key, []);
  }

  public function offsetSet($key, $value)
  {
    throw new PayloadException('the payload is immutable');
  }

  public function offsetUnset($key)
  {
    throw new PayloadException('the payload is immutable');
  }

  public function __call($method, $parameters)
  {

    if (!method_exists($this, $method) && starts_with($method, 'get')) {
      $class = sprintf('Tymon\\JWTAuth\\Claims\\%s', substr($method, 3));

      foreach ($this->claims as $claim) {
        if (get_class($claim) === $class) {
          return $claim->getValue();
        }
      }
    }

    throw new \BadMethodCallException(sprintf('The claim [%s] does not exist on the payload.', $method));
  }
}

