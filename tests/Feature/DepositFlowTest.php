<?php

use App\Enums\DepositStatus;
use App\Models\Deposit;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a guest cannot submit a deposit request', function () {
    $this->post(route('app.wallet.deposits.store'), [
        'amount' => '50.00',
        'receipt' => UploadedFile::fake()->image('receipt.png'),
    ])->assertRedirect(route('login'));
});

test('a user can submit a deposit request that is stored as pending', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('app.wallet.deposits.store'), [
        'amount' => '75.00',
        'receipt' => UploadedFile::fake()->image('receipt.png'),
    ]);

    $response->assertRedirect()->assertSessionHas('success');

    $deposit = Deposit::where('user_id', $user->id)->firstOrFail();

    expect($deposit->amount)->toBe('75.00');
    expect($deposit->status)->toBe(DepositStatus::Pending);
    expect($deposit->receipt_path)->not->toBeNull();
    expect(Storage::disk('public')->exists($deposit->receipt_path))->toBeTrue();
});

test('a deposit request requires a minimum amount', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('app.wallet.deposits.store'), [
        'amount' => '0',
        'receipt' => UploadedFile::fake()->image('receipt.png'),
    ])->assertSessionHasErrors('amount');

    $this->assertDatabaseCount('deposits', 0);
});

test('a deposit request requires a receipt file', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('app.wallet.deposits.store'), [
        'amount' => '75.00',
    ])->assertSessionHasErrors('receipt');

    $this->assertDatabaseCount('deposits', 0);
});

test('a non-admin cannot approve a deposit', function () {
    $user = User::factory()->create();
    $deposit = Deposit::factory()->pending()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('admin.deposits.approve', $deposit))
        ->assertForbidden();

    expect($deposit->fresh()->status)->toBe(DepositStatus::Pending);
    $this->assertDatabaseCount('admin_actions', 0);
});

test('an admin approving a deposit credits the wallet and logs the action', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $deposit = Deposit::factory()->pending()->withReceipt()->create([
        'user_id' => $user->id,
        'amount' => '100.00',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.deposits.approve', $deposit))
        ->assertRedirect()
        ->assertSessionHas('success');

    $deposit->refresh();

    expect($deposit->status)->toBe(DepositStatus::Approved);
    expect($deposit->reviewed_by)->toBe($admin->id);
    expect($deposit->reviewed_at)->not->toBeNull();
    expect($user->wallet->refresh()->balance)->toBe('100.00');

    $this->assertDatabaseHas('wallet_transactions', [
        'wallet_id' => $user->wallet->id,
        'type' => 'deposit_credit',
        'amount' => '100.00',
    ]);
    $this->assertDatabaseHas('admin_actions', [
        'admin_id' => $admin->id,
        'action_type' => 'deposit.approved',
        'subject_type' => $deposit->getMorphClass(),
        'subject_id' => $deposit->id,
    ]);
});

test('approving an already-reviewed deposit does not credit twice', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $deposit = Deposit::factory()->approved()->create([
        'user_id' => $user->id,
        'amount' => '100.00',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.deposits.approve', $deposit))
        ->assertStatus(422);

    $this->assertDatabaseCount('wallet_transactions', 0);
    $this->assertDatabaseCount('admin_actions', 0);
});

test('an admin rejecting a deposit records the reason without a wallet change', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $deposit = Deposit::factory()->pending()->create([
        'user_id' => $user->id,
        'amount' => '100.00',
    ]);

    $this->actingAs($admin)->post(route('admin.deposits.reject', $deposit), [
        'reason' => 'The receipt is unreadable, please resubmit.',
    ])->assertRedirect()->assertSessionHas('success');

    $deposit->refresh();

    expect($deposit->status)->toBe(DepositStatus::Rejected);
    expect($deposit->rejection_reason)->toBe('The receipt is unreadable, please resubmit.');
    expect($deposit->reviewed_by)->toBe($admin->id);
    expect($user->wallet->refresh()->balance)->toBe('0.00');
    $this->assertDatabaseCount('wallet_transactions', 0);
    $this->assertDatabaseHas('admin_actions', [
        'admin_id' => $admin->id,
        'action_type' => 'deposit.rejected',
        'subject_id' => $deposit->id,
    ]);
});

test('rejecting a deposit requires a reason with minimum 10 characters', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $deposit = Deposit::factory()->pending()->create(['user_id' => $user->id]);

    $this->actingAs($admin)->post(route('admin.deposits.reject', $deposit), [
        'reason' => 'Too short',
    ])->assertSessionHasErrors('reason');

    expect($deposit->fresh()->status)->toBe(DepositStatus::Pending);
});

test('a non-admin cannot reject a deposit', function () {
    $user = User::factory()->create();
    $deposit = Deposit::factory()->pending()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('admin.deposits.reject', $deposit), [
            'reason' => 'Some rejection reason',
        ])
        ->assertForbidden();

    expect($deposit->fresh()->status)->toBe(DepositStatus::Pending);
});

test('rejecting an already-reviewed deposit returns 422', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $deposit = Deposit::factory()->approved()->create(['user_id' => $user->id]);

    $this->actingAs($admin)
        ->post(route('admin.deposits.reject', $deposit), [
            'reason' => 'Some rejection reason here',
        ])
        ->assertStatus(422);

    $this->assertDatabaseCount('admin_actions', 0);
});

test('the wallet page shows the pending deposit and balance', function () {
    $user = User::factory()->create();
    Deposit::factory()->pending()->create(['user_id' => $user->id, 'amount' => '123.45']);

    $this->actingAs($user)
        ->get(route('app.wallet'))
        ->assertOk()
        ->assertSee('$123.45');
});

test('the wallet page shows rejected deposits with rejection reasons', function () {
    $user = User::factory()->create();
    Deposit::factory()->rejected('Receipt was illegible')->create([
        'user_id' => $user->id,
        'amount' => '45.00',
    ]);

    $this->actingAs($user)
        ->get(route('app.wallet'))
        ->assertOk()
        ->assertSee('Receipt was illegible');
});

test('the admin deposits page lists pending deposits', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    Deposit::factory()->pending()->create([
        'user_id' => $user->id,
        'amount' => '250.00',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.deposits'))
        ->assertOk()
        ->assertSee('$250.00')
        ->assertSee($user->email);
});
