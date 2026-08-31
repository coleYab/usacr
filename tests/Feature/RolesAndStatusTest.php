<?php

use App\Models\User;

test('a standard user cannot access admin routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
});

test('an unauthenticated guest is redirected to login for admin routes', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('an admin can access the admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
});

test('a standard user can access the app dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('app.dashboard'))->assertOk();
});

test('a suspended user cannot log in and receives a clear message', function () {
    $user = User::factory()->suspended()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
    expect(session('errors')->first('email'))->toBe('This account has been suspended.');
});

test('a banned user cannot log in and receives a clear message', function () {
    $user = User::factory()->banned()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
    expect(session('errors')->first('email'))->toBe('This account has been banned.');
});

test('an active user can still log in', function () {
    $user = User::factory()->create();

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($user);
});
