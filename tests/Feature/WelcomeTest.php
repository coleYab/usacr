<?php

use App\Enums\LotteryStatus;
use App\Models\Lottery;
use Inertia\Testing\AssertableInertia as Assert;

test('welcome page returns successful response with featured lotteries and platform stats', function () {
    Lottery::factory()->create([
        'status' => LotteryStatus::Active,
        'draw_at' => now()->addHours(6),
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('featured_lotteries')
        ->has('recent_winners')
        ->has('stats')
    );
});

test('public results page returns successful response', function () {
    $response = $this->get(route('results'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('app/results')
        ->has('lotteries')
        ->has('totalCompleted')
    );
});
