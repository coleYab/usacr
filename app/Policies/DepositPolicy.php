<?php

namespace App\Policies;

use App\Models\Deposit;
use App\Models\User;

class DepositPolicy
{
    /**
     * Determine whether the user can view any deposits.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the deposit.
     */
    public function view(User $user, Deposit $deposit): bool
    {
        return $user->isAdmin() || $user->id === $deposit->user_id;
    }

    /**
     * Determine whether the user can submit new deposit proofs.
     */
    public function create(User $user): bool
    {
        return $user->isActive();
    }

    /**
     * Determine whether the user can review (approve/reject) deposits.
     */
    public function review(User $user, Deposit $deposit): bool
    {
        return $user->isAdmin();
    }
}
