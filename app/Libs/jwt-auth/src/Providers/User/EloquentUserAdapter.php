<?php

namespace Tymon\JWTAuth\Providers\User;

use Illuminate\Database\Eloquent\Model;

class EloqentUserAdapter implements UserInterface
{
  protected $user;

  public function __construct(Model $user)
  {
    $this->user = $user;
  }

  public function getBy($key, $value)
  {
    return $this->user->where($key, $value)->first();
  }

}
