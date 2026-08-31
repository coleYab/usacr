<?php

use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when visiting lotteries list', function () {
    $this->get(route('app.lotteries'))
        ->assertRedirect(route('login'));
});

test('authenticated users can browse active lotteries', function () {
    $user = User::factory()->create();
    $activeLottery = Lottery::factory()->active()->create(['title' => 'MacBook Pro M3 Max']);
    $draftLottery = Lottery::factory()->draft()->create(['title' => 'Unpublished Mystery Box']);

    $this->actingAs($user)
        ->get(route('app.lotteries'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/lotteries')
            ->has('lotteries.data', 1)
            ->where('lotteries.data.0.id', $activeLottery->id)
            ->where('lotteries.data.0.title', 'MacBook Pro M3 Max')
            ->has('counts')
        );
});

test('users can filter lotteries by tab ending soon and all', function () {
    $user = User::factory()->create();

    $endingSoon = Lottery::factory()->endingSoon()->create(['title' => 'Ending Soon Raffle']);
    $activeFuture = Lottery::factory()->active()->create([
        'title' => 'Future Raffle',
        'draw_at' => now()->addDays(5),
    ]);
    $completed = Lottery::factory()->completed()->create(['title' => 'Completed Raffle']);

    // Ending soon tab
    $this->actingAs($user)
        ->get(route('app.lotteries', ['tab' => 'ending_soon']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/lotteries')
            ->has('lotteries.data', 2) // both active and ending soon are active
            ->where('lotteries.data.0.id', $endingSoon->id)
        );

    // All tab
    $this->actingAs($user)
        ->get(route('app.lotteries', ['tab' => 'all']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/lotteries')
            ->has('lotteries.data', 3)
        );
});

test('users can search lotteries by keyword', function () {
    $user = User::factory()->create();

    $target = Lottery::factory()->active()->create(['title' => 'Sony PlayStation 5 Console']);
    $other = Lottery::factory()->active()->create(['title' => 'Nintendo Switch OLED']);

    $this->actingAs($user)
        ->get(route('app.lotteries', ['search' => 'PlayStation']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/lotteries')
            ->has('lotteries.data', 1)
            ->where('lotteries.data.0.id', $target->id)
        );
});

test('users can view lottery detail page with owned tickets', function () {
    $user = User::factory()->create();
    $lottery = Lottery::factory()->active()->create([
        'title' => 'iPhone 16 Pro Max',
        'ticket_price' => '15.00',
        'total_tickets' => 100,
        'tickets_sold' => 1,
    ]);

    $ticket = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user->id,
        'ticket_code' => 'TKT-TEST1234',
        'price_paid' => '15.00',
    ]);

    $this->actingAs($user)
        ->get(route('app.lotteries.show', $lottery))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/lotteries/show')
            ->where('lottery.id', $lottery->id)
            ->where('lottery.title', 'iPhone 16 Pro Max')
            ->has('userTickets', 1)
            ->where('userTickets.0.ticket_code', 'TKT-TEST1234')
            ->has('walletBalance')
        );
});
