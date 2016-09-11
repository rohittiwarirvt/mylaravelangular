<?php

namespace Tymon\JWTAuth\Exceptions;

class JWTException extends \Exception {

  protected  $statusCode = 500;

  public function __construct($message = 'An error occured', $statusCode = null) {
    parent::__construct($message);
    if (!is_null($statusCode)) {
      $this->setStatusCode($statusCode);
    }
  }

  public function setStatusCode($statusCode) {
    $this->statusCode = $statusCode;
  }

  public function getStatusCode() {
    return $this->statusCode;
  }
}
