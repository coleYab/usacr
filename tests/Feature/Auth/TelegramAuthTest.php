<?php

use App\Models\User;

test('a fresh telegram user is authenticated and prompted for their phone', function () {
    $initData = signedTelegramInitData([
        'first_name' => 'Kibrom',
        'last_name' => 'Tesfaye',
        'username' => 'kibrom',
        'id' => 555111,
    ]);

    $response = $this->postJson(route('auth.telegram'), [], ['X-Telegram-Init-Data' => $initData]);

    $response->assertOk()
        ->assertJsonPath('needs_phone', true)
        ->assertJsonPath('is_admin', false);

    $user = User::where('telegram_id', 555111)->first();

    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Kibrom Tesfaye');
    expect($user->telegram_username)->toBe('kibrom');
    expect($user->role)->toBe(User::ROLE_USER);

    $this->assertAuthenticatedAs($user);
});

test('a suspended user cannot authenticate via telegram', function () {
    $user = User::factory()->suspended()->create(['telegram_id' => 555222]);
    $initData = signedTelegramInitData(['id' => 555222, 'first_name' => 'Suspended']);

    $this->postJson(route('auth.telegram'), [], ['X-Telegram-Init-Data' => $initData])
        ->assertStatus(403)
        ->assertJsonPath('error', 'This account has been suspended.');

    $this->assertGuest();
});

test('a banned user cannot authenticate via telegram', function () {
    $user = User::factory()->banned()->create(['telegram_id' => 555333]);
    $initData = signedTelegramInitData(['id' => 555333, 'first_name' => 'Banned']);

    $this->postJson(route('auth.telegram'), [], ['X-Telegram-Init-Data' => $initData])
        ->assertStatus(403)
        ->assertJsonPath('error', 'This account has been banned.');

    $this->assertGuest();
});

test('an admin telegram id is assigned the admin role', function () {
    config(['telegram.admin_ids' => ['777111']]);

    $initData = signedTelegramInitData(['id' => 777111, 'first_name' => 'Boss']);

    $this->postJson(route('auth.telegram'), [], ['X-Telegram-Init-Data' => $initData])
        ->assertOk()
        ->assertJsonPath('is_admin', true);

    $user = User::where('telegram_id', 777111)->first();
    expect($user->role)->toBe(User::ROLE_ADMIN);
});

test('a phone number can be stored for an authenticated telegram user without initData header', function () {
    $user = User::factory()->create(['telegram_id' => 888111]);

    // Build a validly-signed contact payload (same signing scheme as initData).
    $contactData = ['auth_date' => now()->getTimestamp(), 'contact' => json_encode(['user_id' => $user->telegram_id, 'phone_number' => '+251911223344'])];
    ksort($contactData);
    $dataCheckString = collect($contactData)
        ->map(static fn ($value, $key): string => $key.'='.$value)
        ->implode("\n");
    $secretKey = hash_hmac('sha256', config('telegram.bot_token'), 'WebAppData', true);
    $hash = hash_hmac('sha256', $dataCheckString, $secretKey);
    $rawContact = http_build_query($contactData).'&hash='.$hash;

    $this->actingAs($user)
        ->postJson(route('auth.telegram.phone'), ['contact' => $rawContact])
        ->assertOk()
        ->assertJsonPath('phone', '+251911223344');

    expect($user->fresh()->phone)->toBe('+251911223344');
});

test('storing phone fails if contact user_id does not match authenticated user', function () {
    $user = User::factory()->create(['telegram_id' => 888111]);

    // Signed contact payload for a DIFFERENT user id (999222).
    $contactData = ['auth_date' => now()->getTimestamp(), 'contact' => json_encode(['user_id' => 999222, 'phone_number' => '+251911223344'])];
    ksort($contactData);
    $dataCheckString = collect($contactData)
        ->map(static fn ($value, $key): string => $key.'='.$value)
        ->implode("\n");
    $secretKey = hash_hmac('sha256', config('telegram.bot_token'), 'WebAppData', true);
    $hash = hash_hmac('sha256', $dataCheckString, $secretKey);
    $rawContact = http_build_query($contactData).'&hash='.$hash;

    $this->actingAs($user)
        ->postJson(route('auth.telegram.phone'), ['contact' => $rawContact])
        ->assertStatus(422)
        ->assertJsonPath('error', 'Contact does not match the authenticated user.');
});

test('storing phone fails if contact signature is invalid', function () {
    $user = User::factory()->create(['telegram_id' => 888111]);

    $contactData = ['auth_date' => now()->getTimestamp(), 'contact' => json_encode(['user_id' => $user->telegram_id, 'phone_number' => '+251911223344'])];
    $rawContact = http_build_query($contactData).'&hash=invalid_signature';

    $this->actingAs($user)
        ->postJson(route('auth.telegram.phone'), ['contact' => $rawContact])
        ->assertStatus(422)
        ->assertJsonPath('error', 'Invalid contact data.');
});

test('storing phone fails if contact payload is missing', function () {
    $user = User::factory()->create(['telegram_id' => 888111]);

    $this->actingAs($user)
        ->postJson(route('auth.telegram.phone'), [])
        ->assertStatus(422)
        ->assertJsonPath('error', 'Missing contact data.');
});

test('unauthenticated request to store phone is rejected', function () {
    $this->postJson(route('auth.telegram.phone'), ['contact' => 'something'])
        ->assertStatus(401);
});

test('a user can log out via the telegram logout endpoint', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('auth.telegram.logout'))
        ->assertOk();

    $this->assertGuest();
});
