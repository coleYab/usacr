<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Wallet;

class WalletObserver
{
    /**
     * Create a wallet automatically whenever a user registers.
     */
    public function created(User $user): void
    {
        if (! $user->wallet()->exists()) {
            $user->wallet()->create();
        }
    }
}
