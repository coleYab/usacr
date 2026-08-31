<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DepositStatus;
use App\Enums\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\RejectDepositRequest;
use App\Http\Resources\DepositResource;
use App\Models\Deposit;
use App\Models\User;
use App\Notifications\DepositStatusNotification;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DepositController extends Controller
{
    /**
     * Show the admin deposit verification queue and history.
     */
    public function index(): Response
    {
        $pending = Deposit::with('user')->where('status', DepositStatus::Pending)->latest()->paginate(10)->withQueryString();
        $approved = Deposit::with('user')->where('status', DepositStatus::Approved)->latest()->paginate(10)->withQueryString();
        $rejected = Deposit::with('user')->where('status', DepositStatus::Rejected)->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/deposits', [
            'counts' => [
                'pending' => $pending->total(),
                'approved' => $approved->total(),
                'rejected' => $rejected->total(),
            ],
            'deposits' => [
                'pending' => present_paginator($pending, fn ($items) => DepositResource::collection($items)->resolve()),
                'approved' => present_paginator($approved, fn ($items) => DepositResource::collection($items)->resolve()),
                'rejected' => present_paginator($rejected, fn ($items) => DepositResource::collection($items)->resolve()),
            ],
        ]);
    }

    /**
     * Approve a pending deposit and credit the user's wallet.
     */
    public function approve(Deposit $deposit, Request $request): RedirectResponse
    {
        $admin = $request->user();

        DB::transaction(function () use ($deposit, $admin) {
            $locked = Deposit::whereKey($deposit->id)->lockForUpdate()->firstOrFail();

            abort_unless($locked->status === DepositStatus::Pending, 422, 'This deposit has already been reviewed.');

            $locked->update([
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            app(WalletService::class)->credit(
                $locked->user->wallet,
                (string) $locked->amount,
                WalletTransactionType::DepositCredit,
                $locked,
                'Deposit approved',
            );

            $this->logAction($admin, 'deposit.approved', $locked, 'Approved deposit of '.money($locked->amount).'.');

            $locked->user->notify(new DepositStatusNotification($locked));
        });

        return back()->with('success', 'Deposit approved and wallet credited.');
    }

    /**
     * Reject a pending deposit without touching the wallet.
     */
    public function reject(Deposit $deposit, RejectDepositRequest $request): RedirectResponse
    {
        $admin = $request->user();

        DB::transaction(function () use ($deposit, $admin, $request) {
            $locked = Deposit::whereKey($deposit->id)->lockForUpdate()->firstOrFail();

            abort_unless($locked->status === DepositStatus::Pending, 422, 'This deposit has already been reviewed.');

            $locked->update([
                'status' => DepositStatus::Rejected,
                'rejection_reason' => $request->input('reason'),
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            $this->logAction($admin, 'deposit.rejected', $locked, 'Rejected deposit of '.money($locked->amount).'.');

            $locked->user->notify(new DepositStatusNotification($locked));
        });

        return back()->with('success', 'Deposit rejected.');
    }

    /**
     * Record an admin action for the audit trail.
     */
    private function logAction(User $admin, string $actionType, Deposit $deposit, string $description): void
    {
        $admin->adminActions()->create([
            'action_type' => $actionType,
            'subject_type' => $deposit->getMorphClass(),
            'subject_id' => $deposit->id,
            'description' => $description,
        ]);
    }
}
