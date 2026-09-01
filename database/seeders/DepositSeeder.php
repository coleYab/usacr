<?php

namespace Database\Seeders;

use App\Enums\DepositStatus;
use App\Models\Deposit;
use App\Models\User;
use Illuminate\Database\Seeder;

class DepositSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin1 = User::where('email', 'yabume13@gmail.com')->first();
        $admin2 = User::where('email', 'admin@itemlottery.com')->first() ?? $admin1;

        $yabuUser = User::where('email', 'yabume123@gmail.com')->first();
        $testUser = User::where('email', 'user@itemlottery.com')->first();
        $demoUser = User::where('email', 'demo@itemlottery.com')->first();

        // 0. Deposits for Yabume User (yabume123@gmail.com)
        if ($yabuUser) {
            Deposit::create([
                'user_id' => $yabuUser->id,
                'amount' => '1000.00',
                'receipt_path' => 'receipts/wire_transfer.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => now()->subDays(12),
                'created_at' => now()->subDays(12)->subMinutes(30),
            ]);

            Deposit::create([
                'user_id' => $yabuUser->id,
                'amount' => '750.00',
                'receipt_path' => 'receipts/deposit_proof.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => now()->subDays(7),
                'created_at' => now()->subDays(7)->subMinutes(15),
            ]);

            Deposit::create([
                'user_id' => $yabuUser->id,
                'amount' => '100.00',
                'receipt_path' => 'receipts/sample_receipt.png',
                'status' => DepositStatus::Rejected,
                'rejection_reason' => 'የተላከው የባንክ ደረሰኝ ስም እና የመለያው ስም አልተዛመደም። እባክዎ ትክክለኛ ደረሰኝ ይላኩ።',
                'reviewed_by' => $admin2->id,
                'reviewed_at' => now()->subDays(3),
                'created_at' => now()->subDays(3)->subMinutes(40),
            ]);

            Deposit::create([
                'user_id' => $yabuUser->id,
                'amount' => '350.00',
                'receipt_path' => 'receipts/wire_transfer.png',
                'status' => DepositStatus::Pending,
                'created_at' => now()->subHours(2),
            ]);

            Deposit::create([
                'user_id' => $yabuUser->id,
                'amount' => '500.00',
                'receipt_path' => 'receipts/deposit_proof.png',
                'status' => DepositStatus::Pending,
                'created_at' => now()->subMinutes(25),
            ]);
        }

        // 1. Deposits for Primary Test User (user@itemlottery.com)
        if ($testUser) {
            // Approved 1 ($500.00)
            Deposit::create([
                'user_id' => $testUser->id,
                'amount' => '500.00',
                'receipt_path' => 'receipts/sample_receipt.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => now()->subDays(10),
                'created_at' => now()->subDays(10)->subMinutes(15),
            ]);

            // Approved 2 ($300.00)
            Deposit::create([
                'user_id' => $testUser->id,
                'amount' => '300.00',
                'receipt_path' => 'receipts/wire_transfer.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => now()->subDays(8),
                'created_at' => now()->subDays(8)->subMinutes(20),
            ]);

            // Rejected ($50.00)
            Deposit::create([
                'user_id' => $testUser->id,
                'amount' => '50.00',
                'receipt_path' => 'receipts/sample_receipt.png',
                'status' => DepositStatus::Rejected,
                'rejection_reason' => 'Deposit receipt illegible / blurred reference ID. Please upload a clear bank confirmation statement.',
                'reviewed_by' => $admin1->id,
                'reviewed_at' => now()->subDays(4),
                'created_at' => now()->subDays(4)->subMinutes(45),
            ]);

            // Approved 3 ($250.00)
            Deposit::create([
                'user_id' => $testUser->id,
                'amount' => '250.00',
                'receipt_path' => 'receipts/deposit_proof.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin2->id,
                'reviewed_at' => now()->subDays(2),
                'created_at' => now()->subDays(2)->subMinutes(10),
            ]);

            // Pending 1 ($150.00)
            Deposit::create([
                'user_id' => $testUser->id,
                'amount' => '150.00',
                'receipt_path' => 'receipts/wire_transfer.png',
                'status' => DepositStatus::Pending,
                'created_at' => now()->subHours(3),
            ]);

            // Pending 2 ($200.00)
            Deposit::create([
                'user_id' => $testUser->id,
                'amount' => '200.00',
                'receipt_path' => 'receipts/deposit_proof.png',
                'status' => DepositStatus::Pending,
                'created_at' => now()->subMinutes(30),
            ]);
        }

        // 2. Deposits for Demo User (demo@itemlottery.com)
        if ($demoUser) {
            Deposit::create([
                'user_id' => $demoUser->id,
                'amount' => '300.00',
                'receipt_path' => 'receipts/sample_receipt.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => now()->subDays(6),
                'created_at' => now()->subDays(6)->subMinutes(30),
            ]);

            Deposit::create([
                'user_id' => $demoUser->id,
                'amount' => '200.00',
                'receipt_path' => 'receipts/wire_transfer.png',
                'status' => DepositStatus::Approved,
                'reviewed_by' => $admin2->id,
                'reviewed_at' => now()->subDays(3),
                'created_at' => now()->subDays(3)->subMinutes(15),
            ]);

            Deposit::create([
                'user_id' => $demoUser->id,
                'amount' => '100.00',
                'receipt_path' => 'receipts/deposit_proof.png',
                'status' => DepositStatus::Pending,
                'created_at' => now()->subHours(1),
            ]);
        }

        // 3. Deposits for Community Users (Pending, Approved, Rejected)
        /** @var array<array{email: string, amount: numeric-string, status: DepositStatus, days?: int, hours?: int, reason?: string}> $communityDepositConfigs */
        $communityDepositConfigs = [
            ['email' => 'sophia.chen@example.com', 'amount' => '750.00', 'status' => DepositStatus::Approved, 'days' => 12],
            ['email' => 'marcus.vance@example.com', 'amount' => '1000.00', 'status' => DepositStatus::Approved, 'days' => 11],
            ['email' => 'elena.rostova@example.com', 'amount' => '450.00', 'status' => DepositStatus::Approved, 'days' => 9],
            ['email' => 'liam.oconnor@example.com', 'amount' => '600.00', 'status' => DepositStatus::Approved, 'days' => 8],
            ['email' => 'isabella.rossi@example.com', 'amount' => '500.00', 'status' => DepositStatus::Approved, 'days' => 7],
            ['email' => 'lucas.silva@example.com', 'amount' => '400.00', 'status' => DepositStatus::Approved, 'days' => 6],
            ['email' => 'zara.ahmed@example.com', 'amount' => '800.00', 'status' => DepositStatus::Approved, 'days' => 5],
            ['email' => 'david.kim@example.com', 'amount' => '1200.00', 'status' => DepositStatus::Approved, 'days' => 4],
            ['email' => 'chloe.frazer@example.com', 'amount' => '350.00', 'status' => DepositStatus::Approved, 'days' => 3],
            ['email' => 'nathan.drake@example.com', 'amount' => '500.00', 'status' => DepositStatus::Approved, 'days' => 2],

            // Pending deposits from community for admin review
            ['email' => 'bruce.wayne@example.com', 'amount' => '5000.00', 'status' => DepositStatus::Pending, 'hours' => 2],
            ['email' => 'clark.kent@example.com', 'amount' => '50.00', 'status' => DepositStatus::Pending, 'hours' => 4],
            ['email' => 'arthur.dent@example.com', 'amount' => '42.00', 'status' => DepositStatus::Pending, 'hours' => 6],
            ['email' => 'ford.prefect@example.com', 'amount' => '250.00', 'status' => DepositStatus::Pending, 'hours' => 8],

            // Rejected deposits from community with reasons
            ['email' => 'marcus.vance@example.com', 'amount' => '300.00', 'status' => DepositStatus::Rejected, 'reason' => 'Sender bank account name does not match KYC verification.', 'days' => 7],
            ['email' => 'jordan.belfort@example.com', 'amount' => '1500.00', 'status' => DepositStatus::Rejected, 'reason' => 'Duplicate transaction slip submitted.', 'days' => 5],
            ['email' => 'samantha.geller@example.com', 'amount' => '100.00', 'status' => DepositStatus::Rejected, 'reason' => 'Transfer memo / payment identifier was missing.', 'days' => 4],
        ];

        foreach ($communityDepositConfigs as $config) {
            $user = User::where('email', $config['email'])->first();
            if (! $user) {
                continue;
            }

            $status = $config['status'];
            $days = $config['days'] ?? 1;
            $hours = $config['hours'] ?? 1;
            $reason = $config['reason'] ?? null;

            $data = [
                'user_id' => $user->id,
                'amount' => $config['amount'],
                'receipt_path' => 'receipts/sample_receipt.png',
                'status' => $status,
            ];

            if ($status === DepositStatus::Approved) {
                $data['reviewed_by'] = $admin1->id;
                $data['reviewed_at'] = now()->subDays($days);
                $data['created_at'] = now()->subDays($days)->subMinutes(20);
            } elseif ($status === DepositStatus::Rejected) {
                $data['reviewed_by'] = $admin2->id;
                $data['reviewed_at'] = now()->subDays($days);
                $data['rejection_reason'] = $reason;
                $data['created_at'] = now()->subDays($days)->subMinutes(30);
            } else {
                $data['created_at'] = now()->subHours($hours);
            }

            Deposit::create($data);
        }
    }
}
