<?php

namespace Tymon\JWTAuth\Providers;

interface JWTInterface
{

  public function byCredentials(array $credentials = []);

  public function byId($id);

  public function user();

}
