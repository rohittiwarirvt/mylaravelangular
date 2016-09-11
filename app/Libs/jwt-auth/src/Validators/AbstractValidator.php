<?php

namespace Tymon\JWTAuth\Validators;

use Tymon\JWTAuth\Exceptions\JWTException;

abstract class AbstractValidator implements ValidatorInterface {

  protected $refreshFlow = false;

  public function isValid($value) {
      try {
        $this->check($value)
      } catch (JWTException $e) {
        return false;
      }
      return true;
  }

  public function setRefreshFlow($refreshFlow = true) {
    $this->refreshFlow = $refreshFlow;
    return $this;
  }

}
