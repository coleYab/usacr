<?php

namespace Database\Seeders;

use App\Enums\DepositStatus;
use App\Enums\WalletTransactionType;
use App\Models\Deposit;
use App\Models\Lottery;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin1 = User::where('email', 'yabume13@gmail.com')->first();
        $yabuUser = User::where('email', 'yabume123@gmail.com')->first();
        $testUser = User::where('email', 'user@itemlottery.com')->first();
        $demoUser = User::where('email', 'demo@itemlottery.com')->first();

        $allTransactions = [];

        // 0. Yabume User (yabume123@gmail.com) Ledger & Balance
        if ($yabuUser) {
            $wallet = $yabuUser->wallet()->firstOrCreate(['balance' => '0.00']);
            $wallet->transactions()->delete();

            $yabuEvents = [
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '1000.00',
                    'balance_after' => '1000.00',
                    'description' => 'የተቀማጭ ገንዘብ ፀድቋል (Wire Transfer #TXN-9021)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(12),
                    'updated_at' => now()->subDays(12),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-100.00',
                    'balance_after' => '900.00',
                    'description' => 'የቲኬት ግዢ፦ Rolex Submariner Date 41mm (2 ቲኬቶች)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(9),
                    'updated_at' => now()->subDays(9),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '750.00',
                    'balance_after' => '1650.00',
                    'description' => 'የተቀማጭ ገንዘብ ፀድቋል (Instant Bank Transfer #TXN-9442)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(7),
                    'updated_at' => now()->subDays(7),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-50.00',
                    'balance_after' => '1600.00',
                    'description' => 'የቲኬት ግዢ፦ Rolex Cosmograph Daytona 40mm (1 ቲኬት)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(6),
                    'updated_at' => now()->subDays(6),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-30.00',
                    'balance_after' => '1570.00',
                    'description' => 'የቲኬት ግዢ፦ Sony PlayStation 5 Pro & 65" 4K OLED (3 ቲኬቶች)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(5),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-60.00',
                    'balance_after' => '1510.00',
                    'description' => 'የቲኬት ግዢ፦ Apple iPhone 16 Pro Max 512GB (4 ቲኬቶች)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(4),
                    'updated_at' => now()->subDays(4),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-225.00',
                    'balance_after' => '1285.00',
                    'description' => 'የቲኬት ግዢ፦ 2023 Harley-Davidson CVO Road Glide (3 ቲኬቶች)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(4)->subHours(3),
                    'updated_at' => now()->subDays(4)->subHours(3),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::Refund->value,
                    'amount' => '225.00',
                    'balance_after' => '1510.00',
                    'description' => 'የተሰረዘ ዕጣ ተመላሽ፦ 2023 Harley-Davidson CVO Road Glide (3 ቲኬቶች)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(3),
                    'updated_at' => now()->subDays(3),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::AdminCredit->value,
                    'amount' => '100.00',
                    'balance_after' => '1610.00',
                    'description' => 'የአድሚን ጭማሪ፦ VIP Welcome Loyalty Reward Bonus',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-75.00',
                    'balance_after' => '1535.00',
                    'description' => 'የቲኬት ግዢ፦ Porsche 911 GT3 RS VIP Experience (1 ቲኬት)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDay(),
                    'updated_at' => now()->subDay(),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-20.00',
                    'balance_after' => '1515.00',
                    'description' => 'የቲኬት ግዢ፦ Bose QuietComfort Ultra Headphones (2 ቲኬቶች)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subHours(8),
                    'updated_at' => now()->subHours(8),
                ],
            ];

            foreach ($yabuEvents as $tx) {
                $allTransactions[] = $tx;
            }

            $wallet->update(['balance' => '1515.00']);
        }

        // 1. Primary Test User (user@itemlottery.com) Ledger & Balance
        if ($testUser) {
            $wallet = $testUser->wallet()->firstOrCreate(['balance' => '0.00']);
            $wallet->transactions()->delete();

            $txEvents = [
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '500.00',
                    'balance_after' => '500.00',
                    'description' => 'Deposit approved (Wire Transfer #TXN-8934)',
                    'reference_type' => Deposit::class,
                    'reference_id' => 1,
                    'created_at' => now()->subDays(10),
                    'updated_at' => now()->subDays(10),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-100.00',
                    'balance_after' => '400.00',
                    'description' => 'Purchased 2 ticket(s) for Rolex Submariner Date 41mm',
                    'reference_type' => Lottery::class,
                    'reference_id' => 5,
                    'created_at' => now()->subDays(9),
                    'updated_at' => now()->subDays(9),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '300.00',
                    'balance_after' => '700.00',
                    'description' => 'Deposit approved (ACH Transfer #TXN-9124)',
                    'reference_type' => Deposit::class,
                    'reference_id' => 2,
                    'created_at' => now()->subDays(8),
                    'updated_at' => now()->subDays(8),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-30.00',
                    'balance_after' => '670.00',
                    'description' => 'Purchased 3 ticket(s) for Sony PlayStation 5 Pro & 65" 4K OLED',
                    'reference_type' => Lottery::class,
                    'reference_id' => 3,
                    'created_at' => now()->subDays(7),
                    'updated_at' => now()->subDays(7),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-50.00',
                    'balance_after' => '620.00',
                    'description' => 'Purchased 1 ticket(s) for Rolex Cosmograph Daytona 40mm',
                    'reference_type' => Lottery::class,
                    'reference_id' => 16,
                    'created_at' => now()->subDays(6),
                    'updated_at' => now()->subDays(6),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-25.00',
                    'balance_after' => '595.00',
                    'description' => 'Purchased 1 ticket(s) for Apple Vision Pro 1TB Spatial Computer',
                    'reference_type' => Lottery::class,
                    'reference_id' => 17,
                    'created_at' => now()->subDays(6)->addHours(2),
                    'updated_at' => now()->subDays(6)->addHours(2),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-225.00',
                    'balance_after' => '370.00',
                    'description' => 'Purchased 3 ticket(s) for 2023 Harley-Davidson CVO Road Glide',
                    'reference_type' => Lottery::class,
                    'reference_id' => 31,
                    'created_at' => now()->subDays(5)->subHours(4),
                    'updated_at' => now()->subDays(5)->subHours(4),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::Refund->value,
                    'amount' => '225.00',
                    'balance_after' => '595.00',
                    'description' => 'Refund for cancelled lottery: 2023 Harley-Davidson CVO Road Glide (3 ticket(s))',
                    'reference_type' => Lottery::class,
                    'reference_id' => 31,
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(5),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-75.00',
                    'balance_after' => '520.00',
                    'description' => 'Purchased 1 ticket(s) for Porsche 911 GT3 RS Nürburgring VIP Experience',
                    'reference_type' => Lottery::class,
                    'reference_id' => 8,
                    'created_at' => now()->subDays(4),
                    'updated_at' => now()->subDays(4),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::AdminCredit->value,
                    'amount' => '200.00',
                    'balance_after' => '720.00',
                    'description' => 'Admin manual credit: VIP Loyalty Promotional Reward & Beta Tester Bonus',
                    'reference_type' => User::class,
                    'reference_id' => $admin1->id,
                    'created_at' => now()->subDays(3),
                    'updated_at' => now()->subDays(3),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-60.00',
                    'balance_after' => '660.00',
                    'description' => 'Purchased 4 ticket(s) for Apple iPhone 16 Pro Max 512GB',
                    'reference_type' => Lottery::class,
                    'reference_id' => 4,
                    'created_at' => now()->subDays(3)->addHours(4),
                    'updated_at' => now()->subDays(3)->addHours(4),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '250.00',
                    'balance_after' => '910.00',
                    'description' => 'Deposit approved (Instant Card Top-Up #TXN-9841)',
                    'reference_type' => Deposit::class,
                    'reference_id' => 4,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-16.00',
                    'balance_after' => '894.00',
                    'description' => 'Purchased 2 ticket(s) for Steam Deck OLED 1TB Handheld Gaming PC',
                    'reference_type' => Lottery::class,
                    'reference_id' => 6,
                    'created_at' => now()->subDay(),
                    'updated_at' => now()->subDay(),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::AdminDebit->value,
                    'amount' => '-14.00',
                    'balance_after' => '880.00',
                    'description' => 'Admin manual debit: International payment verification fee adjustment',
                    'reference_type' => User::class,
                    'reference_id' => $admin1->id,
                    'created_at' => now()->subHours(12),
                    'updated_at' => now()->subHours(12),
                ],
            ];

            foreach ($txEvents as $tx) {
                $allTransactions[] = $tx;
            }

            $wallet->update(['balance' => '880.00']);
        }

        // 2. Demo User (demo@itemlottery.com) Ledger & Balance
        if ($demoUser) {
            $wallet = $demoUser->wallet()->firstOrCreate(['balance' => '0.00']);
            $wallet->transactions()->delete();

            $dEvents = [
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '300.00',
                    'balance_after' => '300.00',
                    'description' => 'Deposit approved (Wire Transfer #TXN-7412)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(6),
                    'updated_at' => now()->subDays(6),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-30.00',
                    'balance_after' => '270.00',
                    'description' => 'Purchased 1 ticket(s) for Breitling Navitimer B01 Chronograph 43mm',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(5),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::DepositCredit->value,
                    'amount' => '200.00',
                    'balance_after' => '470.00',
                    'description' => 'Deposit approved (Card Payment #TXN-8812)',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(3),
                    'updated_at' => now()->subDays(3),
                ],
                [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => '-50.00',
                    'balance_after' => '420.00',
                    'description' => 'Purchased 1 ticket(s) for Rolex Submariner Date 41mm',
                    'reference_type' => null,
                    'reference_id' => null,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
            ];

            foreach ($dEvents as $tx) {
                $allTransactions[] = $tx;
            }

            $wallet->update(['balance' => '420.00']);
        }

        // 3. Community Users Balances & Ledgers
        $otherUsers = User::where('role', User::ROLE_USER)
            ->whereNotIn('email', ['yabume123@gmail.com', 'user@itemlottery.com', 'demo@itemlottery.com'])
            ->get();

        foreach ($otherUsers as $cUser) {
            $wallet = $cUser->wallet()->firstOrCreate(['balance' => '0.00']);
            $wallet->transactions()->delete();

            $approvedDeposits = (float) $cUser->deposits()->where('status', DepositStatus::Approved)->sum('amount');
            $ticketsTotal = (float) $cUser->tickets()->sum('price_paid');

            $initialCredit = max(500.00, $approvedDeposits, $ticketsTotal + 150.00);

            // Record initial deposit transaction
            $allTransactions[] = [
                'wallet_id' => $wallet->id,
                'type' => WalletTransactionType::DepositCredit->value,
                'amount' => sprintf('%.2f', $initialCredit),
                'balance_after' => sprintf('%.2f', $initialCredit),
                'description' => 'Deposit approved (Verified Electronic Transfer)',
                'reference_type' => null,
                'reference_id' => null,
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ];

            $runningBalance = $initialCredit;
            // Record sample recent ticket purchases (take up to 10 to keep history rich yet fast)
            $userTickets = $cUser->tickets()->latest()->take(10)->get();
            foreach ($userTickets as $t) {
                $runningBalance = max(0, $runningBalance - (float) $t->price_paid);
                $allTransactions[] = [
                    'wallet_id' => $wallet->id,
                    'type' => WalletTransactionType::TicketPurchase->value,
                    'amount' => sprintf('-%.2f', (float) $t->price_paid),
                    'balance_after' => sprintf('%.2f', $runningBalance),
                    'description' => "Ticket purchase: {$t->ticket_code}",
                    'reference_type' => Lottery::class,
                    'reference_id' => $t->lottery_id,
                    'created_at' => $t->created_at ?? now()->subDays(2),
                    'updated_at' => $t->created_at ?? now()->subDays(2),
                ];
            }

            $wallet->update(['balance' => sprintf('%.2f', $runningBalance)]);
        }

        // Bulk insert all transactions in chunks
        foreach (array_chunk($allTransactions, 250) as $chunk) {
            WalletTransaction::insert($chunk);
        }
    }
}
