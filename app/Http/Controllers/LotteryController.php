<?php

namespace App\Http\Controllers;

use App\Enums\LotteryStatus;
use App\Http\Requests\PurchaseTicketsRequest;
use App\Http\Resources\LotteryResource;
use App\Http\Resources\TicketResource;
use App\Models\Lottery;
use App\Services\TicketPurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LotteryController extends Controller
{
    /**
     * Display a paginated list/grid of lotteries.
     */
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'active');
        $search = $request->input('search');

        $baseQuery = Lottery::query()->search($search);

        $activeQuery = (clone $baseQuery)
            ->where('status', LotteryStatus::Active)
            ->where('draw_at', '>', now());

        $endingSoonQuery = (clone $baseQuery)
            ->where('status', LotteryStatus::Active)
            ->where('draw_at', '>', now())
            ->orderBy('draw_at', 'asc');

        $allQuery = (clone $baseQuery)
            ->whereIn('status', [LotteryStatus::Active, LotteryStatus::Completed, LotteryStatus::Cancelled])
            ->latest();

        $query = match ($tab) {
            'ending_soon' => $endingSoonQuery,
            'all' => $allQuery,
            default => (clone $activeQuery)->latest(),
        };

        $lotteries = $query->paginate(12)->withQueryString();

        return Inertia::render('app/lotteries', [
            'lotteries' => present_paginator(
                $lotteries,
                fn ($items) => LotteryResource::collection($items)->resolve(),
            ),
            'filters' => [
                'tab' => $tab,
                'search' => $search ?? '',
            ],
            'counts' => [
                'active' => (clone $baseQuery)->where('status', LotteryStatus::Active)->where('draw_at', '>', now())->count(),
                'ending_soon' => (clone $baseQuery)->where('status', LotteryStatus::Active)->where('draw_at', '>', now())->where('draw_at', '<=', now()->addHours(24))->count(),
                'all' => (clone $baseQuery)->whereIn('status', [LotteryStatus::Active, LotteryStatus::Completed, LotteryStatus::Cancelled])->count(),
            ],
        ]);
    }

    /**
     * Display the specified lottery detail page.
     */
    public function show(Lottery $lottery, Request $request): Response
    {
        $user = $request->user();

        $userTickets = $user
            ? $user->tickets()->where('lottery_id', $lottery->id)->latest()->get()
            : collect();

        return Inertia::render('app/lotteries/show', [
            'lottery' => (new LotteryResource($lottery))->resolve(),
            'userTickets' => TicketResource::collection($userTickets)->resolve(),
            'walletBalance' => $user?->wallet ? money($user->wallet->balance) : money(0),
        ]);
    }

    /**
     * Purchase tickets for the specified lottery.
     */
    public function purchase(
        Lottery $lottery,
        PurchaseTicketsRequest $request,
        TicketPurchaseService $purchaseService,
    ): RedirectResponse {
        $user = $request->user();
        $quantity = (int) $request->input('quantity');

        $tickets = $purchaseService->purchase($user, $lottery, $quantity);

        $codes = array_map(fn ($ticket) => $ticket->ticket_code, $tickets);

        return back()
            ->with('success', "{$quantity} ቲኬት(ቶች) በተሳካ ሁኔታ ተገዝተዋል!")
            ->with('purchased_tickets', $codes);
    }
}
