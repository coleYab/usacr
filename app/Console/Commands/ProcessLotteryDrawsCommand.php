<?php

namespace App\Console\Commands;

use App\Services\DrawService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('lotteries:process-draws')]
#[Description('Execute automated draws for due lotteries and notify winners')]
class ProcessLotteryDrawsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(DrawService $drawService): int
    {
        $this->info('Checking for due lottery draws...');

        $processed = $drawService->processPendingDraws();

        $count = count($processed);
        $this->info("Successfully processed {$count} lottery draw(s).");

        return self::SUCCESS;
    }
}
