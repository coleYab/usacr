<?php

namespace App\Services;

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Enums\WalletTransactionType;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TicketPurchaseService
{
    /**
     * Create a new ticket purchase service instance.
     */
    public function __construct(
        public readonly WalletService $walletService,
    ) {}

    /**
     * Atomically purchase N tickets for a lottery.
     *
     * @return array<Ticket>
     */
    public function purchase(User $user, Lottery $lottery, int $quantity): array
    {
        abort_if($quantity < 1, 422, 'Must purchase at least 1 ticket.');

        return DB::transaction(function () use ($user, $lottery, $quantity) {
            $locked = Lottery::whereKey($lottery->id)->lockForUpdate()->firstOrFail();

            abort_unless($locked->status === LotteryStatus::Active, 422, 'This lottery is not active.');
            abort_if($locked->draw_at->isPast(), 422, 'This lottery has already closed.');
            abort_if(
                $locked->tickets_sold + $quantity > $locked->total_tickets,
                422,
                'Not enough tickets remaining.',
            );

            /** @var numeric-string $totalCost */
            $totalCost = bcmul($locked->ticket_price, (string) $quantity, 2);

            $wallet = $user->wallet()->firstOrCreate();

            $this->walletService->debit(
                $wallet,
                $totalCost,
                WalletTransactionType::TicketPurchase,
                $locked,
                "Purchased {$quantity} ticket(s) for {$locked->title}",
            );

            $created = [];
            for ($i = 0; $i < $quantity; $i++) {
                $created[] = $locked->tickets()->create([
                    'user_id' => $user->id,
                    'ticket_code' => 'TKT-'.strtoupper(Str::random(8)),
                    'price_paid' => $locked->ticket_price,
                    'status' => TicketStatus::Active,
                ]);
            }

            $locked->increment('tickets_sold', $quantity);

            return $created;
        });
    }
}
