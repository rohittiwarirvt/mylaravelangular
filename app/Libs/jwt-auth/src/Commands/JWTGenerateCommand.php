<?php


namespace Tymon\JWTAuth\Commands;

use Illuminate\Support\Str;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class JWTGenerateCommand extends Command
{
  protected $name = 'jwt:generate';

  protected $description = 'Set generate jwt auth secret key used to sign the tokens';

  public function fire()
  {
    $key = $this->getRandomkey();
    if ($this->option('show')) {
      return $this->line('<comment>' .$key . '</comment>');
    }

    $path = config_path('jwt.php');

    if (file_exists($path)) {
      file_put_contents($path, str_replace(
        $this->laravel['config']['jwt.secret'], $key, file_get_contents($path)
        ));
    }

    $this->laravel['config']['jwt.secret'] = $key;

    $this->info("jwt auth secred {$key} set successfully");
  }

  protected function getRandomkey()
  {
    return Str::random(32);
  }

  protected function getOptions()
  {
    return [
      ['show', null, InputOption::VALUE_NONE, 'Simply display the key instead of modifying files.'],
    ];
  }
}
