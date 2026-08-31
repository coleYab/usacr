<?php

use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view the automated draw oversight dashboard', function () {
    $admin = User::factory()->admin()->create();

    $winner = User::factory()->create(['name' => 'Charlie Winner']);
    $lottery = Lottery::factory()->completed()->create(['title' => 'Gaming Laptop']);
    $ticket = Ticket::factory()->won()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $winner->id,
        'ticket_code' => 'TKT-99999999',
    ]);
    $lottery->update(['winning_ticket_id' => $ticket->id]);

    DrawLog::factory()->create([
        'lottery_id' => $lottery->id,
        'winning_ticket_id' => $ticket->id,
        'total_participants' => 5,
        'total_tickets' => 20,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.draws'));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/draws')
        ->has('draws.data', 1)
        ->where('draws.data.0.lottery_title', 'Gaming Laptop')
        ->where('draws.data.0.winning_ticket_code', 'TKT-99999999')
        ->where('draws.data.0.winner_name', 'Charlie Winner')
        ->where('stats.total_draws', 1)
    );
});

test('admin can manually trigger draw executions via run endpoint', function () {
    $admin = User::factory()->admin()->create();

    $user = User::factory()->create();
    $lottery = Lottery::factory()->active()->create([
        'draw_at' => now()->subMinute(),
    ]);
    Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.draws.run'));
    $response->assertRedirect();
    $response->assertSessionHas('success');

    $lottery->refresh();
    expect($lottery->status->value)->toBe('completed');
    expect(DrawLog::where('lottery_id', $lottery->id)->count())->toBe(1);
});

test('non-admin users cannot access admin draws pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.draws'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.draws.run'))->assertForbidden();
});
