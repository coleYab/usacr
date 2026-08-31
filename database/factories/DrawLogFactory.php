<?php

namespace Database\Factories;

use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DrawLog>
 */
class DrawLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $seed = bin2hex(random_bytes(16));
        $hash = hash('sha256', $seed);

        return [
            'lottery_id' => Lottery::factory(),
            'winning_ticket_id' => Ticket::factory(),
            'total_participants' => fake()->numberBetween(1, 20),
            'total_tickets' => fake()->numberBetween(5, 100),
            'verification_seed' => $seed,
            'verification_hash' => $hash,
            'processed_at' => now(),
        ];
    }
}
