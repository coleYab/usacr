<?php

namespace App\Enums;

enum DepositStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    /**
     * Labels used for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'በመጠባበቅ ላይ',
            self::Approved => 'የፀደቀ',
            self::Rejected => 'ውድቅ የተደረገ',
        };
    }
}
