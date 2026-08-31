<?php

use App\Http\Controllers\Admin\DepositController as AdminDepositController;
use App\Http\Controllers\Admin\LotteryController as AdminLotteryController;
use App\Http\Controllers\LotteryController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/app/dashboard')->name('dashboard');

    Route::prefix('app')->name('app.')->group(function () {
        Route::inertia('dashboard', 'app/dashboard')->name('dashboard');

        Route::get('lotteries', [LotteryController::class, 'index'])->name('lotteries');
        Route::get('lotteries/{lottery}', [LotteryController::class, 'show'])->name('lotteries.show');
        Route::post('lotteries/{lottery}/purchase', [LotteryController::class, 'purchase'])->name('lotteries.purchase');

        Route::get('tickets', [TicketController::class, 'index'])->name('tickets');

        Route::get('wallet', [WalletController::class, 'index'])->name('wallet');
        Route::post('wallet/deposits', [WalletController::class, 'store'])->name('wallet.deposits.store');
    });
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');

    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
    Route::get('deposits', [AdminDepositController::class, 'index'])->name('deposits');
    Route::post('deposits/{deposit}/approve', [AdminDepositController::class, 'approve'])->name('deposits.approve');
    Route::post('deposits/{deposit}/reject', [AdminDepositController::class, 'reject'])->name('deposits.reject');

    Route::get('lotteries', [AdminLotteryController::class, 'index'])->name('lotteries');
    Route::get('lotteries/create', [AdminLotteryController::class, 'create'])->name('lotteries.create');
    Route::post('lotteries', [AdminLotteryController::class, 'store'])->name('lotteries.store');
    Route::get('lotteries/{lottery}', [AdminLotteryController::class, 'show'])->name('lotteries.show');
    Route::post('lotteries/{lottery}/cancel', [AdminLotteryController::class, 'cancel'])->name('lotteries.cancel');

    Route::inertia('users', 'admin/users')->name('users');
    Route::inertia('audit', 'admin/audit')->name('audit');
});

require __DIR__.'/settings.php';
