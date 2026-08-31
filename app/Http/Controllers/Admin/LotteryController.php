<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LotteryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CancelLotteryRequest;
use App\Http\Requests\StoreLotteryRequest;
use App\Http\Resources\LotteryResource;
use App\Http\Resources\TicketResource;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Services\LotteryCancellationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LotteryController extends Controller
{
    /**
     * Display the admin active lottery monitoring page.
     */
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'all');
        $search = $request->input('search');

        $baseQuery = Lottery::query()->search($search);

        $query = match ($tab) {
            'active' => (clone $baseQuery)->where('status', LotteryStatus::Active)->latest(),
            'draft' => (clone $baseQuery)->where('status', LotteryStatus::Draft)->latest(),
            'completed' => (clone $baseQuery)->where('status', LotteryStatus::Completed)->latest(),
            'cancelled' => (clone $baseQuery)->where('status', LotteryStatus::Cancelled)->latest(),
            default => (clone $baseQuery)->latest(),
        };

        $lotteries = $query->paginate(10)->withQueryString();

        // Calculate summary stats
        $totalTicketsSold = (int) Lottery::sum('tickets_sold');
        $totalRevenueRaw = Lottery::select(DB::raw('SUM(tickets_sold * ticket_price) as revenue'))->value('revenue') ?? 0;
        $distinctParticipants = (int) Ticket::distinct('user_id')->count('user_id');

        return Inertia::render('admin/lotteries/index', [
            'lotteries' => present_paginator(
                $lotteries,
                fn ($items) => LotteryResource::collection($items)->resolve(),
            ),
            'stats' => [
                'active_count' => Lottery::where('status', LotteryStatus::Active)->count(),
                'tickets_sold' => $totalTicketsSold,
                'revenue_formatted' => money((string) $totalRevenueRaw),
                'participants_count' => $distinctParticipants,
            ],
            'counts' => [
                'all' => Lottery::count(),
                'active' => Lottery::where('status', LotteryStatus::Active)->count(),
                'draft' => Lottery::where('status', LotteryStatus::Draft)->count(),
                'completed' => Lottery::where('status', LotteryStatus::Completed)->count(),
                'cancelled' => Lottery::where('status', LotteryStatus::Cancelled)->count(),
            ],
            'filters' => [
                'tab' => $tab,
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Show the form for creating a new lottery.
     */
    public function create(): Response
    {
        return Inertia::render('admin/lotteries/create');
    }

    /**
     * Store a newly created lottery in storage.
     */
    public function store(StoreLotteryRequest $request): RedirectResponse
    {
        $admin = $request->user();

        $mediaPaths = [];
        if ($request->hasFile('images')) {
            /** @var array<UploadedFile> $images */
            $images = $request->file('images');
            foreach ($images as $image) {
                $path = $image->storeAs(
                    'lotteries',
                    Str::uuid().'.'.$image->extension(),
                    'public',
                );
                $mediaPaths[] = $path;
            }
        }

        $lottery = Lottery::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'media' => $mediaPaths,
            'ticket_price' => $request->input('ticket_price'),
            'total_tickets' => (int) $request->input('total_tickets'),
            'tickets_sold' => 0,
            'draw_at' => $request->input('draw_at'),
            'status' => LotteryStatus::from($request->input('status')),
            'created_by' => $admin->id,
        ]);

        $admin->adminActions()->create([
            'action_type' => 'lottery.created',
            'subject_type' => $lottery->getMorphClass(),
            'subject_id' => $lottery->id,
            'description' => "Created lottery '{$lottery->title}' with {$lottery->total_tickets} tickets at ".money($lottery->ticket_price).' each.',
        ]);

        return redirect()
            ->route('admin.lotteries')
            ->with('success', "Lottery '{$lottery->title}' created successfully.");
    }

    /**
     * Display the specified lottery monitoring detail page.
     */
    public function show(Lottery $lottery): Response
    {
        $tickets = $lottery->tickets()->with('user')->latest()->get();

        // Participants aggregation: user, ticket count, total spent
        $participants = $tickets->groupBy('user_id')->map(function ($userTickets) {
            $user = $userTickets->first()?->user;
            $count = $userTickets->count();
            $spent = $userTickets->sum('price_paid');

            return [
                'id' => $user?->id,
                'name' => $user ? $user->name : 'Unknown',
                'email' => $user ? $user->email : '',
                'ticket_count' => $count,
                'total_spent' => (string) $spent,
                'total_spent_formatted' => money((string) $spent),
            ];
        })->values();

        $recentTickets = $lottery->tickets()
            ->with('user')
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('admin/lotteries/show', [
            'lottery' => (new LotteryResource($lottery))->resolve(),
            'participants' => $participants,
            'recentTickets' => TicketResource::collection($recentTickets)->resolve(),
        ]);
    }

    /**
     * Cancel an active lottery and refund all participants.
     */
    public function cancel(
        Lottery $lottery,
        CancelLotteryRequest $request,
        LotteryCancellationService $cancellationService,
    ): RedirectResponse {
        $cancellationService->cancel($lottery, $request->user(), $request->input('reason'));

        return redirect()
            ->route('admin.lotteries')
            ->with('success', "Lottery '{$lottery->title}' cancelled and ticket purchases refunded.");
    }
}
