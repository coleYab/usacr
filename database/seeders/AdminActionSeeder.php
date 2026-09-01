<?php

namespace Database\Seeders;

use App\Models\AdminAction;
use App\Models\Deposit;
use App\Models\Lottery;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin1 = User::where('email', 'yabume13@gmail.com')->first();
        $admin2 = User::where('email', 'admin@itemlottery.com')->first() ?? $admin1;
        $testUser = User::where('email', 'user@itemlottery.com')->first();
        $demoUser = User::where('email', 'demo@itemlottery.com')->first();
        $suspendedUser = User::where('email', 'suspended@itemlottery.com')->first();
        $bannedUser = User::where('email', 'banned@itemlottery.com')->first();

        // Clear existing actions in case re-seeding
        AdminAction::query()->delete();

        $actions = [
            // Deposit Approvals & Rejections
            [
                'admin_id' => $admin1->id,
                'action_type' => 'deposit.approved',
                'subject_type' => Deposit::class,
                'subject_id' => 1,
                'description' => 'Approved deposit of $500.00 for user Alex Tester (user@itemlottery.com). Verified bank transfer slip.',
                'created_at' => now()->subDays(10),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'deposit.approved',
                'subject_type' => Deposit::class,
                'subject_id' => 2,
                'description' => 'Approved deposit of $300.00 for user Alex Tester (user@itemlottery.com).',
                'created_at' => now()->subDays(8),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'deposit.rejected',
                'subject_type' => Deposit::class,
                'subject_id' => 3,
                'description' => 'Rejected deposit of $50.00 for user Alex Tester. Reason: Deposit receipt illegible / blurred reference ID.',
                'created_at' => now()->subDays(4),
            ],
            [
                'admin_id' => $admin2->id,
                'action_type' => 'deposit.approved',
                'subject_type' => Deposit::class,
                'subject_id' => 4,
                'description' => 'Approved deposit of $250.00 for user Alex Tester (user@itemlottery.com). Instant merchant confirmation verified.',
                'created_at' => now()->subDays(2),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'deposit.approved',
                'subject_type' => Deposit::class,
                'subject_id' => 5,
                'description' => 'Approved deposit of $300.00 for user Sarah Connor (demo@itemlottery.com).',
                'created_at' => now()->subDays(6),
            ],
            [
                'admin_id' => $admin2->id,
                'action_type' => 'deposit.rejected',
                'subject_type' => Deposit::class,
                'subject_id' => 6,
                'description' => 'Rejected deposit of $300.00 for user Marcus Vance. Reason: Sender bank account name does not match KYC verification.',
                'created_at' => now()->subDays(7),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'deposit.rejected',
                'subject_type' => Deposit::class,
                'subject_id' => 7,
                'description' => 'Rejected deposit of $1,500.00 for user Jordan Belfort. Reason: Duplicate transaction slip submitted.',
                'created_at' => now()->subDays(5),
            ],

            // Lottery Creation Actions
            [
                'admin_id' => $admin1->id,
                'action_type' => 'lottery.created',
                'subject_type' => Lottery::class,
                'subject_id' => 1,
                'description' => "Created lottery 'Nintendo Switch OLED Zelda Edition' with 150 tickets at $5.00 each.",
                'created_at' => now()->subDays(12),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'lottery.created',
                'subject_type' => Lottery::class,
                'subject_id' => 5,
                'description' => "Created lottery 'Rolex Submariner Date 41mm Starbucks' with 400 tickets at $50.00 each.",
                'created_at' => now()->subDays(11),
            ],
            [
                'admin_id' => $admin2->id,
                'action_type' => 'lottery.created',
                'subject_type' => Lottery::class,
                'subject_id' => 8,
                'description' => "Created lottery 'Porsche 911 GT3 RS Nürburgring VIP Experience' with 500 tickets at $75.00 each.",
                'created_at' => now()->subDays(10),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'lottery.created',
                'subject_type' => Lottery::class,
                'subject_id' => 16,
                'description' => "Created lottery 'Rolex Cosmograph Daytona 40mm' with 400 tickets at $50.00 each.",
                'created_at' => now()->subDays(9),
            ],

            // Lottery Cancellations & Refunds
            [
                'admin_id' => $admin1->id,
                'action_type' => 'lottery.cancelled',
                'subject_type' => Lottery::class,
                'subject_id' => 31,
                'description' => "Cancelled lottery '2023 Harley-Davidson CVO Road Glide'. Reason: International supplier allocation delayed. Automatically refunded 150 ticket purchases.",
                'created_at' => now()->subDays(5),
            ],
            [
                'admin_id' => $admin2->id,
                'action_type' => 'lottery.cancelled',
                'subject_type' => Lottery::class,
                'subject_id' => 32,
                'description' => "Cancelled lottery 'Luxury Aspen Snowmass 5-Bedroom Ski Chalet Weekend'. Reason: Unforeseen seasonal facility maintenance. Refunded 100 ticket purchases.",
                'created_at' => now()->subDays(3),
            ],

            // Manual Wallet Adjustments
            [
                'admin_id' => $admin1->id,
                'action_type' => 'wallet.manual_credit',
                'subject_type' => User::class,
                'subject_id' => $testUser ? $testUser->id : 3,
                'description' => "Manually credited $200.00 to user 'user@itemlottery.com'. Reason: VIP Loyalty Promotional Reward & Beta Tester Bonus",
                'created_at' => now()->subDays(3),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'wallet.manual_debit',
                'subject_type' => User::class,
                'subject_id' => $testUser ? $testUser->id : 3,
                'description' => "Manually debited $14.00 from user 'user@itemlottery.com'. Reason: International payment verification fee adjustment",
                'created_at' => now()->subHours(12),
            ],

            // User Moderation & Status Changes
            [
                'admin_id' => $admin2->id,
                'action_type' => 'user.suspended',
                'subject_type' => User::class,
                'subject_id' => $suspendedUser ? $suspendedUser->id : 5,
                'description' => "Updated status of user 'suspended@itemlottery.com' from active to suspended. Reason: Multiple duplicate accounts detected from same IP subnet.",
                'created_at' => now()->subDays(4),
            ],
            [
                'admin_id' => $admin1->id,
                'action_type' => 'user.banned',
                'subject_type' => User::class,
                'subject_id' => $bannedUser ? $bannedUser->id : 6,
                'description' => "Updated status of user 'banned@itemlottery.com' from active to banned. Reason: Fraudulent chargeback activity and automated ticket sniping bot.",
                'created_at' => now()->subDays(2),
            ],
            [
                'admin_id' => $admin2->id,
                'action_type' => 'user.reactivated',
                'subject_type' => User::class,
                'subject_id' => 7,
                'description' => "Updated status of user 'sophia.chen@example.com' from suspended to active. Reason: Passport KYC documentation verified and approved.",
                'created_at' => now()->subDay(),
            ],
        ];

        foreach ($actions as $act) {
            AdminAction::create($act);
        }
    }
}
