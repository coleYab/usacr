<?php

use App\Http\Controllers\Admin\DepositController as AdminDepositController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/app/dashboard')->name('dashboard');

    Route::prefix('app')->name('app.')->group(function () {
        Route::inertia('dashboard', 'app/dashboard')->name('dashboard');
        Route::inertia('lotteries', 'app/lotteries')->name('lotteries');
        Route::inertia('tickets', 'app/tickets')->name('tickets');

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
    Route::inertia('lotteries', 'admin/lotteries')->name('lotteries');
    Route::inertia('users', 'admin/users')->name('users');
    Route::inertia('audit', 'admin/audit')->name('audit');
});

require __DIR__.'/settings.php';
