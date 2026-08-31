<?php

namespace App\Http\Resources;

use App\Models\Lottery;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Lottery
 */
class LotteryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $mediaUrls = [];
        if (is_array($this->media)) {
            $mediaUrls = array_map(function (string $item): string {
                if (str_starts_with($item, 'http://') || str_starts_with($item, 'https://') || str_starts_with($item, '/')) {
                    return $item;
                }

                return asset('storage/'.$item);
            }, $this->media);
        }

        $winningTicket = $this->winningTicket;
        $winner = $winningTicket?->user;
        $drawLog = $this->drawLog;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'media' => $mediaUrls,
            'ticket_price' => $this->ticket_price,
            'ticket_price_formatted' => money($this->ticket_price),
            'total_tickets' => $this->total_tickets,
            'tickets_sold' => $this->tickets_sold,
            'remaining_tickets' => $this->remainingTickets(),
            'progress_percentage' => $this->progressPercentage(),
            'is_sold_out' => $this->isSoldOut(),
            'is_open' => $this->isOpen(),
            'draw_at' => $this->draw_at->toISOString(),
            'draw_at_formatted' => $this->draw_at->format('M j, Y g:i A'),
            'draw_at_diff' => $this->draw_at->diffForHumans(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'participant_count' => $this->participantCount(),
            'winning_ticket_id' => $this->winning_ticket_id,
            'winning_ticket_code' => $winningTicket?->ticket_code,
            'winner_name' => $winner ? ($winner->name ?? 'Winner') : null,
            'verification_hash' => $drawLog?->verification_hash,
            'verification_seed' => $drawLog?->verification_seed,
            'created_at' => $this->created_at?->toISOString(),
            'created_at_formatted' => $this->created_at?->format('M j, Y g:i A'),
        ];
    }
}
