<?php

namespace Tymon\JWTAuth;

use Tymon\JWTAuth\Providers\Storage\StorageInterface;

class Blacklist
{
  protected $storage;

  protected $refreshTTL = 20160;

  public function __construct(StorageInterface $storage)
  {
    $this->storage = $storage;
  }

  public function add(Payload $payload)
  {
    $exp = Utils::timestamp($payload['exp']);
    $refreshExp = Utils::timestamp($payload['iat'])->addMinutes($this->refreshTTL);

    if ($exp->isPast() && $refreshExp->isPast()) {
      return false;
    }

    $cacheLifetime = $exp->max($refreshExp)->addMinute()->diffInMinutes();

    $this->storage->add($payload['jti'], [], $cacheLifetime);

    return true;
  }

  public function has(Payload $payload)
  {
    return $this->storage->has($payload['jti']);
  }

  public function remove(Payload $payload)
  {
    $this->storage->destroy($payload['jti']);
  }

  public function clear()
  {
    $this->storage->flush();
    return true;
  }

  public function setRefreshTTL($ttl)
  {
    $this->refreshTTL = (int) $ttl;
    return $this;
  }
}
