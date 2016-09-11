<?php

namespace Tymon\JWTAuth\Exceptions;

class InvalidClaimException extends JWTException
{

  protected $statusCode = 400;

}
