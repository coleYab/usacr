<?php

namespace App\Http\Middleware;

use App\Services\TelegramService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyTelegramInitData
{
    public function __construct(
        protected TelegramService $telegram,
    ) {}

    /**
     * Validate the Telegram initData and attach the verified payload.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $initData = $request->header('X-Telegram-Init-Data', (string) $request->input('initData'));

        if ($initData === '') {
            abort(401, 'Missing Telegram init data.');
        }

        try {
            $payload = $this->telegram->validateInitData($initData);
        } catch (\InvalidArgumentException) {
            abort(403, 'Invalid Telegram init data.');
        }

        $request->attributes->set('telegram', $payload);

        return $next($request);
    }
}
