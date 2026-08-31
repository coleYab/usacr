<?php

namespace App\Models;

use App\Enums\LotteryStatus;
use Database\Factories\LotteryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property array<string>|null $media
 * @property numeric-string $ticket_price
 * @property int $total_tickets
 * @property int $tickets_sold
 * @property Carbon $draw_at
 * @property LotteryStatus $status
 * @property int|null $winning_ticket_id
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'description',
    'media',
    'ticket_price',
    'total_tickets',
    'tickets_sold',
    'draw_at',
    'status',
    'winning_ticket_id',
    'created_by',
])]
class Lottery extends Model
{
    /** @use HasFactory<LotteryFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'media' => 'array',
            'ticket_price' => 'decimal:2',
            'total_tickets' => 'integer',
            'tickets_sold' => 'integer',
            'draw_at' => 'datetime',
            'status' => LotteryStatus::class,
        ];
    }

    /**
     * The admin user who created the lottery.
     *
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Tickets purchased for this lottery.
     *
     * @return HasMany<Ticket, $this>
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * The winning ticket, if drawn.
     *
     * @return BelongsTo<Ticket, $this>
     */
    public function winningTicket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'winning_ticket_id');
    }

    /**
     * Ledger transactions referencing this lottery (e.g. cancellations / refunds).
     *
     * @return MorphMany<WalletTransaction, $this>
     */
    public function walletTransactions(): MorphMany
    {
        return $this->morphMany(WalletTransaction::class, 'reference');
    }

    /**
     * Distinct participants (users) who bought tickets.
     */
    public function participantCount(): int
    {
        return $this->tickets()->distinct('user_id')->count('user_id');
    }

    /**
     * Number of remaining tickets available for purchase.
     */
    public function remainingTickets(): int
    {
        return max(0, $this->total_tickets - $this->tickets_sold);
    }

    /**
     * Whether all tickets have been sold.
     */
    public function isSoldOut(): bool
    {
        return $this->tickets_sold >= $this->total_tickets;
    }

    /**
     * Whether the lottery is currently open for ticket purchases.
     */
    public function isOpen(): bool
    {
        return $this->status === LotteryStatus::Active
            && $this->draw_at->isFuture()
            && ! $this->isSoldOut();
    }

    /**
     * Percentage of tickets sold.
     */
    public function progressPercentage(): float
    {
        if ($this->total_tickets <= 0) {
            return 0.0;
        }

        return round(min(100.0, ($this->tickets_sold / $this->total_tickets) * 100), 1);
    }

    /**
     * Scope to active lotteries.
     *
     * @param  Builder<Lottery>  $query
     * @return Builder<Lottery>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', LotteryStatus::Active);
    }

    /**
     * Scope to search lotteries by title or description.
     *
     * @param  Builder<Lottery>  $query
     * @return Builder<Lottery>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
