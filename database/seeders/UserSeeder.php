<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        // 1. Super Admin
        $admin1 = User::updateOrCreate(
            ['email' => 'yabume13@gmail.com'],
            [
                'name' => 'Yabu Admin',
                'password' => $password,
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );
        $admin1->wallet()->firstOrCreate(['balance' => '0.00']);

        // 1b. Yabume Primary User Account
        $yabuUser = User::updateOrCreate(
            ['email' => 'yabume123@gmail.com'],
            [
                'name' => 'Yeabsira Moges',
                'password' => $password,
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );
        $yabuUser->wallet()->firstOrCreate(['balance' => '0.00']);

        // 2. Secondary Compliance & Operations Admin
        $admin2 = User::updateOrCreate(
            ['email' => 'admin@itemlottery.com'],
            [
                'name' => 'Chief Operations Admin',
                'password' => $password,
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );
        $admin2->wallet()->firstOrCreate(['balance' => '0.00']);

        // 3. Primary Tester / User Account
        $user1 = User::updateOrCreate(
            ['email' => 'user@itemlottery.com'],
            [
                'name' => 'Alex Tester',
                'password' => $password,
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );
        $user1->wallet()->firstOrCreate(['balance' => '0.00']);

        // 4. Secondary Test User
        $user2 = User::updateOrCreate(
            ['email' => 'demo@itemlottery.com'],
            [
                'name' => 'Sarah Connor',
                'password' => $password,
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'email_verified_at' => now(),
            ]
        );
        $user2->wallet()->firstOrCreate(['balance' => '0.00']);

        // 5. Suspended User
        $userSuspended = User::updateOrCreate(
            ['email' => 'suspended@itemlottery.com'],
            [
                'name' => 'Suspended Account',
                'password' => $password,
                'role' => User::ROLE_USER,
                'status' => User::STATUS_SUSPENDED,
                'email_verified_at' => now(),
            ]
        );
        $userSuspended->wallet()->firstOrCreate(['balance' => '0.00']);

        // 6. Banned User
        $userBanned = User::updateOrCreate(
            ['email' => 'banned@itemlottery.com'],
            [
                'name' => 'Banned Spammer',
                'password' => $password,
                'role' => User::ROLE_USER,
                'status' => User::STATUS_BANNED,
                'email_verified_at' => now(),
            ]
        );
        $userBanned->wallet()->firstOrCreate(['balance' => '0.00']);

        // 7. Community Users
        $communityUsers = [
            ['name' => 'Sophia Chen', 'email' => 'sophia.chen@example.com'],
            ['name' => 'Marcus Vance', 'email' => 'marcus.vance@example.com'],
            ['name' => 'Elena Rostova', 'email' => 'elena.rostova@example.com'],
            ['name' => 'Liam O\'Connor', 'email' => 'liam.oconnor@example.com'],
            ['name' => 'Isabella Rossi', 'email' => 'isabella.rossi@example.com'],
            ['name' => 'Lucas Silva', 'email' => 'lucas.silva@example.com'],
            ['name' => 'Zara Ahmed', 'email' => 'zara.ahmed@example.com'],
            ['name' => 'David Kim', 'email' => 'david.kim@example.com'],
            ['name' => 'Chloe Frazer', 'email' => 'chloe.frazer@example.com'],
            ['name' => 'Nathan Drake', 'email' => 'nathan.drake@example.com'],
            ['name' => 'Victor Sullivan', 'email' => 'victor.sullivan@example.com'],
            ['name' => 'Samantha Geller', 'email' => 'samantha.geller@example.com'],
            ['name' => 'Jordan Belfort', 'email' => 'jordan.belfort@example.com'],
            ['name' => 'Maya Lin', 'email' => 'maya.lin@example.com'],
            ['name' => 'James Holden', 'email' => 'james.holden@example.com'],
            ['name' => 'Naomi Nagata', 'email' => 'naomi.nagata@example.com'],
            ['name' => 'Amos Burton', 'email' => 'amos.burton@example.com'],
            ['name' => 'Alex Kamal', 'email' => 'alex.kamal@example.com'],
            ['name' => 'Chrisjen Avasarala', 'email' => 'chrisjen.avasarala@example.com'],
            ['name' => 'Bobbie Draper', 'email' => 'bobbie.draper@example.com'],
            ['name' => 'Arthur Dent', 'email' => 'arthur.dent@example.com'],
            ['name' => 'Ford Prefect', 'email' => 'ford.prefect@example.com'],
            ['name' => 'Tricia McMillan', 'email' => 'tricia.mcmillan@example.com'],
            ['name' => 'Bruce Wayne', 'email' => 'bruce.wayne@example.com'],
            ['name' => 'Clark Kent', 'email' => 'clark.kent@example.com'],
        ];

        foreach ($communityUsers as $uData) {
            $user = User::updateOrCreate(
                ['email' => $uData['email']],
                [
                    'name' => $uData['name'],
                    'password' => $password,
                    'role' => User::ROLE_USER,
                    'status' => User::STATUS_ACTIVE,
                    'email_verified_at' => now(),
                ]
            );
            $user->wallet()->firstOrCreate(['balance' => '0.00']);
        }
    }
}
