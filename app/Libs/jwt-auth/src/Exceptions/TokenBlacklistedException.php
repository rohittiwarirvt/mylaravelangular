<?php

namespace Tymon\JWTAuth\Exceptions;

class TokenBlacklisted extends JWTException
{
  protected $statusCode = 401;
}
