<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/**
 * Generate a valid, freshly-signed Telegram initData query string for a user.
 */
function signedTelegramInitData(array $user): string
{
    $userJson = json_encode($user + ['id' => $user['id'] ?? fake()->unique()->numberBetween(100000000, 999999999)]);

    $data = [
        'auth_date' => now()->getTimestamp(),
        'user' => $userJson,
    ];

    ksort($data);

    $dataCheckString = collect($data)
        ->map(static fn ($value, $key): string => $key.'='.$value)
        ->implode("\n");

    $secretKey = hash_hmac('sha256', config('telegram.bot_token'), 'WebAppData', true);
    $hash = hash_hmac('sha256', $dataCheckString, $secretKey);

    return http_build_query($data).'&hash='.$hash;
}
