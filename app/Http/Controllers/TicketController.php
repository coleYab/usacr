<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Http\Resources\TicketResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Display a listing of user's tickets.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $tab = $request->input('tab', 'active');

        $baseQuery = $user->tickets()->with('lottery');

        $activeQuery = (clone $baseQuery)->where('status', TicketStatus::Active);
        $wonQuery = (clone $baseQuery)->where('status', TicketStatus::Won);
        $lostQuery = (clone $baseQuery)->where('status', TicketStatus::Lost);
        $refundedQuery = (clone $baseQuery)->where('status', TicketStatus::Refunded);

        $query = match ($tab) {
            'won' => (clone $wonQuery)->latest(),
            'lost' => (clone $lostQuery)->latest(),
            'refunded' => (clone $refundedQuery)->latest(),
            'all' => (clone $baseQuery)->latest(),
            default => (clone $activeQuery)->latest(),
        };

        $tickets = $query->paginate(12)->withQueryString();

        return Inertia::render('app/tickets', [
            'tickets' => present_paginator(
                $tickets,
                fn ($items) => TicketResource::collection($items)->resolve(),
            ),
            'counts' => [
                'active' => (clone $activeQuery)->count(),
                'won' => (clone $wonQuery)->count(),
                'lost' => (clone $lostQuery)->count(),
                'refunded' => (clone $refundedQuery)->count(),
                'all' => (clone $baseQuery)->count(),
            ],
            'filters' => [
                'tab' => $tab,
            ],
        ]);
    }
}
