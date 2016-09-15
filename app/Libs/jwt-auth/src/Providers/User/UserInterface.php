<?php

namespace Tymon\JWTAuth\Providers\User;

interface UserInterface
{

  public function getBy($key, $value);
}
