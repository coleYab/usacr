<?php

namespace App\Models;

use Database\Factories\DrawLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $lottery_id
 * @property int $winning_ticket_id
 * @property int $total_participants
 * @property int $total_tickets
 * @property string $verification_seed
 * @property string $verification_hash
 * @property Carbon $processed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'lottery_id',
    'winning_ticket_id',
    'total_participants',
    'total_tickets',
    'verification_seed',
    'verification_hash',
    'processed_at',
])]
class DrawLog extends Model
{
    /** @use HasFactory<DrawLogFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_participants' => 'integer',
            'total_tickets' => 'integer',
            'processed_at' => 'datetime',
        ];
    }

    /**
     * The lottery that was drawn.
     *
     * @return BelongsTo<Lottery, $this>
     */
    public function lottery(): BelongsTo
    {
        return $this->belongsTo(Lottery::class);
    }

    /**
     * The winning ticket selected during the draw.
     *
     * @return BelongsTo<Ticket, $this>
     */
    public function winningTicket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'winning_ticket_id');
    }
}
