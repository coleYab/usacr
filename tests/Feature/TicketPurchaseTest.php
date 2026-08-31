<?php

use App\Enums\TicketStatus;
use App\Enums\WalletTransactionType;
use App\Exceptions\InsufficientFundsException;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot purchase lottery tickets', function () {
    $lottery = Lottery::factory()->active()->create();

    $this->post(route('app.lotteries.purchase', $lottery), ['quantity' => 1])
        ->assertRedirect(route('login'));
});

test('user can purchase tickets atomically when having sufficient balance', function () {
    $user = User::factory()->create();
    $wallet = $user->wallet;
    $wallet->update(['balance' => '100.00']);

    $lottery = Lottery::factory()->active()->create([
        'ticket_price' => '25.00',
        'total_tickets' => 10,
        'tickets_sold' => 0,
    ]);

    $response = $this->actingAs($user)
        ->post(route('app.lotteries.purchase', $lottery), [
            'quantity' => 3,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $response->assertSessionHas('purchased_tickets');

    // Assert wallet balance updated
    expect($wallet->fresh()->balance)->toEqual('25.00');

    // Assert wallet transaction recorded
    $transaction = WalletTransaction::where('wallet_id', $wallet->id)->first();
    expect($transaction)->not->toBeNull();
    expect($transaction->type)->toBe(WalletTransactionType::TicketPurchase);
    expect($transaction->amount)->toEqual('-75.00');
    expect($transaction->balance_after)->toEqual('25.00');
    expect($transaction->reference_type)->toBe($lottery->getMorphClass());
    expect($transaction->reference_id)->toBe($lottery->id);

    // Assert lottery tickets_sold incremented
    expect($lottery->fresh()->tickets_sold)->toBe(3);

    // Assert tickets created with unique codes
    $tickets = Ticket::where('lottery_id', $lottery->id)->get();
    expect($tickets)->toHaveCount(3);
    expect($tickets->pluck('ticket_code')->unique())->toHaveCount(3);
    expect($tickets->first()->status)->toBe(TicketStatus::Active);
    expect($tickets->first()->price_paid)->toEqual('25.00');
});

test('user cannot purchase tickets with insufficient balance', function () {
    $user = User::factory()->create();
    $wallet = $user->wallet;
    $wallet->update(['balance' => '10.00']);

    $lottery = Lottery::factory()->active()->create([
        'ticket_price' => '25.00',
        'total_tickets' => 10,
    ]);

    $this->withoutExceptionHandling();

    expect(fn () => $this->actingAs($user)->post(route('app.lotteries.purchase', $lottery), [
        'quantity' => 1,
    ]))->toThrow(InsufficientFundsException::class);

    // Balance and tickets remain unchanged
    expect($wallet->fresh()->balance)->toEqual('10.00');
    expect($lottery->fresh()->tickets_sold)->toBe(0);
    expect(Ticket::count())->toBe(0);
});

test('user cannot purchase more tickets than remaining capacity', function () {
    $user = User::factory()->create();
    $user->wallet->update(['balance' => '1000.00']);

    $lottery = Lottery::factory()->active()->create([
        'ticket_price' => '10.00',
        'total_tickets' => 5,
        'tickets_sold' => 4,
    ]);

    $this->actingAs($user)
        ->post(route('app.lotteries.purchase', $lottery), [
            'quantity' => 2,
        ])
        ->assertStatus(422);

    expect($lottery->fresh()->tickets_sold)->toBe(4);
});

test('user cannot purchase tickets on closed or draft lotteries', function () {
    $user = User::factory()->create();
    $user->wallet->update(['balance' => '500.00']);

    $draftLottery = Lottery::factory()->draft()->create();
    $pastLottery = Lottery::factory()->active()->create(['draw_at' => now()->subMinutes(10)]);
    $cancelledLottery = Lottery::factory()->cancelled()->create();

    $this->actingAs($user)
        ->post(route('app.lotteries.purchase', $draftLottery), ['quantity' => 1])
        ->assertStatus(422);

    $this->actingAs($user)
        ->post(route('app.lotteries.purchase', $pastLottery), ['quantity' => 1])
        ->assertStatus(422);

    $this->actingAs($user)
        ->post(route('app.lotteries.purchase', $cancelledLottery), ['quantity' => 1])
        ->assertStatus(422);
});

test('user can view their purchased tickets in my tickets hub with status filtering', function () {
    $user = User::factory()->create();
    $lottery = Lottery::factory()->active()->create(['title' => 'Gaming Rig']);

    $activeTicket = Ticket::factory()->active()->create([
        'user_id' => $user->id,
        'lottery_id' => $lottery->id,
        'ticket_code' => 'TKT-ACT1111',
    ]);
    $wonTicket = Ticket::factory()->won()->create([
        'user_id' => $user->id,
        'lottery_id' => $lottery->id,
        'ticket_code' => 'TKT-WIN2222',
    ]);

    // Active tab
    $this->actingAs($user)
        ->get(route('app.tickets', ['tab' => 'active']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/tickets')
            ->has('tickets.data', 1)
            ->where('tickets.data.0.ticket_code', 'TKT-ACT1111')
            ->where('counts.active', 1)
            ->where('counts.won', 1)
        );

    // Won tab
    $this->actingAs($user)
        ->get(route('app.tickets', ['tab' => 'won']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('app/tickets')
            ->has('tickets.data', 1)
            ->where('tickets.data.0.ticket_code', 'TKT-WIN2222')
        );
});
