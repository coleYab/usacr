<?php

use App\Http\Controllers\Admin\AuditController as AdminAuditController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DepositController as AdminDepositController;
use App\Http\Controllers\Admin\DrawController as AdminDrawController;
use App\Http\Controllers\Admin\LotteryController as AdminLotteryController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LotteryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('results', [ResultController::class, 'index'])->name('results');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/app/dashboard')->name('dashboard');

    Route::prefix('app')->name('app.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('lotteries', [LotteryController::class, 'index'])->name('lotteries');
        Route::get('lotteries/{lottery}', [LotteryController::class, 'show'])->name('lotteries.show');
        Route::post('lotteries/{lottery}/purchase', [LotteryController::class, 'purchase'])->name('lotteries.purchase');

        Route::get('tickets', [TicketController::class, 'index'])->name('tickets');
        Route::get('results', [ResultController::class, 'index'])->name('results');

        Route::get('wallet', [WalletController::class, 'index'])->name('wallet');
        Route::post('wallet/deposits', [WalletController::class, 'store'])->name('wallet.deposits.store');

        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    });
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');

    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('deposits', [AdminDepositController::class, 'index'])->name('deposits');
    Route::post('deposits/{deposit}/approve', [AdminDepositController::class, 'approve'])->name('deposits.approve');
    Route::post('deposits/{deposit}/reject', [AdminDepositController::class, 'reject'])->name('deposits.reject');

    Route::get('lotteries', [AdminLotteryController::class, 'index'])->name('lotteries');
    Route::get('lotteries/create', [AdminLotteryController::class, 'create'])->name('lotteries.create');
    Route::post('lotteries', [AdminLotteryController::class, 'store'])->name('lotteries.store');
    Route::get('lotteries/{lottery}', [AdminLotteryController::class, 'show'])->name('lotteries.show');
    Route::post('lotteries/{lottery}/cancel', [AdminLotteryController::class, 'cancel'])->name('lotteries.cancel');

    Route::get('draws', [AdminDrawController::class, 'index'])->name('draws');
    Route::post('draws/run', [AdminDrawController::class, 'run'])->name('draws.run');

    Route::get('users', [AdminUserController::class, 'index'])->name('users');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::post('users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('users.status');
    Route::post('users/{user}/adjust-wallet', [AdminUserController::class, 'adjustWallet'])->name('users.adjust-wallet');

    Route::get('audit', [AdminAuditController::class, 'index'])->name('audit');
});

require __DIR__.'/settings.php';
