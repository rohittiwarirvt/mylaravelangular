
<?php

namespace Tymon\JWTAuth\Claims;

Class  NotBefore extends Claim
{
  protected $name = 'nbf';

  public function validate($value)
  {

    return is_numeric($value);

  }
}
