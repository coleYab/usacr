<?php

namespace App\Services;

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Enums\WalletTransactionType;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LotteryCancellationService
{
    /**
     * Create a new lottery cancellation service instance.
     */
    public function __construct(
        public readonly WalletService $walletService,
    ) {}

    /**
     * Cancel an active lottery, refund all ticket purchases, and log the action.
     */
    public function cancel(Lottery $lottery, User $admin, string $reason): void
    {
        DB::transaction(function () use ($lottery, $admin, $reason) {
            $locked = Lottery::whereKey($lottery->id)->lockForUpdate()->firstOrFail();

            abort_unless(
                $locked->status === LotteryStatus::Active,
                422,
                'Only active lotteries can be cancelled.',
            );

            $locked->update([
                'status' => LotteryStatus::Cancelled,
            ]);

            // Fetch active tickets grouped by user to process refunds
            $tickets = $locked->tickets()
                ->where('status', TicketStatus::Active)
                ->with('user.wallet')
                ->get()
                ->groupBy('user_id');

            foreach ($tickets as $userId => $userTickets) {
                $user = $userTickets->first()?->user;
                if (! $user) {
                    continue;
                }

                $wallet = $user->wallet()->firstOrCreate();
                $count = $userTickets->count();

                /** @var numeric-string $totalRefund */
                $totalRefund = bcmul($locked->ticket_price, (string) $count, 2);

                $this->walletService->credit(
                    $wallet,
                    $totalRefund,
                    WalletTransactionType::Refund,
                    $locked,
                    "Refund for cancelled lottery: {$locked->title} ({$count} ticket(s))",
                );

                Ticket::whereIn('id', $userTickets->pluck('id'))->update([
                    'status' => TicketStatus::Refunded,
                ]);
            }

            // Log admin audit record
            $admin->adminActions()->create([
                'action_type' => 'lottery.cancelled',
                'subject_type' => $locked->getMorphClass(),
                'subject_id' => $locked->id,
                'description' => "Cancelled lottery '{$locked->title}'. Reason: {$reason}",
            ]);
        });
    }
}
