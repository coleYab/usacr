<?php

use App\Enums\WalletTransactionType;
use App\Exceptions\InsufficientFundsException;
use App\Models\User;

test('admin can manually credit a user wallet with a reason', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $wallet = $user->wallet;

    $response = $this->actingAs($admin)->post(route('admin.users.adjust-wallet', $user), [
        'direction' => 'credit',
        'amount' => '150.00',
        'reason' => 'VIP Customer goodwill promotional bonus.',
    ]);

    $response->assertRedirect();
    expect($wallet->fresh()->balance)->toBe('150.00');

    $this->assertDatabaseHas('wallet_transactions', [
        'wallet_id' => $wallet->id,
        'type' => WalletTransactionType::AdminCredit->value,
        'amount' => '150.00',
    ]);

    $this->assertDatabaseHas('admin_actions', [
        'admin_id' => $admin->id,
        'action_type' => 'wallet.manual_credit',
        'subject_id' => $user->id,
    ]);
});

test('admin can manually debit a user wallet with a reason', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $wallet = $user->wallet;
    $wallet->update(['balance' => '200.00']);

    $response = $this->actingAs($admin)->post(route('admin.users.adjust-wallet', $user), [
        'direction' => 'debit',
        'amount' => '50.00',
        'reason' => 'Disputed charge reversal.',
    ]);

    $response->assertRedirect();
    expect($wallet->fresh()->balance)->toBe('150.00');

    $this->assertDatabaseHas('wallet_transactions', [
        'wallet_id' => $wallet->id,
        'type' => WalletTransactionType::AdminDebit->value,
        'amount' => '-50.00',
    ]);

    $this->assertDatabaseHas('admin_actions', [
        'admin_id' => $admin->id,
        'action_type' => 'wallet.manual_debit',
        'subject_id' => $user->id,
    ]);
});

test('admin cannot debit user wallet below zero balance', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $wallet = $user->wallet;
    $wallet->update(['balance' => '25.00']);

    $this->expectException(InsufficientFundsException::class);

    $this->withoutExceptionHandling()->actingAs($admin)->post(route('admin.users.adjust-wallet', $user), [
        'direction' => 'debit',
        'amount' => '100.00',
        'reason' => 'Excess deduction attempt.',
    ]);

    expect($wallet->fresh()->balance)->toBe('25.00');
});

test('non-admin cannot perform manual wallet adjustments', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $this->actingAs($user)->post(route('admin.users.adjust-wallet', $otherUser), [
        'direction' => 'credit',
        'amount' => '100.00',
        'reason' => 'Unauthorized adjustment attempt.',
    ])->assertForbidden();
});
