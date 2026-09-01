<?php

use App\Models\User;

test('a standard user cannot access admin routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
});

test('an unauthenticated guest is redirected to login for admin routes', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('home'));
});

test('an admin can access the admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
});

test('a standard user can access the app dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('app.dashboard'))->assertOk();
});
