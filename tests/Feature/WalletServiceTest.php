<?php

use App\Enums\WalletTransactionType;
use App\Exceptions\InsufficientFundsException;
use App\Models\Deposit;
use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;

test('a user gets a wallet with zero balance on registration', function () {
    $user = User::factory()->create();

    $wallet = $user->wallet;

    expect($wallet)->toBeInstanceOf(Wallet::class);
    expect($wallet->balance)->toBe('0.00');
});

test('credit increases the balance and writes an immutable ledger row', function () {
    $wallet = User::factory()->create()->wallet;

    $service = app(WalletService::class);
    $service->credit($wallet, '100.00', WalletTransactionType::DepositCredit);

    expect($wallet->refresh()->balance)->toBe('100.00');
    $this->assertDatabaseHas('wallet_transactions', [
        'wallet_id' => $wallet->id,
        'type' => 'deposit_credit',
        'amount' => '100.00',
        'balance_after' => '100.00',
    ]);
});

test('credit records the running balance after multiple transactions', function () {
    $wallet = User::factory()->create()->wallet;
    $service = app(WalletService::class);

    $service->credit($wallet, '100.00', WalletTransactionType::DepositCredit);
    $service->debit($wallet, '25.00', WalletTransactionType::TicketPurchase);
    $service->credit($wallet, '10.00', WalletTransactionType::AdminCredit);

    expect($wallet->refresh()->balance)->toBe('85.00');
    $this->assertDatabaseHas('wallet_transactions', [
        'wallet_id' => $wallet->id,
        'type' => 'ticket_purchase',
        'amount' => '-25.00',
        'balance_after' => '75.00',
    ]);
});

test('credit records a polymorphic reference when provided', function () {
    $user = User::factory()->create();
    $wallet = $user->wallet;
    $deposit = Deposit::factory()->create(['user_id' => $user->id, 'amount' => '50.00']);

    app(WalletService::class)->credit(
        $wallet,
        '50.00',
        WalletTransactionType::DepositCredit,
        $deposit,
        'Deposit approved',
    );

    $this->assertDatabaseHas('wallet_transactions', [
        'wallet_id' => $wallet->id,
        'reference_type' => $deposit->getMorphClass(),
        'reference_id' => $deposit->id,
        'description' => 'Deposit approved',
    ]);
});

test('debit accepts a wallet id instead of an instance', function () {
    $wallet = User::factory()->create()->wallet;
    $service = app(WalletService::class);

    $service->credit($wallet, '50.00', WalletTransactionType::DepositCredit);
    $service->debit($wallet->id, '20.00', WalletTransactionType::TicketPurchase);

    expect($wallet->refresh()->balance)->toBe('30.00');
});

test('debit throws an insufficient funds exception when the balance would go negative', function () {
    $wallet = User::factory()->create()->wallet;
    $service = app(WalletService::class);

    $service->debit($wallet, '10.00', WalletTransactionType::TicketPurchase);
})->throws(InsufficientFundsException::class);

test('a failed debit leaves balance and ledger untouched', function () {
    $wallet = User::factory()->create()->wallet;
    $service = app(WalletService::class);

    try {
        $service->debit($wallet, '10.00', WalletTransactionType::TicketPurchase);
    } catch (InsufficientFundsException) {
        // expected
    }

    expect($wallet->refresh()->balance)->toBe('0.00');
    $this->assertDatabaseCount('wallet_transactions', 0);
});
