<?php

namespace Tymon\JWTAuth\Provider\User;

use Illuminate\Cache\CacheManager;

class IlluminateCacheAdapter implements StorageInterface
{

  protected $cache;

  protected $tag = 'tymon:jwt';

  public function __construct(CacheManager $cache)
  {
    $this->cache = $cache;
  }


  public function add($key, $value, $minutes)
  {
    $this->cache()->put($key, $value, $minutes);
  }

  public function has ($key)
  {
    return $this->cache()->has($key);
  }

  public function destroy($key)
  {
    return $this->cache()->forget($key);
  }

  public function flush()
  {
    $this->cache()->flush();
  }

  protected function cache()
  {
    if (!method_exists($this->cache, 'tags'))
    {
      return $this->cache;
    }

    return $this->cache->tags($this->tag);
  }
}
