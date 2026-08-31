<?php

namespace Database\Factories;

use App\Enums\TicketStatus;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lottery_id' => Lottery::factory(),
            'user_id' => User::factory(),
            'ticket_code' => 'TKT-'.strtoupper(Str::random(8)),
            'price_paid' => '10.00',
            'status' => TicketStatus::Active,
        ];
    }

    /**
     * Indicate that the ticket is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketStatus::Active,
        ]);
    }

    /**
     * Indicate that the ticket won the lottery.
     */
    public function won(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketStatus::Won,
        ]);
    }

    /**
     * Indicate that the ticket lost the lottery.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketStatus::Lost,
        ]);
    }

    /**
     * Indicate that the ticket was refunded.
     */
    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketStatus::Refunded,
        ]);
    }
}
