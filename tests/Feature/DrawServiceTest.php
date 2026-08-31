<?php

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\LotteryDrawResultNotification;
use App\Services\DrawService;
use Illuminate\Support\Facades\Notification;

test('draw service randomly selects a winning ticket, completes lottery, and logs audit verification', function () {
    Notification::fake();

    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $lottery = Lottery::factory()->active()->create([
        'total_tickets' => 10,
        'tickets_sold' => 3,
        'draw_at' => now()->subMinute(),
    ]);

    $t1 = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user1->id,
    ]);
    $t2 = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user1->id,
    ]);
    $t3 = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user2->id,
    ]);

    $drawService = app(DrawService::class);
    $drawLog = $drawService->draw($lottery);

    expect($drawLog)->not->toBeNull();
    expect($drawLog->lottery_id)->toBe($lottery->id);
    expect($drawLog->total_participants)->toBe(2);
    expect($drawLog->total_tickets)->toBe(3);
    expect($drawLog->verification_seed)->not->toBeEmpty();
    expect($drawLog->verification_hash)->not->toBeEmpty();

    $lottery->refresh();
    expect($lottery->status)->toBe(LotteryStatus::Completed);
    expect($lottery->winning_ticket_id)->not->toBeNull();
    expect([$t1->id, $t2->id, $t3->id])->toContain($lottery->winning_ticket_id);

    $winningTicket = Ticket::find($lottery->winning_ticket_id);
    expect($winningTicket->status)->toBe(TicketStatus::Won);

    $lostTickets = Ticket::where('lottery_id', $lottery->id)
        ->where('id', '!=', $winningTicket->id)
        ->get();

    expect($lostTickets)->toHaveCount(2);
    foreach ($lostTickets as $lostTicket) {
        expect($lostTicket->status)->toBe(TicketStatus::Lost);
    }

    // Verify winner received winning notification
    $winningUser = $winningTicket->user;
    Notification::assertSentTo($winningUser, LotteryDrawResultNotification::class, function ($notification) use ($lottery) {
        return $notification->isWinner === true && $notification->lottery->id === $lottery->id;
    });

    // Verify other user received non-winner notification
    $otherUser = $winningUser->id === $user1->id ? $user2 : $user1;
    Notification::assertSentTo($otherUser, LotteryDrawResultNotification::class, function ($notification) use ($lottery) {
        return $notification->isWinner === false && $notification->lottery->id === $lottery->id;
    });
});

test('lottery with zero tickets sold is marked cancelled instead of drawing', function () {
    Notification::fake();

    $lottery = Lottery::factory()->active()->create([
        'total_tickets' => 10,
        'tickets_sold' => 0,
        'draw_at' => now()->subMinute(),
    ]);

    $drawService = app(DrawService::class);
    $drawLog = $drawService->draw($lottery);

    expect($drawLog)->toBeNull();

    $lottery->refresh();
    expect($lottery->status)->toBe(LotteryStatus::Cancelled);
    expect($lottery->winning_ticket_id)->toBeNull();

    expect(DrawLog::count())->toBe(0);
    Notification::assertNothingSent();
});

test('future lottery is not drawn by draw service', function () {
    $lottery = Lottery::factory()->active()->create([
        'draw_at' => now()->addDay(),
    ]);

    $drawService = app(DrawService::class);
    $processed = $drawService->processPendingDraws();

    expect($processed)->toBeEmpty();

    $lottery->refresh();
    expect($lottery->status)->toBe(LotteryStatus::Active);
});

test('process draws artisan command runs and processes due lotteries', function () {
    Notification::fake();

    $user = User::factory()->create();
    $lottery = Lottery::factory()->active()->create([
        'draw_at' => now()->subMinute(),
    ]);
    Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user->id,
    ]);

    $this->artisan('lotteries:process-draws')
        ->expectsOutputToContain('Successfully processed 1 lottery draw(s).')
        ->assertSuccessful();

    $lottery->refresh();
    expect($lottery->status)->toBe(LotteryStatus::Completed);
});
