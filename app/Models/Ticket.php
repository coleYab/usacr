<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Database\Factories\TicketFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $lottery_id
 * @property int $user_id
 * @property string $ticket_code
 * @property numeric-string $price_paid
 * @property TicketStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'lottery_id',
    'user_id',
    'ticket_code',
    'price_paid',
    'status',
])]
class Ticket extends Model
{
    /** @use HasFactory<TicketFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_paid' => 'decimal:2',
            'status' => TicketStatus::class,
        ];
    }

    /**
     * The lottery this ticket was issued for.
     *
     * @return BelongsTo<Lottery, $this>
     */
    public function lottery(): BelongsTo
    {
        return $this->belongsTo(Lottery::class);
    }

    /**
     * The user who purchased this ticket.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Ledger transactions referencing this ticket.
     *
     * @return MorphMany<WalletTransaction, $this>
     */
    public function walletTransactions(): MorphMany
    {
        return $this->morphMany(WalletTransaction::class, 'reference');
    }

    /**
     * Whether this ticket was drawn as the winner.
     */
    public function isWon(): bool
    {
        return $this->status === TicketStatus::Won;
    }

    /**
     * Scope to active tickets.
     *
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', TicketStatus::Active);
    }

    /**
     * Scope to won tickets.
     *
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeWon(Builder $query): Builder
    {
        return $query->where('status', TicketStatus::Won);
    }

    /**
     * Scope to lost tickets.
     *
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeLost(Builder $query): Builder
    {
        return $query->where('status', TicketStatus::Lost);
    }

    /**
     * Scope to refunded tickets.
     *
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeRefunded(Builder $query): Builder
    {
        return $query->where('status', TicketStatus::Refunded);
    }
}
