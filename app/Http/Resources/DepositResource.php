<?php

namespace App\Http\Resources;

use App\Models\Deposit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Deposit
 */
class DepositResource extends JsonResource
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
            'amount' => $this->amount,
            'amount_formatted' => money($this->amount),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'receipt_url' => $this->receipt_path ? asset('storage/'.$this->receipt_path) : null,
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at?->toISOString(),
            'created_at_formatted' => $this->created_at?->format('M j, Y g:i A'),
            'created_at_diff' => optional($this->created_at)->diffForHumans(),
        ];

        if ($this->relationLoaded('user')) {
            $data['user'] = [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ];
        }

        return $data;
    }
}
