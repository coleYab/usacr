<?php

namespace App\Models;

use App\Enums\WalletTransactionType;
use Database\Factories\WalletTransactionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $wallet_id
 * @property WalletTransactionType $type
 * @property numeric-string $amount
 * @property numeric-string $balance_after
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'wallet_id',
    'type',
    'amount',
    'balance_after',
    'reference_type',
    'reference_id',
    'description',
])]
class WalletTransaction extends Model
{
    /** @use HasFactory<WalletTransactionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'type' => WalletTransactionType::class,
        ];
    }

    /**
     * The wallet this entry belongs to.
     *
     * @return BelongsTo<Wallet, $this>
     */
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * The polymorphic model this transaction refers to (Deposit, Ticket, ...).
     *
     * @return MorphTo<Model, $this>
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Filter transactions by optional type and date range.
     *
     * @param  Builder<WalletTransaction>  $query
     * @param  array<string, mixed>  $filters
     * @return Builder<WalletTransaction>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when(
                isset($filters['type']) && $filters['type'] !== 'all',
                fn (Builder $q) => $q->where('type', $filters['type']),
            )
            ->when(
                isset($filters['from']) && $filters['from'] !== '',
                fn (Builder $q) => $q->whereDate('created_at', '>=', $filters['from']),
            )
            ->when(
                isset($filters['to']) && $filters['to'] !== '',
                fn (Builder $q) => $q->whereDate('created_at', '<=', $filters['to']),
            );
    }
}
