<?php

namespace App\Services;

use App\Enums\WalletTransactionType;
use App\Exceptions\InsufficientFundsException;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class WalletService
{
    /**
     * Credit a wallet, recording an immutable ledger row atomically.
     *
     * @param  Wallet|int  $wallet  Wallet instance or wallet id.
     * @param  numeric-string  $amount  Amount to credit as a numeric string.
     * @param  Model|null  $reference  Polymorphic reference (e.g. a Deposit).
     */
    public function credit(
        Wallet|int $wallet,
        string $amount,
        WalletTransactionType $type,
        ?Model $reference = null,
        ?string $description = null,
    ): WalletTransaction {
        return DB::transaction(function () use ($wallet, $amount, $type, $reference, $description) {
            $locked = $this->lock($wallet);

            $newBalance = bcadd($locked->balance, $amount, 2);

            $this->persistBalance($locked, $newBalance);

            return $this->record($locked, $type, $amount, $newBalance, $reference, $description);
        });
    }

    /**
     * Debit a wallet, recording an immutable ledger row atomically.
     *
     * Throws {@see InsufficientFundsException} when the debit would overdraw.
     *
     * @param  Wallet|int  $wallet  Wallet instance or wallet id.
     * @param  numeric-string  $amount  Amount to debit as a numeric string.
     * @param  Model|null  $reference  Polymorphic reference (e.g. a Ticket).
     */
    public function debit(
        Wallet|int $wallet,
        string $amount,
        WalletTransactionType $type,
        ?Model $reference = null,
        ?string $description = null,
    ): WalletTransaction {
        return DB::transaction(function () use ($wallet, $amount, $type, $reference, $description) {
            $locked = $this->lock($wallet);

            if (bccomp($locked->balance, $amount, 2) < 0) {
                throw new InsufficientFundsException($locked, $amount);
            }

            $newBalance = bcsub($locked->balance, $amount, 2);

            $this->persistBalance($locked, $newBalance);

            return $this->record($locked, $type, bcmul($amount, '-1', 2), $newBalance, $reference, $description);
        });
    }

    /**
     * Re-fetch the wallet and lock its row for the duration of the transaction.
     */
    private function lock(Wallet|int $wallet): Wallet
    {
        $id = $wallet instanceof Wallet ? $wallet->getKey() : $wallet;

        return Wallet::whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * Persist the new balance snapshot on the locked wallet row.
     *
     * @param  numeric-string  $newBalance
     */
    private function persistBalance(Wallet $wallet, string $newBalance): void
    {
        $wallet->balance = $newBalance;
        $wallet->save();
    }

    /**
     * Append an immutable ledger row.
     *
     * @param  numeric-string  $amount
     * @param  numeric-string  $balanceAfter
     */
    private function record(
        Wallet $wallet,
        WalletTransactionType $type,
        string $amount,
        string $balanceAfter,
        ?Model $reference,
        ?string $description,
    ): WalletTransaction {
        return $wallet->transactions()->create([
            'type' => $type,
            'amount' => $amount,
            'balance_after' => $balanceAfter,
            'reference_type' => $reference?->getMorphClass(),
            'reference_id' => $reference?->getKey(),
            'description' => $description,
        ]);
    }
}
