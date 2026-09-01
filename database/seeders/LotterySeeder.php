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
        $admin = User::where('email', 'yabume13@gmail.com')->first()
            ?? User::where('role', User::ROLE_ADMIN)->first();

        $yabuUser = User::where('email', 'yabume123@gmail.com')->first();
        $testUser = User::where('email', 'user@itemlottery.com')->first();

        $communityUsers = User::where('role', User::ROLE_USER)
            ->whereNotIn('email', ['yabume123@gmail.com', 'user@itemlottery.com', 'demo@itemlottery.com', 'suspended@itemlottery.com', 'banned@itemlottery.com'])
            ->get();

        if ($communityUsers->isEmpty()) {
            $communityUsers = User::factory()->count(15)->create();
        }

        $communityUserIds = $communityUsers->pluck('id')->all();
        $userCount = count($communityUserIds);

        // =========================================================================
        // 1. ACTIVE LOTTERIES (14 items across various categories, prices, timers)
        // =========================================================================
        $activeItems = [
            // Ending in < 1 hour (Urgent)
            [
                'title' => 'Nintendo Switch OLED (Zelda: Tears of the Kingdom Edition) + Pro Controller',
                'description' => "Limited Collector's Edition OLED Console featuring stunning Hylian gold accents, matched Joy-Cons, dock with Triforce crest, official Nintendo Switch Pro Controller, and carrying case.",
                'media' => [
                    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '5.00',
                'total_tickets' => 150,
                'sold_ratio' => 0.95,
                'draw_at' => now()->addMinutes(25),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Bose QuietComfort Ultra Noise-Cancelling Headphones + $100 Spotify Gift Card',
                'description' => 'World-class noise cancellation, breakthrough spatialized audio for immersive listening, CustomTune technology, 24-hour battery life, and ultra-plush protein leather earcups in Black Onyx.',
                'media' => [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '10.00',
                'total_tickets' => 120,
                'sold_ratio' => 0.95,
                'draw_at' => now()->addMinutes(48),
                'status' => LotteryStatus::Active,
            ],

            // Ending in < 6 hours
            [
                'title' => 'Sony PlayStation 5 Pro (2TB) & 65" 4K OLED HDR Battle-Station',
                'description' => 'The ultimate next-gen gaming bundle: PlayStation 5 Pro 2TB console with PlayStation Spectral Super Resolution (PSSR), two DualSense Edge controllers, Pulse Elite wireless headset, and LG 65-inch OLED 120Hz 4K gaming display.',
                'media' => [
                    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507457379470-08b800bebc67?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '10.00',
                'total_tickets' => 300,
                'sold_ratio' => 0.85,
                'draw_at' => now()->addHours(3),
                'status' => LotteryStatus::Active,
                'user_tickets_count' => 3, // For test user
            ],
            [
                'title' => 'Apple iPhone 16 Pro Max 512GB (Desert Titanium) + AirPods Pro 2 USB-C',
                'description' => 'Grade-5 titanium construction with refined textured matte glass back, Camera Control tactile button, 48MP Fusion camera system, and Apple Intelligence with A18 Pro silicon chip.',
                'media' => [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '15.00',
                'total_tickets' => 250,
                'sold_ratio' => 0.70,
                'draw_at' => now()->addHours(5)->addMinutes(30),
                'status' => LotteryStatus::Active,
                'user_tickets_count' => 4, // For test user
            ],

            // Ending in < 24 hours
            [
                'title' => 'Rolex Submariner Date 41mm "Starbucks" 126610LV (Oystersteel & Green Bezel)',
                'description' => 'Brand new 2024 reference 126610LV with green Cerachrom ceramic bezel, black dial, Chromalight display, and worldwide 5-year international warranty. Fitted on an Oystersteel bracelet with Oysterlock safety clasp and Glidelock extension.',
                'media' => [
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 400,
                'sold_ratio' => 0.82,
                'draw_at' => now()->addHours(14),
                'status' => LotteryStatus::Active,
                'user_tickets_count' => 2, // For test user
            ],
            [
                'title' => 'Steam Deck OLED 1TB Handheld Gaming PC + Dock + $200 Steam Wallet Card',
                'description' => '7.4-inch 90Hz HDR OLED display with 1,000 nits peak brightness, 6nm AMD APU, 50Wh battery, premium anti-glare etched glass, official Steam Deck Dock, and carrying case.',
                'media' => [
                    'https://images.unsplash.com/photo-1612287233261-7108920b7c12?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '8.00',
                'total_tickets' => 200,
                'sold_ratio' => 0.70,
                'draw_at' => now()->addHours(19),
                'status' => LotteryStatus::Active,
                'user_tickets_count' => 2, // For test user
            ],
            [
                'title' => 'DJI Mini 4 Pro Fly More Combo Plus Drone with RC 2 Smart Controller',
                'description' => 'Under 249g ultra-lightweight drone with omnidirectional active obstacle sensing, 4K/60fps HDR true vertical video, 20km FHD video transmission, 34-min flight time batteries, and two-way charging hub.',
                'media' => [
                    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '18.00',
                'total_tickets' => 180,
                'sold_ratio' => 0.50,
                'draw_at' => now()->addHours(22),
                'status' => LotteryStatus::Active,
            ],

            // Ending in 2 to 7 days
            [
                'title' => 'Porsche 911 GT3 RS Nürburgring Nordschleife VIP Track Day Experience',
                'description' => 'Includes 10 hot laps in the 518hp 911 GT3 RS with Porsche factory test drivers, pro telemetry analysis, 4 nights at the Lindner Nürburgring Congress Hotel, all VIP track access, and business class flights.',
                'media' => [
                    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '75.00',
                'total_tickets' => 500,
                'sold_ratio' => 0.58,
                'draw_at' => now()->addDays(3),
                'status' => LotteryStatus::Active,
                'user_tickets_count' => 1, // For test user
            ],
            [
                'title' => '2024 Ducati Panigale V4 S Track Package + Custom Dainese Suit & AGV Helmet',
                'description' => 'Exclusive weekend VIP track pass with professional superbike coaching, full Dainese custom-fitted leather suit, AGV Pista GP RR carbon helmet, and 3 nights luxury paddock hospitality.',
                'media' => [
                    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 350,
                'sold_ratio' => 0.60,
                'draw_at' => now()->addDays(4),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Apple MacBook Pro 16" M3 Max (36GB Unified RAM, 1TB SSD, Space Black)',
                'description' => '16-core CPU, 40-core GPU, Liquid Retina XDR display with 1600 nits peak brightness, 22-hour battery life, 140W USB-C Power Adapter, and complete AppleCare+ 3-year accidental coverage plan.',
                'media' => [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '30.00',
                'total_tickets' => 280,
                'sold_ratio' => 0.40,
                'draw_at' => now()->addDays(2),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Leica Q3 Compact Full-Frame Digital Camera & Handcrafted Leather Kit',
                'description' => '60-megapixel BSI CMOS full-frame sensor with Summilux 28mm f/1.7 ASPH prime lens, 8K video recording, phase detection hybrid AF, wireless charging handgrip, and Oberwerth German leather bag.',
                'media' => [
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '35.00',
                'total_tickets' => 220,
                'sold_ratio' => 0.30,
                'draw_at' => now()->addDays(5),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Omega Speedmaster Moonwatch Professional Co-Axial Master Chronometer',
                'description' => 'Hesalite glass reference 310.30.42.50.01.001 with manual-winding Calibre 3861 movement, METAS certified chronometer resistant to 15,000 gauss magnetic fields, with commemorative moon presentation box.',
                'media' => [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '25.00',
                'total_tickets' => 300,
                'sold_ratio' => 0.42,
                'draw_at' => now()->addDays(5)->addHours(12),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Audemars Piguet Royal Oak Offshore Chronograph 42mm (Titanium & Ceramic)',
                'description' => 'Reference 26480TI.OO.A027CA.01 with blue "Méga Tapisserie" dial, grey counters, white gold applied hour-markers, self-winding Manufacture Calibre 3126 / 3840 with 50-hour power reserve.',
                'media' => [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '150.00',
                'total_tickets' => 400,
                'sold_ratio' => 0.55,
                'draw_at' => now()->addDays(6),
                'status' => LotteryStatus::Active,
            ],
            [
                'title' => 'Tesla Cybertruck Cyberbeast Founders Edition Experience & Overland Gear',
                'description' => 'Tri-motor 845hp Cyberbeast 3-day overland safari expedition through Moab red rocks, complete Starlink Roam mini setup, Camp Mode mattress kit, luxury glamping lodge, and GoPro 360 drone footage.',
                'media' => [
                    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '100.00',
                'total_tickets' => 600,
                'sold_ratio' => 0.30,
                'draw_at' => now()->addDays(7),
                'status' => LotteryStatus::Active,
            ],

            // 1 Active Lottery Ready-To-Draw (draw_at in past) to test admin "Run Draw Engine"
            [
                'title' => 'GoPro HERO12 Black Creator Edition (Media Mod, Light Mod & Volta Grip)',
                'description' => 'Complete all-in-one vlogging and adventure rig: HERO12 Black with 5.3K HDR video, Enduro battery, directional audio mic mod, continuous 4-hour battery grip, and LED fill light.',
                'media' => [
                    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '5.00',
                'total_tickets' => 100,
                'sold_ratio' => 1.0,
                'draw_at' => now()->subMinutes(10), // Overdue for draw test
                'status' => LotteryStatus::Active,
            ],
        ];

        foreach ($activeItems as $data) {
            $soldRatio = $data['sold_ratio'];
            $userTicketsCount = $data['user_tickets_count'] ?? 0;
            unset($data['sold_ratio'], $data['user_tickets_count']);

            $soldCount = (int) round($data['total_tickets'] * $soldRatio);
            $data['tickets_sold'] = $soldCount;
            $data['created_by'] = $admin->id;

            $lottery = Lottery::create($data);

            $ticketRows = [];
            $assignedToUser = 0;
            for ($i = 0; $i < $soldCount; $i++) {
                if ($assignedToUser < $userTicketsCount && ($yabuUser || $testUser)) {
                    $ownerId = $yabuUser ? $yabuUser->id : $testUser->id;
                    $assignedToUser++;
                } else {
                    $ownerId = $communityUserIds[$i % $userCount];
                }

                $ticketRows[] = [
                    'lottery_id' => $lottery->id,
                    'user_id' => $ownerId,
                    'ticket_code' => 'TKT-'.strtoupper(Str::random(7)),
                    'price_paid' => $lottery->ticket_price,
                    'status' => TicketStatus::Active->value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if ($yabuUser && $testUser && $assignedToUser > 0) {
                $ticketRows[] = [
                    'lottery_id' => $lottery->id,
                    'user_id' => $testUser->id,
                    'ticket_code' => 'TKT-'.strtoupper(Str::random(7)),
                    'price_paid' => $lottery->ticket_price,
                    'status' => TicketStatus::Active->value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $lottery->increment('tickets_sold');
            }

            foreach (array_chunk($ticketRows, 250) as $chunk) {
                Ticket::insert($chunk);
            }
        }

        // =========================================================================
        // 2. COMPLETED LOTTERIES (16 items with deterministic DrawLogs & Winners)
        // =========================================================================
        $completedItems = [
            [
                'title' => 'Rolex Cosmograph Daytona 40mm (18ct White Gold & Oysterflex Bracelet)',
                'description' => 'Iconic racing chronograph reference 126519LN featuring black dial with sundust counters, Cerachrom black ceramic tachymetric bezel, and 4131 manufacture caliber with column wheel and vertical clutch.',
                'media' => [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 400,
                'tickets_sold' => 400,
                'draw_at' => now()->subHours(4),
                'winner_email' => 'yabume123@gmail.com', // Yabu won!
            ],
            [
                'title' => 'Apple Vision Pro 1TB Spatial Computer & Dual Loop Band Set',
                'description' => 'Revolutionary spatial computing device with 23 million pixels across two micro-OLED displays, eye tracking, hand gesture control, and spatial audio with custom optical inserts.',
                'media' => [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '25.00',
                'total_tickets' => 200,
                'tickets_sold' => 200,
                'draw_at' => now()->subDays(1)->subHours(3),
                'winner_email' => 'yabume123@gmail.com', // Yabu won!
            ],
            [
                'title' => '2024 BMW M4 Competition Coupe VIP Track Experience & Pro Coaching',
                'description' => '503hp TwinPower Turbo BMW M4 track day at Circuit of the Americas (COTA) with professional IMSA drivers, telemetry datalogging, paddock suites, and all gear provided.',
                'media' => [
                    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '45.00',
                'total_tickets' => 300,
                'tickets_sold' => 300,
                'draw_at' => now()->subDays(2),
                'winner_email' => 'sophia.chen@example.com',
            ],
            [
                'title' => 'Patek Philippe Aquanaut 5167A Stainless Steel Watch (Black Embossed Dial)',
                'description' => 'Modern sporty elegance reference 5167A-001 with self-winding Calibre 26-330 S C, composite "Tropical" strap, fold-over clasp, and sapphire crystal case back.',
                'media' => [
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '100.00',
                'total_tickets' => 500,
                'tickets_sold' => 500,
                'draw_at' => now()->subDays(3),
                'winner_email' => 'marcus.vance@example.com',
            ],
            [
                'title' => 'Sony Alpha A1 Flagship Mirrorless Camera & FE 24-70mm F2.8 GM II Lens',
                'description' => '50.1 MP full-frame stacked Exmor RS sensor, 30fps continuous shooting with AF/AE tracking, 8K 30p and 4K 120p video, with the world lightest standard zoom G Master lens.',
                'media' => [
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '35.00',
                'total_tickets' => 250,
                'tickets_sold' => 250,
                'draw_at' => now()->subDays(4),
                'winner_email' => 'elena.rostova@example.com',
            ],
            [
                'title' => 'Luxury 5-Star Private Overwater Villa in Maldives (7 Nights All-Inclusive)',
                'description' => 'Seven nights at the Soneva Jani Maldives overwater villa with private retractable roof for stargazing, infinity plunge pool, water slide directly into lagoon, and private butler.',
                'media' => [
                    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '60.00',
                'total_tickets' => 350,
                'tickets_sold' => 350,
                'draw_at' => now()->subDays(5),
                'winner_email' => 'liam.oconnor@example.com',
            ],
            [
                'title' => 'Rolex GMT-Master II "Pepsi" 126710BLRO (Oystersteel & Jubilee Bracelet)',
                'description' => 'Bidirectional rotatable 24-hour bezel with red and blue Cerachrom insert, black dial, calibre 3285 movement with 70 hours power reserve, and supple 5-link Jubilee bracelet.',
                'media' => [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 450,
                'tickets_sold' => 450,
                'draw_at' => now()->subDays(6),
                'winner_email' => 'isabella.rossi@example.com',
            ],
            [
                'title' => 'Alienware Aurora R16 RTX 4090 Liquid-Cooled Gaming Battlestation',
                'description' => 'Intel Core i9-14900KF, NVIDIA GeForce RTX 4090 24GB GDDR6X, 64GB DDR5 5600MHz RAM, 4TB NVMe M.2 SSD, Alienware Cryo-Tech liquid cooling, and Alienware 34" Curved QD-OLED monitor.',
                'media' => [
                    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '25.00',
                'total_tickets' => 240,
                'tickets_sold' => 240,
                'draw_at' => now()->subDays(7),
                'winner_email' => 'lucas.silva@example.com',
            ],
            [
                'title' => 'Hasselblad X2D 100C Medium Format Camera + XCD 55mm f/2.5 V Lens',
                'description' => '100-megapixel medium format BSI CMOS sensor with 16-bit color depth, built-in 1TB SSD storage, 5-axis 7-stop in-body image stabilization (IBIS), and Hasselblad Natural Colour Solution.',
                'media' => [
                    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 260,
                'tickets_sold' => 260,
                'draw_at' => now()->subDays(8),
                'winner_email' => 'zara.ahmed@example.com',
            ],
            [
                'title' => 'Royal Caribbean Icon of the Seas Ultimate Family Townhouse 7-Night Cruise',
                'description' => 'Three-story Ultimate Family Townhouse suite featuring in-suite slide, karaoke station, whirlpool on private balcony, VIP Royal Suite Class concierge, and Caribbean ports itinerary.',
                'media' => [
                    'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '80.00',
                'total_tickets' => 400,
                'tickets_sold' => 400,
                'draw_at' => now()->subDays(9),
                'winner_email' => 'david.kim@example.com',
            ],
            [
                'title' => 'Cartier Santos de Cartier Large Model (Stainless Steel & ADLC Bezel)',
                'description' => 'Reference WSSA0037 with mechanical movement with automatic winding 1847 MC, steel case with ADLC bezel, crown set with a faceted synthetic black spinel, and QuickSwitch strap system.',
                'media' => [
                    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '30.00',
                'total_tickets' => 280,
                'tickets_sold' => 280,
                'draw_at' => now()->subDays(10),
                'winner_email' => 'chloe.frazer@example.com',
            ],
            [
                'title' => 'TAG Heuer Monaco Calibre 11 Automatic Chronograph (Gulf Special Edition)',
                'description' => 'The iconic square 39mm stainless steel chronograph worn by Steve McQueen with Gulf stripes and logo, Calibre 11 movement with left-hand crown, and perforated blue leather racing strap.',
                'media' => [
                    'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '25.00',
                'total_tickets' => 250,
                'tickets_sold' => 250,
                'draw_at' => now()->subDays(11),
                'winner_email' => 'nathan.drake@example.com',
            ],
            [
                'title' => 'Gibson Custom 1959 Les Paul Standard Reissue VOS Electric Guitar',
                'description' => 'Historic 1959 Les Paul reissue in Dirty Lemon burst with figured maple top, lightweight solid mahogany body, CustomBucker unpotted pickups, and Gibson Custom brown/pink hardshell case.',
                'media' => [
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '35.00',
                'total_tickets' => 220,
                'tickets_sold' => 220,
                'draw_at' => now()->subDays(12),
                'winner_email' => 'victor.sullivan@example.com',
            ],
            [
                'title' => 'Apple Ultimate Studio Setup: Mac Studio M2 Ultra + Studio Display + Magic Trio',
                'description' => 'Mac Studio with 24-core CPU, 76-core GPU, 128GB Unified Memory, 2TB SSD, 27-inch 5K Studio Display with Nano-texture glass and tilt-adjustable stand, Magic Keyboard with Touch ID and Magic Trackpad.',
                'media' => [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '30.00',
                'total_tickets' => 300,
                'tickets_sold' => 300,
                'draw_at' => now()->subDays(13),
                'winner_email' => 'samantha.geller@example.com',
            ],
            [
                'title' => 'Yamaha YZF-R1M Carbon Track Superbike Experience & VIP MotoGP Paddock Pass',
                'description' => 'Full weekend track telemetry session with Yamaha factory engineers, electronic racing suspension (ERS), Carbon Fibre bodywork, full titanium exhaust system, and VIP MotoGP pass.',
                'media' => [
                    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '40.00',
                'total_tickets' => 320,
                'tickets_sold' => 320,
                'draw_at' => now()->subDays(14),
                'winner_email' => 'jordan.belfort@example.com',
            ],
            [
                'title' => 'Breitling Navitimer B01 Chronograph 43mm (Ice Blue Dial & Alligator Strap)',
                'description' => 'Aviation chronometer reference AB0138241C1P1 with striking ice blue dial, circular slide rule bezel, Breitling Manufacture Calibre 01, and black Louisiana alligator leather strap.',
                'media' => [
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '30.00',
                'total_tickets' => 280,
                'tickets_sold' => 280,
                'draw_at' => now()->subDays(15),
                'winner_email' => 'demo@itemlottery.com', // Sarah Connor won!
            ],
        ];

        foreach ($completedItems as $cData) {
            $winnerEmail = $cData['winner_email'];
            unset($cData['winner_email']);

            $cData['status'] = LotteryStatus::Completed;
            $cData['created_by'] = $admin->id;

            $lottery = Lottery::create($cData);

            $winningUser = User::where('email', $winnerEmail)->first() ?? $testUser;

            // 1. Create winning ticket
            $winningTicket = Ticket::create([
                'lottery_id' => $lottery->id,
                'user_id' => $winningUser->id,
                'ticket_code' => 'WIN-'.strtoupper(Str::random(7)),
                'price_paid' => $lottery->ticket_price,
                'status' => TicketStatus::Won,
                'created_at' => $lottery->draw_at->subHours(2),
                'updated_at' => $lottery->draw_at,
            ]);

            $lottery->update(['winning_ticket_id' => $winningTicket->id]);

            // 2. Build remaining lost tickets in bulk
            $lostBatch = [];
            $participatingUsers = array_filter([$yabuUser, $testUser]);
            foreach ($participatingUsers as $pUser) {
                if ($winningUser->id !== $pUser->id && in_array($lottery->title, [
                    '2024 BMW M4 Competition Coupe VIP Track Experience & Pro Coaching',
                    'Patek Philippe Aquanaut 5167A Stainless Steel Watch (Black Embossed Dial)',
                    'Sony Alpha A1 Flagship Mirrorless Camera & FE 24-70mm F2.8 GM II Lens',
                    'Luxury 5-Star Private Overwater Villa in Maldives (7 Nights All-Inclusive)',
                    'Rolex GMT-Master II "Pepsi" 126710BLRO (Oystersteel & Jubilee Bracelet)',
                    'Alienware Aurora R16 RTX 4090 Liquid-Cooled Gaming Battlestation',
                ])) {
                    $lostBatch[] = [
                        'lottery_id' => $lottery->id,
                        'user_id' => $pUser->id,
                        'ticket_code' => 'TKT-'.strtoupper(Str::random(7)),
                        'price_paid' => $lottery->ticket_price,
                        'status' => TicketStatus::Lost->value,
                        'created_at' => $lottery->draw_at->subHours(3),
                        'updated_at' => $lottery->draw_at,
                    ];
                }
            }

            $needed = $lottery->tickets_sold - 1 - count($lostBatch);
            for ($i = 0; $i < $needed; $i++) {
                $lostBatch[] = [
                    'lottery_id' => $lottery->id,
                    'user_id' => $communityUserIds[$i % $userCount],
                    'ticket_code' => 'TKT-'.strtoupper(Str::random(7)),
                    'price_paid' => $lottery->ticket_price,
                    'status' => TicketStatus::Lost->value,
                    'created_at' => $lottery->draw_at->subHours(4),
                    'updated_at' => $lottery->draw_at,
                ];
            }

            foreach (array_chunk($lostBatch, 250) as $chunk) {
                Ticket::insert($chunk);
            }

            // Create deterministic DrawLog
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

        // =========================================================================
        // 3. CANCELLED LOTTERIES (2 items with Refunded Tickets)
        // =========================================================================
        $cancelledItems = [
            [
                'title' => '2023 Harley-Davidson CVO Road Glide Limited Custom Edition',
                'description' => 'Exclusive custom vehicle operations touring motorcycle with Milwaukee-Eight 117 V-Twin engine, Rockford Fosgate Stage II audio, Kahuna collection accessories, and custom paintwork.',
                'media' => [
                    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '75.00',
                'total_tickets' => 300,
                'tickets_sold' => 150,
                'draw_at' => now()->subDays(5),
                'status' => LotteryStatus::Cancelled,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Luxury Aspen Snowmass 5-Bedroom Ski Chalet Weekend Retreat',
                'description' => 'Three nights in ski-in/ski-out luxury chalet with heated private terrace, outdoor hot tub, full ski equipment concierge, private chef dinners, and mountain lift passes for 8 guests.',
                'media' => [
                    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '50.00',
                'total_tickets' => 200,
                'tickets_sold' => 100,
                'draw_at' => now()->subDays(3),
                'status' => LotteryStatus::Cancelled,
                'created_by' => $admin->id,
            ],
        ];

        foreach ($cancelledItems as $canData) {
            $lottery = Lottery::create($canData);

            $refBatch = [];
            if ($lottery->title === '2023 Harley-Davidson CVO Road Glide Limited Custom Edition') {
                foreach (array_filter([$yabuUser, $testUser]) as $pUser) {
                    for ($k = 0; $k < 3; $k++) {
                        $refBatch[] = [
                            'lottery_id' => $lottery->id,
                            'user_id' => $pUser->id,
                            'ticket_code' => 'TKT-'.strtoupper(Str::random(7)),
                            'price_paid' => $lottery->ticket_price,
                            'status' => TicketStatus::Refunded->value,
                            'created_at' => now()->subDays(6),
                            'updated_at' => now()->subDays(5),
                        ];
                    }
                }
            }

            $currentCount = count($refBatch);
            for ($i = $currentCount; $i < $lottery->tickets_sold; $i++) {
                $refBatch[] = [
                    'lottery_id' => $lottery->id,
                    'user_id' => $communityUserIds[$i % $userCount],
                    'ticket_code' => 'TKT-'.strtoupper(Str::random(7)),
                    'price_paid' => $lottery->ticket_price,
                    'status' => TicketStatus::Refunded->value,
                    'created_at' => now()->subDays(6),
                    'updated_at' => now()->subDays(5),
                ];
            }

            foreach (array_chunk($refBatch, 250) as $chunk) {
                Ticket::insert($chunk);
            }
        }

        // =========================================================================
        // 4. DRAFT LOTTERIES (2 items for Admin Draft tab)
        // =========================================================================
        $draftItems = [
            [
                'title' => '2025 Aston Martin Vantage GT3 Track Experience at Silverstone Circuit',
                'description' => 'Experience the newly redesigned 656hp Vantage on the iconic Silverstone Grand Prix circuit with Aston Martin Racing works drivers and high-speed telemetry.',
                'media' => [
                    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '100.00',
                'total_tickets' => 300,
                'tickets_sold' => 0,
                'draw_at' => now()->addDays(14),
                'status' => LotteryStatus::Draft,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Richard Mille RM 011 Felipe Massa Flyback Chronograph Exhibition Item',
                'description' => 'Grade 5 titanium curved tonneau case, skeletonized automatic winding movement with hours, minutes, seconds, 60-minute countdown timer, 12-hour totalizer, and oversize date display.',
                'media' => [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                ],
                'ticket_price' => '250.00',
                'total_tickets' => 500,
                'tickets_sold' => 0,
                'draw_at' => now()->addDays(30),
                'status' => LotteryStatus::Draft,
                'created_by' => $admin->id,
            ],
        ];

        foreach ($draftItems as $draftData) {
            Lottery::create($draftData);
        }
    }
}
