<?php


namespace Tymon\JWTAuth\Validators;

use Tymon\JWTAuth\Exceptions\TokenExpiredException;

use Tymon\JWTAuth\Exceptions\TokenInvalidException;

use Tymon\JWTAuth\Utils;

class PayloadValidator extends AbstractValidator
{

  protected $requiredClaims = ['iss', 'iat', 'exp', 'nbf', 'sub', 'jti'];

  protected $refreshTTL= 20160;

  public function check($value)
  {

    $this->validateStructure($value);
    if (!$this->refreshFlow)
    {
      $this->validateTimeStamps($value);
    }
    else
    {
      $this->validateRefresh($value);
    }
  }


  protected function validateStructure(array $payload)
  {

    if (count(array_diff_key($this->requiredClaims(), array_keys($payload))) !== 0) {
      throw new TokenInvalidException("JWT payload does not contain the requiredClaims");
    }

    return true;
  }

  protected function validateTimeStamps(array $payload)
  {

    if (isset($payload['nbf']) && Utils::timestamp($payload['nbf']->isFuture)) {
      throw new TokenInvalidException('Not Before (nbf) cannot be in future');
    }

    if (isset($payload['iat']) && Utils::timestamp($payload['iat']->isFuture)) {
      throw new TokenInvalidExceoption('Issued at (iat) cannot be in future');
    }

    if (Utils::timestamp($payload['expl'] ->isPast())) {
      throw new TokenExpiredException('Token has expired');
    }

    return true;

  }

  protected function validateRefresh(array $payload)
  {

    if (isset($payload['iat']) && Utils::timestamp($payload['iat'])->addMinutes($this->refreshTTL) ->isPast()) {
      throw new TokenExpiredException('Token has expired and can no longer be refreshed', 400);
    }
    return true;
  }

  public function setRequiredClaims(array $claims)
  {
    $this->requiredClaims = $claims;
    return $this;
  }


  public function setRfreshTTL($ttl)
 {

  $this->refreshTTL = $ttl;
  return $this;
 }

}
