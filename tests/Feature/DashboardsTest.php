<?php

use App\Enums\LotteryStatus;
use App\Models\Lottery;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can view operational dashboard with live stats and feeds', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->has('stats.total_users')
        ->has('stats.total_platform_balance')
        ->has('stats.pending_deposits_count')
        ->has('stats.active_lotteries_count')
        ->has('recent_actions')
        ->has('recent_draws')
    );
});

test('user can view player dashboard with wallet balance and ending lotteries', function () {
    $user = User::factory()->create();
    Lottery::factory()->create([
        'status' => LotteryStatus::Active,
        'draw_at' => now()->addHours(3),
    ]);

    $response = $this->actingAs($user)->get(route('app.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('app/dashboard')
        ->has('stats.wallet_balance')
        ->has('stats.active_tickets_count')
        ->has('ending_soon_lotteries')
        ->has('recent_tickets')
    );
});

test('guest is redirected to landing when visiting dashboards', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('home'));
    $this->get(route('app.dashboard'))->assertRedirect(route('home'));
});
