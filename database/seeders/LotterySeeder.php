<?php

namespace Database\Seeders;

use App\Enums\LotteryStatus;
use App\Enums\TicketStatus;
use App\Models\DrawLog;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LotterySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find or create admin user to be the creator
        $admin = User::where('role', User::ROLE_ADMIN)->first() ?? User::factory()->admin()->create([
            'name' => 'Admin Manager',
            'email' => 'admin@itemlottery.com',
        ]);

        // Create some sample participants
        $participants = User::where('role', User::ROLE_USER)->get();
        if ($participants->count() < 5) {
            $participants = User::factory()->count(10)->create();
        }

        $items = [
            [
                'title' => 'Rolex Submariner Date 41mm "Starbucks" (Oystersteel & Green Bezel)',
                'description' => 'Brand new 2024 reference 126610LV with box, papers, and worldwide 5-year international warranty. Fitted on an Oystersteel bracelet with Oysterlock safety clasp and Glidelock extension system.',
                'media' => [
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '25.00',
                'total_tickets' => 500,
                'sold_ratio' => 0.82,
                'draw_at' => now()->addHours(2)->addMinutes(15),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Sony PlayStation 5 Pro & 65" 4K OLED HDR Battle-Station',
                'description' => 'The ultimate next-gen gaming bundle: PlayStation 5 Pro 2TB console, two DualSense Edge wireless controllers, Pulse Elite wireless headset, and an LG 65-inch OLED 120Hz 4K gaming display.',
                'media' => [
                    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '10.00',
                'total_tickets' => 300,
                'sold_ratio' => 0.68,
                'draw_at' => now()->addHours(5)->addMinutes(45),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Apple iPhone 16 Pro Max 512GB (Desert Titanium) + AirPods Pro 2',
                'description' => 'Grade-5 titanium construction with refined textured matte glass back, Camera Control button, 48MP Fusion camera system, and Apple Intelligence with A18 Pro silicon.',
                'media' => [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '15.00',
                'total_tickets' => 200,
                'sold_ratio' => 0.45,
                'draw_at' => now()->addHours(14),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => '2024 Ducati Panigale V4 S Superbike Track Experience & Custom Gear',
                'description' => 'Exclusive weekend VIP VIP track pass with professional coaching, full Dainese custom-fitted leather suit, AGV Pista GP RR carbon helmet, and 3 nights luxury paddock hospitality.',
                'media' => [
                    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 400,
                'sold_ratio' => 0.74,
                'draw_at' => now()->addDays(1)->addHours(4),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Apple MacBook Pro 16" M3 Max (36GB Unified RAM, 1TB SSD, Space Black)',
                'description' => '16-core CPU, 40-core GPU, Liquid Retina XDR display with 1600 nits peak brightness, 22-hour battery life, and complete AppleCare+ 3-year accidental coverage plan.',
                'media' => [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '20.00',
                'total_tickets' => 250,
                'sold_ratio' => 0.35,
                'draw_at' => now()->addDays(2)->addHours(8),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Leica Q3 Compact Full-Frame Digital Camera & Handcrafted Leather Kit',
                'description' => '60-megapixel BSI CMOS full-frame sensor with Summilux 28mm f/1.7 ASPH prime lens, 8K video recording, phase detection AF, and Oberwerth German leather bag.',
                'media' => [
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '35.00',
                'total_tickets' => 220,
                'sold_ratio' => 0.22,
                'draw_at' => now()->addDays(3)->addHours(12),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Porsche 911 GT3 RS Nürburgring Nordschleife VIP Experience',
                'description' => 'Includes 10 hot laps in the 911 GT3 RS with Porsche factory test drivers, telemetry analysis, 4 nights at the Lindner Nürburgring Congress Hotel, and all flights included.',
                'media' => [
                    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '75.00',
                'total_tickets' => 500,
                'sold_ratio' => 0.58,
                'draw_at' => now()->addDays(4)->addHours(6),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Omega Speedmaster Moonwatch Professional Co-Axial Master Chronometer',
                'description' => 'Hesalite glass reference 310.30.42.50.01.001 with manual-winding Calibre 3861 movement, METAS certified chronometer resistant to 15,000 gauss magnetic fields.',
                'media' => [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '20.00',
                'total_tickets' => 350,
                'sold_ratio' => 0.42,
                'draw_at' => now()->addDays(5)->addHours(18),
                'status' => LotteryStatus::Active,
            ],
        ];

        foreach ($items as $data) {
            $soldRatio = $data['sold_ratio'];
            unset($data['sold_ratio']);

            $soldCount = (int) round($data['total_tickets'] * $soldRatio);
            $data['tickets_sold'] = $soldCount;
            $data['created_by'] = $admin->id;

            $lottery = Lottery::create($data);

            // Generate ticket records for participants
            for ($i = 0; $i < $soldCount; $i++) {
                $user = $participants[$i % $participants->count()];
                Ticket::create([
                    'lottery_id' => $lottery->id,
                    'user_id' => $user->id,
                    'ticket_code' => strtoupper(Str::random(8)),
                    'price_paid' => $lottery->ticket_price,
                    'status' => TicketStatus::Active,
                ]);
            }
        }

        // Seed 2 Completed lotteries with DrawLogs and winners for Results testing
        $completedItems = [
            [
                'title' => 'Rolex Cosmograph Daytona 40mm (18ct White Gold & Oysterflex Bracelet)',
                'description' => 'Iconic racing chronograph reference 126519LN featuring black dial with sundust counters, Cerachrom black ceramic tachymetric bezel, and 4131 manufacture caliber.',
                'media' => [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 400,
                'tickets_sold' => 400,
                'draw_at' => now()->subDays(2),
                'status' => LotteryStatus::Completed,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Apple Vision Pro 1TB Spatial Computer & Dual Loop Band Set',
                'description' => 'Revolutionary spatial computing device with 23 million pixels across two micro-OLED displays, eye tracking, hand gestures, and personalized spatial audio.',
                'media' => [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '25.00',
                'total_tickets' => 200,
                'tickets_sold' => 200,
                'draw_at' => now()->subDays(4),
                'status' => LotteryStatus::Completed,
                'created_by' => $admin->id,
            ],
        ];

        foreach ($completedItems as $cData) {
            $lottery = Lottery::create($cData);

            $allTicketIds = [];
            for ($i = 0; $i < $lottery->tickets_sold; $i++) {
                $user = $participants[$i % $participants->count()];
                $ticket = Ticket::create([
                    'lottery_id' => $lottery->id,
                    'user_id' => $user->id,
                    'ticket_code' => strtoupper(Str::random(8)),
                    'price_paid' => $lottery->ticket_price,
                    'status' => TicketStatus::Lost,
                ]);
                $allTicketIds[] = $ticket->id;
            }

            // Pick a winner ticket
            $winningTicketId = $allTicketIds[array_rand($allTicketIds)];
            $winningTicket = Ticket::find($winningTicketId);
            if ($winningTicket) {
                $winningTicket->update(['status' => TicketStatus::Won]);
                $lottery->update(['winning_ticket_id' => $winningTicket->id]);

                $seed = bin2hex(random_bytes(16));
                $hash = hash('sha256', "{$seed}:{$winningTicket->id}:{$lottery->tickets_sold}");

                DrawLog::create([
                    'lottery_id' => $lottery->id,
                    'winning_ticket_id' => $winningTicket->id,
                    'verification_seed' => $seed,
                    'verification_hash' => $hash,
                    'total_participants' => $lottery->participantCount(),
                    'total_tickets' => $lottery->tickets_sold,
                    'processed_at' => $lottery->draw_at,
                ]);
            }
        }
    }
}
