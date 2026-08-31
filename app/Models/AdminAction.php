<?php

namespace App\Models;

use Database\Factories\AdminActionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $admin_id
 * @property string $action_type
 * @property string $subject_type
 * @property int $subject_id
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['admin_id', 'action_type', 'subject_type', 'subject_id', 'description'])]
class AdminAction extends Model
{
    /** @use HasFactory<AdminActionFactory> */
    use HasFactory;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::updating(function () {
            throw new \LogicException('AdminAction records are immutable and cannot be updated.');
        });

        static::deleting(function () {
            throw new \LogicException('AdminAction records are immutable and cannot be deleted.');
        });
    }

    /**
     * The admin who performed the action.
     *
     * @return BelongsTo<User, $this>
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * The entity the action was performed on.
     *
     * @return MorphTo<Model, $this>
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
