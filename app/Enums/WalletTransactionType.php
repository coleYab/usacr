<?php

namespace App\Enums;

enum WalletTransactionType: string
{
    case DepositCredit = 'deposit_credit';
    case TicketPurchase = 'ticket_purchase';
    case AdminCredit = 'admin_credit';
    case AdminDebit = 'admin_debit';
    case Refund = 'refund';

    /**
     * Whether this type represents a credit (money in).
     */
    public function isCredit(): bool
    {
        return match ($this) {
            self::DepositCredit, self::AdminCredit, self::Refund => true,
            self::TicketPurchase, self::AdminDebit => false,
        };
    }

    /**
     * Labels used for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::DepositCredit => 'ተቀማጭ ገንዘብ',
            self::TicketPurchase => 'የቲኬት ግዢ',
            self::AdminCredit => 'የአድሚን ጭማሪ',
            self::AdminDebit => 'የአድሚን ቅነሳ',
            self::Refund => 'ተመላሽ',
        };
    }
}
