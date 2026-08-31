<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DepositStatus;
use App\Enums\LotteryStatus;
use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\Deposit;
use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Wallet;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the comprehensive administrative dashboard.
     */
    public function index(): Response
    {
        $recentActions = AdminAction::with('admin')->latest()->take(6)->get();
        $recentDraws = DrawLog::with(['lottery', 'winningTicket.user'])->latest('processed_at')->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'total_platform_balance' => money(Wallet::sum('balance')),
                'pending_deposits_count' => Deposit::where('status', DepositStatus::Pending)->count(),
                'active_lotteries_count' => Lottery::where('status', LotteryStatus::Active)->where('draw_at', '>', now())->count(),
                'tickets_sold_today' => Ticket::whereDate('created_at', today())->count(),
                'tickets_sold_total' => Ticket::count(),
            ],
            'recent_actions' => $recentActions->map(function (AdminAction $action) {
                return [
                    'id' => $action->id,
                    'admin_name' => $action->admin->name,
                    'action_type' => $action->action_type,
                    'description' => $action->description,
                    'created_at_formatted' => $action->created_at?->format('M j, g:i A'),
                    'created_at_diff' => $action->created_at?->diffForHumans(),
                ];
            }),
            'recent_draws' => $recentDraws->map(function (DrawLog $draw) {
                return [
                    'id' => $draw->id,
                    'lottery_id' => $draw->lottery_id,
                    'lottery_title' => $draw->lottery ? $draw->lottery->title : 'Unknown Raffle',
                    'winning_ticket_code' => $draw->winningTicket->ticket_code,
                    'winner_name' => $draw->winningTicket->user->name,
                    'total_participants' => $draw->total_participants,
                    'total_tickets' => $draw->total_tickets,
                    'processed_at_formatted' => $draw->processed_at->format('M j, g:i A'),
                    'processed_at_diff' => $draw->processed_at->diffForHumans(),
                ];
            }),
        ]);
    }
}
