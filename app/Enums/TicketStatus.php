<?php

namespace App\Enums;

enum TicketStatus: string
{
    case Active = 'active';
    case Won = 'won';
    case Lost = 'lost';
    case Refunded = 'refunded';

    /**
     * Labels used for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Active => 'ንቁ',
            self::Won => 'አሸናፊ',
            self::Lost => 'ያላሸነፈ',
            self::Refunded => 'ተመላሽ',
        };
    }
}
