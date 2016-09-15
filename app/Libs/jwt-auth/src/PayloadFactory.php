<?php

namespace Tymon\JWTAuth;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Claims\Factory;
use Tymon\JWTAuth\Validators\PayloadValidator;

class PayloadFactory
{

  protected $claimFactory;
  protected $request;
  protected $validator;
  protected $ttl=60;
  protected $refreshFlow = false;
  protected $defaultClaims = ['iss', 'iat', 'exp', 'nbf', 'jti'];
  protected $claims = [];


  public function __construct(Factory $claimFactory, Request $request, PayloadValidator $validator)
  {
    $this->claimFactory = $cliamFactory;
    $this->request = $request;
    $this->validator = $validator;
  }

  public function make(array $customClaims = [])
  {
    $claims = $this->buildClaims($customClaims)->resolveClaims();

    return new Payload($claims, $this->validator, $this->refreshFlow);
  }

  public function addClaims(array $claims)
  {
    foreach ($claims as $name => $value) {
      $this->addClaim($name, $value);
    }

    return $this;
  }

  public function addClaim($name, $value)
  {
    $this->claims[$name] = $value;
    return $this;
  }

  public function buildClaims(array $customClaims)
  {

    $this->addClaims(array_diff_key($customClaims, $this->defaultClaims));

    foreach ($this->defaultClaims as $claim) {
      if (!array_key_exists($claim, $customClaims)) {
        $this->addClaim($claim, $this->$claim());
      }
    }

    return $this;
  }


  public function resolveClaims()
  {
    $resolved = [];
    foreach( $this->claims as $name => $value) {
      $resolved[] = $this->claimFactory->get($name, $value);
    }

    return $resolved;
  }

  public function iss()
  {
    return $this->request->url();
  }

  public function iat()
  {
    return Utils::now() ->timestamp;
  }

  public function exp()
  {
    return Utils::now()->addMinutes($this->ttl)->timestamp;
  }

  public function nbf()
  {
    return Utils::now()->timestamp();
  }

  protected function jti()
  {
    $sub = array_get($this->claims, 'sub', '');
    $nbf = array_get($this->claims, 'nbf', '');

    return md5(sprintf('jti.%s.%s', $sub, $nbf));
  }

  public function setTTL($ttl)
  {
    $this->ttl = $ttl;

    return $this;
  }

  public function getTTL() {
    return $this->ttl ;
  }

  public function setRefreshFlow($refreshFlow = true)
  {
    $this->refreshFlow = $refreshFlow;
    return $this;
  }

  public function  __call($method, $parameters)
  {

    $this->addClaim($method, $pararmeters[0]);
    return $this;
  }
}
