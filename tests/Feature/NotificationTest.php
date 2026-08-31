<?php

use App\Models\Deposit;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\DepositStatusNotification;
use App\Notifications\LotteryDrawResultNotification;
use Inertia\Testing\AssertableInertia as Assert;

test('user can mark a single notification as read', function () {
    $user = User::factory()->create();
    $lottery = Lottery::factory()->create();
    $ticket = Ticket::factory()->create(['lottery_id' => $lottery->id, 'user_id' => $user->id]);

    $user->notify(new LotteryDrawResultNotification($lottery, true, $ticket));

    expect($user->unreadNotifications()->count())->toBe(1);

    $notification = $user->unreadNotifications()->first();

    $response = $this->actingAs($user)->post(route('app.notifications.read', ['id' => $notification->id]));
    $response->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('user can mark all notifications as read', function () {
    $user = User::factory()->create();
    $lottery = Lottery::factory()->create();

    $user->notify(new LotteryDrawResultNotification($lottery, false));
    $user->notify(new DepositStatusNotification(Deposit::factory()->approved()->create(['user_id' => $user->id])));

    expect($user->unreadNotifications()->count())->toBe(2);

    $response = $this->actingAs($user)->post(route('app.notifications.mark-all-read'));
    $response->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('authenticated page response includes shared notifications payload', function () {
    $user = User::factory()->create();
    $lottery = Lottery::factory()->create();

    $user->notify(new LotteryDrawResultNotification($lottery, true));

    $response = $this->actingAs($user)->get(route('app.dashboard'));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->where('notifications.unreadCount', 1)
        ->has('notifications.recent', 1)
    );
});
