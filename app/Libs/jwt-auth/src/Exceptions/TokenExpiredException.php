<?php

namespace Tymon\JWTAuth\Exceptions;

class TokenExpiredException extends JWTAuthException
{

  protected $statusCode = 401;

}
