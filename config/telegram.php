<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Telegram Bot
    |--------------------------------------------------------------------------
    |
    | The bot token and username come from BotFather. The bot powers the
    | Telegram Mini App that hosts this application.
    |
    */

    'bot_token' => env('TELEGRAM_BOT_TOKEN', ''),

    'bot_username' => env('TELEGRAM_BOT_USERNAME', ''),

    /*
    |--------------------------------------------------------------------------
    | Admin Telegram IDs
    |--------------------------------------------------------------------------
    |
    | A comma-separated list of Telegram user IDs that are allowed to access
    | the admin area. A user logging in via Telegram is granted the admin role
    | when their Telegram ID appears in this list.
    |
    */

    'admin_ids' => array_values(array_filter(array_map(
        static fn (string $id): string => trim($id),
        explode(',', (string) env('TELEGRAM_ADMIN_IDS', '')),
    ))),

    /*
    |--------------------------------------------------------------------------
    | Auth Date Lifetime
    |--------------------------------------------------------------------------
    |
    | Telegram initData older than this many seconds is rejected as stale to
    | prevent replay attacks.
    |
    */

    'auth_date_lifetime' => (int) env('TELEGRAM_AUTH_DATE_LIFETIME', 300),
];
