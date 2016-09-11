
<?php

namespace Tymon\JWTAuth\Claims;

Class  Expiration extends Claims
{
  protected $name = 'exp';

  public function validate($value)
  {
    return is_numeric($value);
  }
}
