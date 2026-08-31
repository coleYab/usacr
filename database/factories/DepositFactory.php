<?php

namespace Database\Factories;

use App\Enums\DepositStatus;
use App\Models\Deposit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Deposit>
 */
class DepositFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'receipt_path' => null,
            'status' => DepositStatus::Pending,
            'rejection_reason' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];
    }

    /**
     * Indicate the deposit is awaiting review.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DepositStatus::Pending,
        ]);
    }

    /**
     * Indicate the deposit was approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DepositStatus::Approved,
        ]);
    }

    /**
     * Indicate the deposit was rejected.
     */
    public function rejected(?string $reason = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DepositStatus::Rejected,
            'rejection_reason' => $reason ?? fake()->sentence(),
        ]);
    }

    /**
     * Indicate the deposit carries a stored receipt.
     */
    public function withReceipt(): static
    {
        return $this->state(fn (array $attributes) => [
            'receipt_path' => 'receipts/'.$this->faker->uuid().'.png',
        ]);
    }
}
