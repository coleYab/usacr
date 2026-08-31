<?php

namespace App\Services;

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use App\Notifications\LotteryDrawResultNotification;
use Illuminate\Support\Facades\DB;

class DrawService
{
    /**
     * Process all due active lotteries whose draw_at has passed.
     *
     * @return array<DrawLog>
     */
    public function processPendingDraws(): array
    {
        $dueLotteries = Lottery::where('status', LotteryStatus::Active)
            ->where('draw_at', '<=', now())
            ->get();

        $processed = [];

        foreach ($dueLotteries as $lottery) {
            $drawLog = $this->draw($lottery);
            if ($drawLog !== null) {
                $processed[] = $drawLog;
            }
        }

        return $processed;
    }

    /**
     * Execute the draw for a single lottery atomically.
     */
    public function draw(Lottery $lottery): ?DrawLog
    {
        return DB::transaction(function () use ($lottery) {
            $locked = Lottery::whereKey($lottery->id)->lockForUpdate()->firstOrFail();

            // Guard against race conditions or concurrent triggers
            if ($locked->status !== LotteryStatus::Active || $locked->draw_at->isFuture()) {
                return null;
            }

            /** @var array<int> $activeTicketIds */
            $activeTicketIds = $locked->tickets()
                ->where('status', TicketStatus::Active)
                ->pluck('id')
                ->all();

            // Explicit edge case: No tickets sold -> cancel lottery
            if (empty($activeTicketIds)) {
                $locked->update([
                    'status' => LotteryStatus::Cancelled,
                ]);

                return null;
            }

            // Cryptographically secure random selection & audit verification
            $totalCount = count($activeTicketIds);
            $winnerIndex = random_int(0, $totalCount - 1);
            $winningTicketId = $activeTicketIds[$winnerIndex];

            $seed = bin2hex(random_bytes(16));
            $hash = hash('sha256', "{$seed}:{$winningTicketId}:{$totalCount}");

            // Mark winning ticket
            $winningTicket = Ticket::whereKey($winningTicketId)->with('user')->firstOrFail();
            $winningTicket->update([
                'status' => TicketStatus::Won,
            ]);

            // Mark all remaining tickets as lost
            $locked->tickets()
                ->where('status', TicketStatus::Active)
                ->where('id', '!=', $winningTicketId)
                ->update([
                    'status' => TicketStatus::Lost,
                ]);

            // Complete lottery
            $locked->update([
                'winning_ticket_id' => $winningTicketId,
                'status' => LotteryStatus::Completed,
            ]);

            $totalParticipants = (int) $locked->tickets()->distinct('user_id')->count('user_id');

            /** @var DrawLog $drawLog */
            $drawLog = $locked->drawLog()->create([
                'winning_ticket_id' => $winningTicketId,
                'total_participants' => $totalParticipants,
                'total_tickets' => $totalCount,
                'verification_seed' => $seed,
                'verification_hash' => $hash,
                'processed_at' => now(),
            ]);

            // Send notification to winner
            $winningUser = $winningTicket->user;
            $winningUser->notify(new LotteryDrawResultNotification($locked, true, $winningTicket));

            // Send notifications to other participants
            $participantUserIds = $locked->tickets()
                ->where('user_id', '!=', $winningUser->id)
                ->distinct()
                ->pluck('user_id');

            $otherParticipants = User::whereIn('id', $participantUserIds)->get();
            foreach ($otherParticipants as $otherUser) {
                $otherUser->notify(new LotteryDrawResultNotification($locked, false, $winningTicket));
            }

            return $drawLog;
        });
    }
}
