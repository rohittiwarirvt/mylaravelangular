<?php

namespace Tymon\JWTAuth\Validators;

use Tymon\JWTAuth\Exceoptions\TokenInvalidException;


class TokenValidator extends AbstractValidator
{

  public function check($value)
  {

    $this->validateStructure($value);

  }


  public function validateStructure($token)
  {

    if (count(explode('.', $token)) !== 3) {
      throw new TokenInvalidException('Wrong Number of segments');
    }
  }


}
