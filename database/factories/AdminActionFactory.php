<?php

namespace Database\Factories;

use App\Models\AdminAction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdminAction>
 */
class AdminActionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'admin_id' => User::factory()->admin(),
            'action_type' => 'deposit.approved',
            'subject_type' => 'App\Models\Deposit',
            'subject_id' => 1,
            'description' => fake()->sentence(),
        ];
    }
}
