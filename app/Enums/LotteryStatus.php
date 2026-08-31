<?php

namespace App\Enums;

enum LotteryStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * Labels used for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Active => 'Active',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }
}
