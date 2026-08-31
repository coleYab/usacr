<?php

use App\Enums\LotteryStatus;
use App\Models\AdminAction;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('non-admin users cannot access admin lottery routes', function () {
    $user = User::factory()->create();
    $lottery = Lottery::factory()->create();

    $this->actingAs($user)->get(route('admin.lotteries'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.lotteries.create'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.lotteries.store'), [])->assertForbidden();
    $this->actingAs($user)->get(route('admin.lotteries.show', $lottery))->assertForbidden();
    $this->actingAs($user)->post(route('admin.lotteries.cancel', $lottery), ['reason' => 'Testing forbidden'])->assertForbidden();
});

test('admin can view lotteries monitoring page with stats', function () {
    $admin = User::factory()->admin()->create();
    $active = Lottery::factory()->active()->create([
        'ticket_price' => '10.00',
        'total_tickets' => 100,
        'tickets_sold' => 20,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.lotteries'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/lotteries/index')
            ->has('lotteries.data', 1)
            ->where('stats.active_count', 1)
            ->where('stats.tickets_sold', 20)
            ->has('stats.revenue_formatted')
            ->has('counts')
        );
});

test('admin can view create lottery page', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.lotteries.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/lotteries/create')
        );
});

test('admin can create a lottery with image uploads and audit logging', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();
    $image = UploadedFile::fake()->image('item.jpg', 600, 600);

    $response = $this->actingAs($admin)
        ->post(route('admin.lotteries.store'), [
            'title' => 'Apple iPad Pro M4',
            'description' => 'Brand new 13-inch OLED iPad Pro with Apple Pencil Pro.',
            'ticket_price' => '10.00',
            'total_tickets' => 120,
            'draw_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
            'status' => 'active',
            'images' => [$image],
        ]);

    $response->assertRedirect(route('admin.lotteries'));
    $response->assertSessionHas('success');

    $lottery = Lottery::where('title', 'Apple iPad Pro M4')->first();
    expect($lottery)->not->toBeNull();
    expect($lottery->status)->toBe(LotteryStatus::Active);
    expect($lottery->total_tickets)->toBe(120);
    expect($lottery->media)->toHaveCount(1);

    // Verify storage
    Storage::disk('public')->assertExists($lottery->media[0]);

    // Verify audit log
    $action = AdminAction::where('admin_id', $admin->id)
        ->where('action_type', 'lottery.created')
        ->first();
    expect($action)->not->toBeNull();
    expect($action->subject_id)->toBe($lottery->id);
});

test('admin can view lottery detail page with participants and recent tickets', function () {
    $admin = User::factory()->admin()->create();
    $lottery = Lottery::factory()->active()->create(['title' => 'Drone 4K']);

    $player = User::factory()->create(['name' => 'John Doe']);
    Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $player->id,
        'price_paid' => '10.00',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.lotteries.show', $lottery))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/lotteries/show')
            ->where('lottery.id', $lottery->id)
            ->has('participants', 1)
            ->where('participants.0.name', 'John Doe')
            ->has('recentTickets', 1)
        );
});
