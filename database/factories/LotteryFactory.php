<?php

namespace Database\Factories;

use App\Enums\LotteryStatus;
use App\Models\Lottery;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lottery>
 */
class LotteryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'media' => [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
            ],
            'ticket_price' => $this->faker->randomFloat(2, 5, 50),
            'total_tickets' => 100,
            'tickets_sold' => 0,
            'draw_at' => now()->addDays(7),
            'status' => LotteryStatus::Active,
            'winning_ticket_id' => null,
            'created_by' => User::factory()->admin(),
        ];
    }

    /**
     * Indicate that the lottery is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LotteryStatus::Active,
            'draw_at' => now()->addDays(5),
        ]);
    }

    /**
     * Indicate that the lottery is in draft status.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LotteryStatus::Draft,
        ]);
    }

    /**
     * Indicate that the lottery is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LotteryStatus::Completed,
            'draw_at' => now()->subDay(),
        ]);
    }

    /**
     * Indicate that the lottery is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LotteryStatus::Cancelled,
        ]);
    }

    /**
     * Indicate that the lottery is ending soon (within 1 hour).
     */
    public function endingSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LotteryStatus::Active,
            'draw_at' => now()->addMinutes(45),
        ]);
    }

    /**
     * Indicate that the lottery is sold out.
     */
    public function soldOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_tickets' => 50,
            'tickets_sold' => 50,
        ]);
    }
}
