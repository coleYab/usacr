<?php

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Enums\WalletTransactionType;
use App\Models\AdminAction;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;

test('admin can cancel an active lottery and refund all ticket purchasers', function () {
    $admin = User::factory()->admin()->create();

    $user1 = User::factory()->create();
    $wallet1 = $user1->wallet;
    $wallet1->update(['balance' => '0.00']);

    $user2 = User::factory()->create();
    $wallet2 = $user2->wallet;
    $wallet2->update(['balance' => '5.00']);

    $lottery = Lottery::factory()->active()->create([
        'title' => 'Vintage Guitar',
        'ticket_price' => '20.00',
        'total_tickets' => 10,
        'tickets_sold' => 3,
    ]);

    // User 1 has 2 tickets ($40 total), User 2 has 1 ticket ($20 total)
    $t1 = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user1->id,
        'price_paid' => '20.00',
    ]);
    $t2 = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user1->id,
        'price_paid' => '20.00',
    ]);
    $t3 = Ticket::factory()->active()->create([
        'lottery_id' => $lottery->id,
        'user_id' => $user2->id,
        'price_paid' => '20.00',
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.lotteries.cancel', $lottery), [
            'reason' => 'Item damaged in warehouse prior to scheduled draw.',
        ]);

    $response->assertRedirect(route('admin.lotteries'));
    $response->assertSessionHas('success');

    // Assert lottery status is cancelled
    expect($lottery->fresh()->status)->toBe(LotteryStatus::Cancelled);

    // Assert tickets are marked refunded
    expect($t1->fresh()->status)->toBe(TicketStatus::Refunded);
    expect($t2->fresh()->status)->toBe(TicketStatus::Refunded);
    expect($t3->fresh()->status)->toBe(TicketStatus::Refunded);

    // Assert wallet 1 credited $40.00 -> balance becomes 40.00
    expect($wallet1->fresh()->balance)->toEqual('40.00');
    $tx1 = WalletTransaction::where('wallet_id', $wallet1->id)->first();
    expect($tx1)->not->toBeNull();
    expect($tx1->type)->toBe(WalletTransactionType::Refund);
    expect($tx1->amount)->toEqual('40.00');
    expect($tx1->reference_type)->toBe($lottery->getMorphClass());
    expect($tx1->reference_id)->toBe($lottery->id);

    // Assert wallet 2 credited $20.00 -> balance becomes 25.00
    expect($wallet2->fresh()->balance)->toEqual('25.00');
    $tx2 = WalletTransaction::where('wallet_id', $wallet2->id)->first();
    expect($tx2)->not->toBeNull();
    expect($tx2->type)->toBe(WalletTransactionType::Refund);
    expect($tx2->amount)->toEqual('20.00');

    // Assert admin audit log recorded
    $action = AdminAction::where('admin_id', $admin->id)
        ->where('action_type', 'lottery.cancelled')
        ->first();
    expect($action)->not->toBeNull();
    expect($action->subject_id)->toBe($lottery->id);
    expect($action->description)->toContain('Item damaged in warehouse');
});

test('cancellation requires valid reason of at least 10 characters', function () {
    $admin = User::factory()->admin()->create();
    $lottery = Lottery::factory()->active()->create();

    $this->actingAs($admin)
        ->post(route('admin.lotteries.cancel', $lottery), ['reason' => 'short'])
        ->assertSessionHasErrors('reason');
});

test('cannot cancel already cancelled or completed lotteries', function () {
    $admin = User::factory()->admin()->create();
    $cancelledLottery = Lottery::factory()->cancelled()->create();
    $completedLottery = Lottery::factory()->completed()->create();

    $this->actingAs($admin)
        ->post(route('admin.lotteries.cancel', $cancelledLottery), [
            'reason' => 'Valid cancellation reason description.',
        ])
        ->assertStatus(422);

    $this->actingAs($admin)
        ->post(route('admin.lotteries.cancel', $completedLottery), [
            'reason' => 'Valid cancellation reason description.',
        ])
        ->assertStatus(422);
});
