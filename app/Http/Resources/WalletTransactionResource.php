<?php

namespace App\Http\Resources;

use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin WalletTransaction
 */
class WalletTransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'is_credit' => $this->type->isCredit(),
            'amount' => $this->amount,
            'amount_formatted' => money($this->amount),
            'balance_after' => $this->balance_after,
            'balance_after_formatted' => money($this->balance_after),
            'description' => $this->description,
            'created_at' => $this->created_at?->toISOString(),
            'created_at_formatted' => $this->created_at?->format('M j, Y g:i A'),
            'created_at_diff' => optional($this->created_at)->diffForHumans(),
        ];
    }
}
