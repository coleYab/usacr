<?php

use App\Models\AdminAction;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view audit trail log with search and action filters', function () {
    $admin = User::factory()->admin()->create();
    $targetUser = User::factory()->create();

    $action = AdminAction::create([
        'admin_id' => $admin->id,
        'action_type' => 'user.suspended',
        'subject_type' => $targetUser->getMorphClass(),
        'subject_id' => $targetUser->id,
        'description' => 'Suspended test user for compliance verification.',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.audit', ['action_type' => 'user.suspended']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/audit')
        ->has('actions.data', 1)
        ->where('actions.data.0.id', $action->id)
        ->has('stats')
        ->has('admins')
    );
});

test('admin actions are strictly immutable and cannot be updated or deleted', function () {
    $admin = User::factory()->admin()->create();

    $action = AdminAction::create([
        'admin_id' => $admin->id,
        'action_type' => 'test.immutable',
        'subject_type' => $admin->getMorphClass(),
        'subject_id' => $admin->id,
        'description' => 'Test immutability check.',
    ]);

    expect(fn () => $action->update(['description' => 'Modified description']))
        ->toThrow(LogicException::class, 'AdminAction records are immutable and cannot be updated.');

    expect(fn () => $action->delete())
        ->toThrow(LogicException::class, 'AdminAction records are immutable and cannot be deleted.');
});

test('non-admin cannot access audit trail log', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.audit'))->assertForbidden();
});
