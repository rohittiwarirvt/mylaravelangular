<?php

namespace Tymon\JWTAuth\Validators;

interface ValidatorInterface
{

  public function check($value);

  public function isValid($value);

}
