<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LotteryStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\LotteryResource;
use App\Models\DrawLog;
use App\Models\Lottery;
use App\Services\DrawService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DrawController extends Controller
{
    /**
     * Display automated draw logs and audit history.
     */
    public function index(Request $request): Response
    {
        $logs = DrawLog::with(['lottery', 'winningTicket.user'])
            ->latest('processed_at')
            ->paginate(15)
            ->withQueryString();

        $pendingCount = Lottery::where('status', LotteryStatus::Active)
            ->where('draw_at', '<=', now())
            ->count();

        return Inertia::render('admin/draws', [
            'draws' => present_paginator($logs, function (array $items) {
                return array_map(function (DrawLog $log) {
                    $lottery = $log->lottery;
                    $winningTicket = $log->winningTicket;
                    $winner = $winningTicket->user;

                    return [
                        'id' => $log->id,
                        'lottery_id' => $log->lottery_id,
                        'lottery_title' => $lottery ? $lottery->title : 'Unknown Raffle',
                        'lottery_thumbnail' => $lottery && ! empty($lottery->media) ? (new LotteryResource($lottery))->resolve()['media'][0] ?? null : null,
                        'winning_ticket_code' => $winningTicket->ticket_code,
                        'winner_name' => $winner->name,
                        'winner_email' => $winner->email,
                        'total_participants' => $log->total_participants,
                        'total_tickets' => $log->total_tickets,
                        'verification_seed' => $log->verification_seed,
                        'verification_hash' => $log->verification_hash,
                        'processed_at' => $log->processed_at->toISOString(),
                        'processed_at_formatted' => $log->processed_at->format('M j, Y g:i A'),
                        'processed_at_diff' => $log->processed_at->diffForHumans(),
                    ];
                }, $items);
            }),
            'stats' => [
                'total_draws' => DrawLog::count(),
                'total_tickets_drawn' => (int) DrawLog::sum('total_tickets'),
                'total_participants' => (int) DrawLog::sum('total_participants'),
                'pending_count' => $pendingCount,
            ],
        ]);
    }

    /**
     * Manually trigger draw execution for due lotteries.
     */
    public function run(DrawService $drawService): RedirectResponse
    {
        $processed = $drawService->processPendingDraws();
        $count = count($processed);

        if ($count === 0) {
            return back()->with('info', 'No pending lottery draws are currently due.');
        }

        return back()->with('success', "Successfully processed {$count} due lottery draw(s).");
    }
}
