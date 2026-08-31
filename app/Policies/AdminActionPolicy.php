<?php

namespace App\Policies;

use App\Models\AdminAction;
use App\Models\User;

class AdminActionPolicy
{
    /**
     * Determine whether the user can view any admin audit actions.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the admin audit action.
     */
    public function view(User $user, AdminAction $adminAction): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can create audit actions.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the audit action (always forbidden — immutable).
     */
    public function update(User $user, AdminAction $adminAction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the audit action (always forbidden — immutable).
     */
    public function delete(User $user, AdminAction $adminAction): bool
    {
        return false;
    }
}
