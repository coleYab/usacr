<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view user directory with pagination, search, and filters', function () {
    $admin = User::factory()->admin()->create();
    $targetUser = User::factory()->create(['name' => 'John Special', 'email' => 'john@special.com']);
    User::factory()->count(5)->create();

    $response = $this->actingAs($admin)->get(route('admin.users', ['search' => 'Special']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/users/index')
        ->has('users.data', 1)
        ->where('users.data.0.email', 'john@special.com')
        ->has('stats')
    );
});

test('admin can view 360-degree user profile detail page', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.users.show', $user));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/users/show')
        ->where('user.id', $user->id)
        ->has('tickets')
    );
});

test('admin can suspend and ban a user account with a stated reason', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['status' => User::STATUS_ACTIVE]);

    $response = $this->actingAs($admin)->post(route('admin.users.status', $user), [
        'status' => User::STATUS_SUSPENDED,
        'reason' => 'Suspicious fraudulent account activity.',
    ]);

    $response->assertRedirect();
    expect($user->fresh()->status)->toBe(User::STATUS_SUSPENDED);

    $this->assertDatabaseHas('admin_actions', [
        'admin_id' => $admin->id,
        'action_type' => 'user.suspended',
        'subject_id' => $user->id,
    ]);
});

test('admin cannot change the status of their own account', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.status', $admin), [
        'status' => User::STATUS_BANNED,
        'reason' => 'Attempting self-ban.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
    expect($admin->fresh()->status)->toBe(User::STATUS_ACTIVE);
});

test('non-admin user cannot access user management endpoints', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $this->actingAs($user)->get(route('admin.users'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.users.show', $otherUser))->assertForbidden();
    $this->actingAs($user)->post(route('admin.users.status', $otherUser), [
        'status' => User::STATUS_BANNED,
    ])->assertForbidden();
});

test('suspended or banned user is logged out and blocked on authenticated requests', function () {
    $user = User::factory()->create(['status' => User::STATUS_BANNED]);

    $this->actingAs($user)->get(route('app.dashboard'))->assertForbidden();
});
