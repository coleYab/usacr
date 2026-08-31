<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'yabume13@gmail.com'],
            [
                'name' => 'Yabu Admin',
                'password' => bcrypt('password'),
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
            ]
        );

        $this->call(LotterySeeder::class);
    }
}
