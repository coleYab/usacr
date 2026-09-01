<?php

use App\Models\User;

test('guests are redirected to the landing page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('home'));
});

test('authenticated users are redirected from the legacy dashboard route', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))->assertRedirect(route('app.dashboard'));
});

test('authenticated users can visit the app dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('app.dashboard'));
    $response->assertOk();
});
