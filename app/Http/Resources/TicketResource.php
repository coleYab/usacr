<?php

namespace App\Http\Resources;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Ticket
 */
class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'lottery_id' => $this->lottery_id,
            'ticket_code' => $this->ticket_code,
            'price_paid' => $this->price_paid,
            'price_paid_formatted' => money($this->price_paid),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'is_won' => $this->isWon(),
            'created_at' => $this->created_at?->toISOString(),
            'created_at_formatted' => $this->created_at?->format('M j, Y g:i A'),
            'created_at_diff' => optional($this->created_at)->diffForHumans(),
        ];

        if ($this->relationLoaded('lottery') && $this->lottery) {
            $data['lottery'] = (new LotteryResource($this->lottery))->resolve();
        }

        if ($this->relationLoaded('user') && $this->user) {
            $data['user'] = [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ];
        }

        return $data;
    }
}
