<?php

namespace Tymon\JWTAuth;

use Carbon\Carbon;

class Utils
{

  public static function now()
  {

    return Carbon::now();

  }

  public static function timestamp($timestamp)
  {

    return Carbon::createFromTimestampUTC($timestamp);

  }

}
