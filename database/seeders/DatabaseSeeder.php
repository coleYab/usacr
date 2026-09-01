<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with a comprehensive, rich dataset across all features and roles.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            LotterySeeder::class,
            DepositSeeder::class,
            WalletSeeder::class,
            AdminActionSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
