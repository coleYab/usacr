<?php

namespace App\Policies;

use App\Enums\LotteryStatus;
use App\Models\Lottery;
use App\Models\User;

class LotteryPolicy
{
    /**
     * Determine whether the user can view any lotteries.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the lottery.
     */
    public function view(?User $user, Lottery $lottery): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create lotteries.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can cancel the lottery.
     */
    public function cancel(User $user, Lottery $lottery): bool
    {
        return $user->isAdmin() && $lottery->status === LotteryStatus::Active;
    }

    /**
     * Determine whether the user can purchase tickets for the lottery.
     */
    public function purchase(User $user, Lottery $lottery): bool
    {
        return $user->isActive() && $lottery->isOpen();
    }
}
