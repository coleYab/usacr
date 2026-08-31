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
            self::Active => 'Active',
            self::Won => 'Won',
            self::Lost => 'Lost',
            self::Refunded => 'Refunded',
        };
    }
}
