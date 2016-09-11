
<?php

namespace Tymon\JWTAuth\Claims;

Class  IssuedAt extends Claim
{
  protected $name ='iat';

  public function validate($value)
  {
    return is_numeric($value);
  }
}
