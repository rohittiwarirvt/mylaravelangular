<?php

namespace Tymon\JWTAuth\Providers;

interface UserInterface
{

  public function getBy($key, $value);
}
