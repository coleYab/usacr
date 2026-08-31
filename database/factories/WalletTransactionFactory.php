<?php

namespace Database\Factories;

use App\Enums\WalletTransactionType;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WalletTransaction>
 */
class WalletTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 1, 200);

        return [
            'wallet_id' => Wallet::factory(),
            'type' => WalletTransactionType::DepositCredit,
            'amount' => $amount,
            'balance_after' => $amount,
            'reference_type' => null,
            'reference_id' => null,
            'description' => null,
        ];
    }

    /**
     * Indicate this is a deposit credit.
     */
    public function depositCredit(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => WalletTransactionType::DepositCredit,
        ]);
    }
}
