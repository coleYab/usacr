<?php

namespace App\Exceptions;

use App\Models\Wallet;
use Exception;

class InsufficientFundsException extends Exception
{
    /**
     * Create a new insufficient funds exception.
     */
    public function __construct(
        public readonly Wallet $wallet,
        public readonly string $amount,
    ) {
        parent::__construct('Insufficient funds in wallet.');
    }
}
