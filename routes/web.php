<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/app/dashboard')->name('dashboard');

    Route::prefix('app')->name('app.')->group(function () {
        Route::inertia('dashboard', 'app/dashboard')->name('dashboard');
        Route::inertia('lotteries', 'app/lotteries')->name('lotteries');
        Route::inertia('tickets', 'app/tickets')->name('tickets');
        Route::inertia('wallet', 'app/wallet')->name('wallet');
    });
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');

    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
    Route::inertia('deposits', 'admin/deposits')->name('deposits');
    Route::inertia('lotteries', 'admin/lotteries')->name('lotteries');
    Route::inertia('users', 'admin/users')->name('users');
    Route::inertia('audit', 'admin/audit')->name('audit');
});

require __DIR__.'/settings.php';
