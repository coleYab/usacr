<?php

namespace App\Http\Controllers;

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Http\Resources\LotteryResource;
use App\Http\Resources\TicketResource;
use App\Models\Lottery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the standard user dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $wallet = $user->wallet;

        $endingSoonLotteries = Lottery::where('status', LotteryStatus::Active)
            ->where('draw_at', '>', now())
            ->orderBy('draw_at', 'asc')
            ->take(3)
            ->get();

        $recentTickets = $user->tickets()
            ->with('lottery')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('app/dashboard', [
            'stats' => [
                'wallet_balance' => $wallet ? money($wallet->balance) : money(0),
                'active_tickets_count' => $user->tickets()->where('status', TicketStatus::Active)->count(),
                'lotteries_won_count' => $user->tickets()->where('status', TicketStatus::Won)->count(),
                'total_spent' => money($user->tickets()->sum('price_paid')),
            ],
            'ending_soon_lotteries' => LotteryResource::collection($endingSoonLotteries)->resolve(),
            'recent_tickets' => TicketResource::collection($recentTickets)->resolve(),
        ]);
    }
}
