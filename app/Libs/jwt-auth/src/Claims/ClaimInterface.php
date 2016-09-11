<?php

namespace Tymon\JWTAuth\Claims;

interface ClaimInterface
{

  public function setValue($value);

  public function getValue();

  public function setName($name);

  public function getName();
}
