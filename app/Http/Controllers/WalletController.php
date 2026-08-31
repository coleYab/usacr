<?php

namespace App\Http\Controllers;

use App\Enums\DepositStatus;
use App\Http\Requests\StoreDepositRequest;
use App\Http\Resources\DepositResource;
use App\Http\Resources\WalletTransactionResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    /**
     * Show the user's wallet dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $wallet = $user->wallet()->firstOrCreate();

        $pendingDeposits = $user->deposits()
            ->where('status', DepositStatus::Pending)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $depositHistory = $user->deposits()
            ->whereIn('status', [DepositStatus::Approved, DepositStatus::Rejected])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $transactions = $wallet->transactions()
            ->filter($request->only(['type', 'from', 'to']))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('app/wallet', [
            'balance' => money($wallet->balance),
            'pending' => present_paginator($pendingDeposits, fn ($items) => DepositResource::collection($items)->resolve()),
            'history' => present_paginator($depositHistory, fn ($items) => DepositResource::collection($items)->resolve()),
            'transactions' => present_paginator($transactions, fn ($items) => WalletTransactionResource::collection($items)->resolve()),
            'filters' => [
                'type' => $request->input('type', 'all'),
                'from' => $request->input('from', ''),
                'to' => $request->input('to', ''),
            ],
        ]);
    }

    /**
     * Create a new pending deposit request.
     */
    public function store(StoreDepositRequest $request): RedirectResponse
    {
        $user = $request->user();

        $receipt = $request->file('receipt');
        $path = $receipt->storeAs(
            'receipts/'.$user->id,
            Str::uuid().'.'.$receipt->extension(),
            'public',
        );

        $user->deposits()->create([
            'amount' => $request->input('amount'),
            'receipt_path' => $path,
            'status' => DepositStatus::Pending,
        ]);

        return back()->with('success', 'Deposit request submitted and pending review.');
    }
}
