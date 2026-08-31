<?php

use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest and authenticated users can view the public results archive', function () {
    $winner = User::factory()->create(['name' => 'Alice Smith']);
    $lottery = Lottery::factory()->completed()->create([
        'title' => 'Vintage Rolex Submariner',
    ]);
    $ticket = Ticket::factory()->won()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $winner->id,
        'ticket_code' => 'TKT-12345678',
    ]);
    $lottery->update(['winning_ticket_id' => $ticket->id]);

    DrawLog::factory()->create([
        'lottery_id' => $lottery->id,
        'winning_ticket_id' => $ticket->id,
        'verification_hash' => 'dummy_hash_123',
    ]);

    // Guest visit
    $guestResponse = $this->get(route('results'));
    $guestResponse->assertOk();
    $guestResponse->assertInertia(fn (Assert $page) => $page
        ->component('app/results')
        ->has('lotteries.data', 1)
        ->where('lotteries.data.0.title', 'Vintage Rolex Submariner')
        ->where('lotteries.data.0.winning_ticket_code', 'TKT-12345678')
    );

    // Authenticated user visit to /app/results
    $user = User::factory()->create();
    $userResponse = $this->actingAs($user)->get(route('app.results'));
    $userResponse->assertOk();
});

test('results archive filters by search keyword', function () {
    $winner = User::factory()->create();
    $l1 = Lottery::factory()->completed()->create(['title' => 'PlayStation 5 Pro']);
    $t1 = Ticket::factory()->won()->create(['lottery_id' => $l1->id, 'user_id' => $winner->id]);
    $l1->update(['winning_ticket_id' => $t1->id]);
    DrawLog::factory()->create(['lottery_id' => $l1->id, 'winning_ticket_id' => $t1->id]);

    $l2 = Lottery::factory()->completed()->create(['title' => 'Apple MacBook Pro']);
    $t2 = Ticket::factory()->won()->create(['lottery_id' => $l2->id, 'user_id' => $winner->id]);
    $l2->update(['winning_ticket_id' => $t2->id]);
    DrawLog::factory()->create(['lottery_id' => $l2->id, 'winning_ticket_id' => $t2->id]);

    $response = $this->get(route('results', ['search' => 'PlayStation']));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('lotteries.data', 1)
        ->where('lotteries.data.0.title', 'PlayStation 5 Pro')
    );
});

test('completed lottery show page shows winner celebratory details for winning user', function () {
    $winner = User::factory()->create();
    $lottery = Lottery::factory()->completed()->create(['title' => 'Special Prize']);
    $ticket = Ticket::factory()->won()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $winner->id,
        'ticket_code' => 'TKT-WINNER',
    ]);
    $lottery->update(['winning_ticket_id' => $ticket->id]);
    DrawLog::factory()->create(['lottery_id' => $lottery->id, 'winning_ticket_id' => $ticket->id]);

    $response = $this->actingAs($winner)->get(route('app.lotteries.show', $lottery));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('app/lotteries/show')
        ->where('lottery.winning_ticket_code', 'TKT-WINNER')
        ->where('userTickets.0.ticket_code', 'TKT-WINNER')
        ->where('userTickets.0.is_won', true)
    );
});
