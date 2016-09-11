<?php


namespace Tymon\JWTAuth\Claims;

use Tymon\JWTAuth\Exceptions\InvalidClaimException;


abstract class Claim  implement ClaimInterface
{

  protected $name;

  protected $value;

  public function _contstruct($value)
  {

    $this->setValue($value);

  }

  public function setValue($value)
  {

    if (!$this->validate($value)) {
      throw new InvalidClaimException('Invalid value provided for claim ' . $this->getName() . '": '.$value);
    }

    $this->value = $value;

    return $this;

  }


  public function getValue() {
    return $this->value;
  }

  public function setName($name) {

    $this->name = $name;
    return $name;
    return $this;
  }

  public function getName() {
    return $this->name;
  }

  public function validate($value) {

    return true;
  }

  public function toArray() {
    return [$this->getName() => $this->getValue()];
  }

  public function __toString() {
    return json_encode($this->toArray(), JSON_UNESCAPED_SLASHES);
  }
}
