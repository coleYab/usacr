<?php

namespace App\Http\Controllers;

use App\Enums\LotteryStatus;
use App\Http\Resources\LotteryResource;
use App\Models\DrawLog;
use App\Models\Lottery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public landing page with live featured lotteries, recent winners, and platform trust metrics.
     */
    public function index(Request $request): Response
    {
        $featuredLotteries = Lottery::where('status', LotteryStatus::Active)
            ->where('draw_at', '>', now())
            ->orderBy('draw_at', 'asc')
            ->limit(8)
            ->get();

        $recentWinners = Lottery::where('status', LotteryStatus::Completed)
            ->with(['winningTicket.user', 'drawLog'])
            ->latest('draw_at')
            ->limit(4)
            ->get()
            ->map(function (Lottery $lottery) {
                $winner = $lottery->winningTicket?->user;
                $maskedName = 'Verified Winner';
                if ($winner && $winner->name) {
                    $parts = explode(' ', trim($winner->name));
                    $masked = array_map(function ($part) {
                        $len = mb_strlen($part);
                        if ($len <= 2) {
                            return $part[0].'*';
                        }

                        return mb_substr($part, 0, 1).str_repeat('*', min(4, $len - 2)).mb_substr($part, -1);
                    }, $parts);
                    $maskedName = implode(' ', $masked);
                }

                $thumbnail = null;
                if (is_array($lottery->media) && count($lottery->media) > 0) {
                    $item = $lottery->media[0];
                    $thumbnail = str_starts_with($item, 'http://') || str_starts_with($item, 'https://') || str_starts_with($item, '/')
                        ? $item
                        : asset('storage/'.$item);
                }

                return [
                    'id' => $lottery->id,
                    'title' => $lottery->title,
                    'thumbnail' => $thumbnail,
                    'winner_name' => $maskedName,
                    'winning_ticket_code' => $lottery->winningTicket ? $lottery->winningTicket->ticket_code : '—',
                    'drawn_at_diff' => $lottery->draw_at->diffForHumans(),
                    'verification_hash' => $lottery->drawLog?->verification_hash,
                ];
            });

        return Inertia::render('welcome', [
            'featured_lotteries' => LotteryResource::collection($featuredLotteries)->resolve(),
            'recent_winners' => $recentWinners,
            'stats' => [
                'active_count' => Lottery::where('status', LotteryStatus::Active)->where('draw_at', '>', now())->count(),
                'completed_count' => Lottery::where('status', LotteryStatus::Completed)->count(),
                'verified_draws' => DrawLog::count(),
            ],
        ]);
    }
}
