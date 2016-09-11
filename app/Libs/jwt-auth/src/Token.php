<?php

namespace Tymon\JWTAuth;

use Tymon\JWTAuth\Validators\TokenValidator;

class Token
{

  private $value;

  public function __construct($value)
  {

    with(new TokenValidator) ->check($value);

    $this->value = $value;
  }

  public function get()
  {

    return $this->value;

  }


  public function __toString()
  {

    return (string)$this->value;

  }
}

