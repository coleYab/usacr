<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $yabuUser = User::where('email', 'yabume123@gmail.com')->first();
        $testUser = User::where('email', 'user@itemlottery.com')->first();
        $admin = User::where('email', 'yabume13@gmail.com')->first();

        $targetUsers = array_filter([$yabuUser, $testUser]);

        foreach ($targetUsers as $user) {
            DB::table('notifications')->where('notifiable_id', $user->id)->delete();

            $notifications = [
                // Unread Winner notification
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\LotteryDrawResultNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'type' => 'lottery.draw_result',
                        'lottery_id' => 16,
                        'lottery_title' => 'Rolex Cosmograph Daytona 40mm (18ct White Gold & Oysterflex Bracelet)',
                        'is_winner' => true,
                        'winning_ticket_code' => 'WIN-DAYTONA7',
                        'message' => "🎉 የ'Rolex Cosmograph Daytona 40mm' ዕጣ አሸንፈዋል!",
                        'url' => '/app/lotteries/16',
                        'icon' => 'trophy',
                    ]),
                    'read_at' => null,
                    'created_at' => now()->subHours(3),
                    'updated_at' => now()->subHours(3),
                ],
                // Unread Deposit Approved notification
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\DepositStatusNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'type' => 'deposit.status',
                        'deposit_id' => 2,
                        'status' => 'approved',
                        'amount' => '750.00',
                        'message' => 'የ $750.00 ተቀማጭ ገንዘብዎ የፀደቀ ሆኗል።',
                        'url' => '/app/wallet',
                        'icon' => 'wallet',
                    ]),
                    'read_at' => null,
                    'created_at' => now()->subHours(6),
                    'updated_at' => now()->subHours(6),
                ],
                // Read Winner notification
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\LotteryDrawResultNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'type' => 'lottery.draw_result',
                        'lottery_id' => 17,
                        'lottery_title' => 'Apple Vision Pro 1TB Spatial Computer & Dual Loop Band Set',
                        'is_winner' => true,
                        'winning_ticket_code' => 'WIN-VISPRO1',
                        'message' => "🎉 የ'Apple Vision Pro 1TB Spatial Computer' ዕጣ አሸንፈዋል!",
                        'url' => '/app/lotteries/17',
                        'icon' => 'trophy',
                    ]),
                    'read_at' => now()->subDays(1),
                    'created_at' => now()->subDays(1)->subHours(2),
                    'updated_at' => now()->subDays(1),
                ],
                // Read Deposit Rejected notification
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\DepositStatusNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'type' => 'deposit.status',
                        'deposit_id' => 3,
                        'status' => 'rejected',
                        'amount' => '100.00',
                        'message' => 'የ $100.00 ተቀማጭ ገንዘብዎ ውድቅ የተደረገ ሆኗል። ምክንያት፦ የባንክ ደረሰኝ ስም አልተዛመደም።',
                        'url' => '/app/wallet',
                        'icon' => 'wallet',
                    ]),
                    'read_at' => now()->subDays(4),
                    'created_at' => now()->subDays(4)->subHours(1),
                    'updated_at' => now()->subDays(4),
                ],
            ];

            foreach ($notifications as $n) {
                DB::table('notifications')->insert($n);
            }
        }
    }
}
