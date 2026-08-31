<?php

use Illuminate\Contracts\Console\Kernel;

require_once __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/app.php';
$app->make(Kernel::class)->bootstrap();

if (! defined('LARAVEL_VERSION')) {
    define('LARAVEL_VERSION', $app->version());
}
if (! defined('Larastan\Larastan\LARAVEL_VERSION')) {
    define('Larastan\Larastan\LARAVEL_VERSION', $app->version());
}
