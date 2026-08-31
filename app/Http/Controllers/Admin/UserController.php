<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DepositStatus;
use App\Enums\TicketStatus;
use App\Enums\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustWalletRequest;
use App\Http\Requests\UpdateUserStatusRequest;
use App\Http\Resources\TicketResource;
use App\Http\Resources\WalletTransactionResource;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of registered users.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $role = $request->input('role', 'all');
        $status = $request->input('status', 'all');

        $query = User::with(['wallet'])
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role !== 'all', fn ($q) => $q->where('role', $role))
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->latest();

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => present_paginator($users, function (array $items) {
                return array_map(function (User $user) {
                    $lifetimeDeposits = (string) $user->deposits()
                        ->where('status', DepositStatus::Approved)
                        ->sum('amount');

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'status' => $user->status,
                        'balance' => $user->wallet ? $user->wallet->balance : '0.00',
                        'balance_formatted' => $user->wallet ? money($user->wallet->balance) : money(0),
                        'lifetime_deposits' => $lifetimeDeposits,
                        'lifetime_deposits_formatted' => money($lifetimeDeposits),
                        'tickets_count' => $user->tickets()->count(),
                        'lotteries_won_count' => $user->tickets()->where('status', TicketStatus::Won)->count(),
                        'created_at' => $user->created_at?->toISOString(),
                        'created_at_formatted' => $user->created_at?->format('M j, Y'),
                        'created_at_diff' => $user->created_at?->diffForHumans(),
                    ];
                }, $items);
            }),
            'stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('status', User::STATUS_ACTIVE)->count(),
                'suspended_users' => User::where('status', User::STATUS_SUSPENDED)->count(),
                'banned_users' => User::where('status', User::STATUS_BANNED)->count(),
            ],
            'filters' => [
                'search' => $search ?? '',
                'role' => $role,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Display a 360-degree profile view of a single user.
     */
    public function show(User $user, Request $request): Response
    {
        $wallet = $user->wallet;

        $lifetimeDeposits = (string) $user->deposits()
            ->where('status', DepositStatus::Approved)
            ->sum('amount');

        $ticketsQuery = $user->tickets()->with('lottery')->latest();
        $tickets = $ticketsQuery->paginate(10, ['*'], 'tickets_page')->withQueryString();

        $ledger = $wallet
            ? $wallet->transactions()->latest()->paginate(10, ['*'], 'ledger_page')->withQueryString()
            : null;

        $totalSpent = (string) $user->tickets()->sum('price_paid');
        $lotteriesWon = $user->tickets()->where('status', TicketStatus::Won)->count();
        $activeTickets = $user->tickets()->where('status', TicketStatus::Active)->count();

        return Inertia::render('admin/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'balance' => $wallet ? $wallet->balance : '0.00',
                'balance_formatted' => $wallet ? money($wallet->balance) : money(0),
                'lifetime_deposits' => $lifetimeDeposits,
                'lifetime_deposits_formatted' => money($lifetimeDeposits),
                'total_spent' => $totalSpent,
                'total_spent_formatted' => money($totalSpent),
                'tickets_count' => $user->tickets()->count(),
                'active_tickets_count' => $activeTickets,
                'lotteries_won_count' => $lotteriesWon,
                'created_at' => $user->created_at?->toISOString(),
                'created_at_formatted' => $user->created_at?->format('M j, Y g:i A'),
                'created_at_diff' => $user->created_at?->diffForHumans(),
            ],
            'tickets' => present_paginator($tickets, fn ($items) => TicketResource::collection($items)->resolve()),
            'ledger' => $ledger ? present_paginator($ledger, fn ($items) => WalletTransactionResource::collection($items)->resolve()) : null,
        ]);
    }

    /**
     * Update user moderation status (active, suspended, banned).
     */
    public function updateStatus(User $user, UpdateUserStatusRequest $request): RedirectResponse
    {
        $admin = $request->user();

        if ($user->id === $admin->id) {
            return back()->with('error', 'You cannot change the status of your own admin account.');
        }

        $status = $request->input('status');
        $reason = $request->input('reason');
        $oldStatus = $user->status;

        $user->update([
            'status' => $status,
        ]);

        $actionType = match ($status) {
            User::STATUS_SUSPENDED => 'user.suspended',
            User::STATUS_BANNED => 'user.banned',
            default => 'user.reactivated',
        };

        $description = "Updated status of user '{$user->email}' from {$oldStatus} to {$status}."
            .($reason ? " Reason: {$reason}" : '');

        $admin->adminActions()->create([
            'action_type' => $actionType,
            'subject_type' => $user->getMorphClass(),
            'subject_id' => $user->id,
            'description' => $description,
        ]);

        return back()->with('success', "User account status updated to {$status}.");
    }

    /**
     * Perform a manual credit or debit adjustment on the user's wallet.
     */
    public function adjustWallet(User $user, AdjustWalletRequest $request, WalletService $walletService): RedirectResponse
    {
        $admin = $request->user();
        /** @var numeric-string $amount */
        $amount = (string) $request->input('amount');
        $direction = $request->input('direction');
        $reason = (string) $request->input('reason');

        $wallet = $user->wallet;
        if (! $wallet) {
            return back()->with('error', 'User wallet could not be found.');
        }

        DB::transaction(function () use ($admin, $user, $wallet, $amount, $direction, $reason, $walletService) {
            if ($direction === 'credit') {
                $walletService->credit(
                    $wallet,
                    $amount,
                    WalletTransactionType::AdminCredit,
                    $admin,
                    "Admin manual credit: {$reason}",
                );

                $admin->adminActions()->create([
                    'action_type' => 'wallet.manual_credit',
                    'subject_type' => $user->getMorphClass(),
                    'subject_id' => $user->id,
                    'description' => 'Manually credited '.money($amount)." to user '{$user->email}'. Reason: {$reason}",
                ]);
            } else {
                $walletService->debit(
                    $wallet,
                    $amount,
                    WalletTransactionType::AdminDebit,
                    $admin,
                    "Admin manual debit: {$reason}",
                );

                $admin->adminActions()->create([
                    'action_type' => 'wallet.manual_debit',
                    'subject_type' => $user->getMorphClass(),
                    'subject_id' => $user->id,
                    'description' => 'Manually debited '.money($amount)." from user '{$user->email}'. Reason: {$reason}",
                ]);
            }
        });

        return back()->with('success', 'Wallet adjustment successfully processed.');
    }
}
