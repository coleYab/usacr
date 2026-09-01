<?php

namespace App\Http\Controllers;

use App\Enums\LotteryStatus;
use App\Http\Resources\LotteryResource;
use App\Models\Lottery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResultController extends Controller
{
    /**
     * Display a public listing of completed lottery results.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = Lottery::query()
            ->where('status', LotteryStatus::Completed)
            ->with(['winningTicket.user', 'drawLog'])
            ->search($search)
            ->latest('draw_at');

        $lotteries = $query->paginate(12)->withQueryString();

        return Inertia::render('app/results', [
            'lotteries' => present_paginator($lotteries, function (array $items) {
                return array_map(function (Lottery $lottery) {
                    $resource = (new LotteryResource($lottery))->resolve();
                    $winningTicket = $lottery->winningTicket;
                    $winner = $winningTicket?->user;

                    // Mask winner name for privacy while building platform trust
                    $maskedName = 'ስም-አልባ አሸናፊ';
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

                    $resource['winning_ticket_code'] = $winningTicket?->ticket_code;
                    $resource['winner_name'] = $maskedName;
                    $resource['verification_hash'] = $lottery->drawLog?->verification_hash;
                    $resource['verification_seed'] = $lottery->drawLog?->verification_seed;

                    return $resource;
                }, $items);
            }),
            'filters' => [
                'search' => $search ?? '',
            ],
            'totalCompleted' => Lottery::where('status', LotteryStatus::Completed)->count(),
        ]);
    }
}
